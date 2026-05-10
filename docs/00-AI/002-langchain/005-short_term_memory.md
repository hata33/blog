State 不是变量，是"快照" Messages 是特殊的，自动处理 持久化是"自动驾驶"
Short-term memory = Checkpointer + thread_id
配置一次 checkpointer，每次调用带上 thread_id，LangGraph 自动处理状态的保存、恢复、版本管理。就像浏览器给每个网站分配独立的 localStorage，刷新页面数据还在。
一个 thread_id = 一个独立的会话上下文




基于 Short-term memory 文档，按"一个模块 = 一个可独立约束的知识点"原则划分：

| 模块 | 核心知识点 | 为什么独立 |
|------|----------|-----------|
| **1. Checkpointer 基础配置** | `checkpointer` 参数注入、`InMemorySaver`（开发）vs `PostgresSaver`（生产）、`thread_id` 会话隔离 | 记忆系统的基础，最核心的配置模式 |
| **2. 自定义 Agent State** | 继承 `AgentState` 扩展自定义字段、`state_schema` 参数、`invoke` 时传入自定义状态 | State 结构定义是独立的知识点，与 checkpointer 配置分离 |
| **3. 修剪消息（Trim Messages）** | `@before_model` 中间件、`RemoveMessage` + `REMOVE_ALL_MESSAGES`、保留最近 N 条消息的策略 | 一种独立的上下文管理策略，有专属的代码模式 |
| **4. 删除消息（Delete Messages）** | `RemoveMessage(id=m.id)` 删除指定消息、`REMOVE_ALL_MESSAGES` 清空全部、`@after_model` 中间件 | 与修剪不同的操作模式（指定删除 vs 保留最后 N 条），删除后需验证消息合法性 |
| **5. 摘要消息（Summarize Messages）** | `SummarizationMiddleware` 内置中间件、`trigger` 和 `keep` 参数配置 | 使用内置中间件，代码模式与手动修剪/删除完全不同 |
| **6. 工具中访问记忆** | `runtime.state` 读取、`Command(update=...)` 写入、`ToolRuntime` 泛型指定 State 类型 | 工具是独立的访问入口，代码模式不同于中间件 |
| **7. Prompt 中访问记忆** | `@dynamic_prompt` 读取 context、注入个性化 system prompt | 动态 prompt 是独立的访问入口 |
| **8. Before Model 中访问记忆** | `@before_model` 中间件、模型调用前处理 State、返回 dict 更新 State | 与 after_model 对称但执行时机不同，策略可不同 |
| **9. After Model 中访问记忆** | `@after_model` 中间件、模型调用后验证/过滤响应、返回 dict 删除消息 | 执行时机在模型返回之后，典型用途是内容过滤 |
 

# 约束：LangChain Checkpointer 基础配置的代码规范

## 技术边界
- 短期记忆通过 `checkpointer` 参数注入 `create_agent`，在每次 `invoke` 时自动持久化 State
- 同一 `thread_id` 的消息自动拼接为完整对话历史，不同 `thread_id` 完全隔离
- 开发/测试用 `InMemorySaver`（进程重启即丢失），生产环境必须用数据库 checkpointer
- `PostgresSaver` 需要 `langgraph-checkpoint-postgres` 包，通过 `from_conn_string(DB_URI)` 初始化
- `PostgresSaver` 需调用 `.setup()` 自动建表，用完需关闭（推荐用 `with` 语句）
- checkpoint 在每次 `invoke` 或工具调用完成后自动保存，每次步骤开始时自动读取

## 生成要求

### 1. 开发环境
```python
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent

agent = create_agent(
    "gpt-5.4",
    tools=[get_user_info],
    checkpointer=InMemorySaver(),
)

agent.invoke(
    {"messages": [{"role": "user", "content": "Hi! My name is Bob."}]},
    {"configurable": {"thread_id": "1"}},
)
```

### 2. 生产环境
```python
from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable"
with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup()
    agent = create_agent(
        "gpt-5.4",
        tools=[get_user_info],
        checkpointer=checkpointer,
    )
```

### 3. thread_id 管理
- `thread_id` 通过 `config={"configurable": {"thread_id": "..."}}` 传入 `invoke`
- 同一会话复用相同 `thread_id`，新会话用新 `thread_id`
- `thread_id` 字符串不可为空

## 反例
- ❌ 生产环境用 `InMemorySaver`
  - ✅ FIX：替换为 `PostgresSaver`、`SqliteSaver` 等持久化实现
- ❌ 同一会话多次调用使用不同 `thread_id`
  - ✅ FIX：固定同一 `thread_id`
- ❌ `PostgresSaver` 不调 `.setup()` 直接使用
  - ✅ FIX：调用 `.setup()` 自动建表
- ❌ `PostgresSaver` 不用 `with` 语句管理生命周期
  - ✅ FIX：使用 `with PostgresSaver.from_conn_string(...) as checkpointer:`

## 验收标准
- [ ] `checkpointer` 已显式传入 `create_agent`
- [ ] `invoke` 的 `config` 中包含 `thread_id`
- [ ] 同一会话复用相同 `thread_id`
- [ ] 生产环境使用数据库 checkpointer

---

# 约束：LangChain 自定义 Agent State 的代码规范

## 技术边界
- 默认 State 是 `AgentState`，只包含 `messages` 字段
- 自定义 State 通过继承 `AgentState` 扩展，必须是 `TypedDict`
- 通过 `create_agent` 的 `state_schema` 参数传入自定义 State
- 自定义 State 的字段在 `invoke` 时与 `messages` 并列传入
- 自定义字段被持久化到 checkpoint，同一 `thread_id` 后续调用可访问

## 生成要求

```python
from langchain.agents import create_agent, AgentState

class CustomAgentState(AgentState):
    user_id: str
    preferences: dict

agent = create_agent(
    "gpt-5.4",
    tools=[get_user_info],
    state_schema=CustomAgentState,
    checkpointer=InMemorySaver(),
)

result = agent.invoke(
    {
        "messages": [{"role": "user", "content": "Hello"}],
        "user_id": "user_123",
        "preferences": {"theme": "dark"},
    },
    {"configurable": {"thread_id": "1"}},
)
```

## 反例
- ❌ 用 Pydantic `BaseModel` 或 `dataclass` 定义 State
  - ✅ FIX：必须使用 `TypedDict`，继承 `AgentState`
- ❌ 自定义字段与 `messages` 同名
  - ✅ FIX：`messages` 是保留字段，不可覆盖
- ❌ `invoke` 传入自定义字段但不定义 `state_schema`
  - ✅ FIX：先定义 `CustomAgentState(AgentState)` 再传入 `state_schema`

## 验收标准
- [ ] 自定义 State 继承 `AgentState` 且为 `TypedDict`
- [ ] `state_schema` 已传入 `create_agent`
- [ ] `invoke` 时自定义字段与 `messages` 并列
- [ ] 没有覆盖 `messages` 保留字段

---

# 约束：LangChain 修剪消息（Trim Messages）的代码规范

## 技术边界
- 修剪消息在模型调用前通过 `@before_model` 中间件执行
- 核心工具：`RemoveMessage` + `REMOVE_ALL_MESSAGES` 清空后重新放回保留的消息
- `@before_model` 函数签名：`(state: AgentState, runtime: Runtime) -> dict[str, Any] | None`
- 返回 `None` 表示不修改 State
- 返回 dict 时，`messages` 键的值是 `[RemoveMessage(id=REMOVE_ALL_MESSAGES), *保留的消息]`
- 修剪后必须保留 SystemMessage（如有）作为第一条消息

## 生成要求

```python
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langchain.agents.middleware import before_model
from langgraph.runtime import Runtime
from typing import Any

@before_model
def trim_messages(state, runtime: Runtime) -> dict[str, Any] | None:
    messages = state["messages"]
    if len(messages) <= 3:
        return None

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages,
        ]
    }

agent = create_agent(
    model,
    tools=[...],
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)
```

## 反例
- ❌ 直接修改 `state["messages"]` 不返回 dict
  - ✅ FIX：返回 `{"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES), *new_messages]}`
- ❌ 修剪后 SystemMessage 丢失
  - ✅ FIX：保留 `messages[0]`（通常为 SystemMessage）
- ❌ 修剪后消息列表为空
  - ✅ FIX：至少保留一条 HumanMessage 供模型回复
- ❌ `RemoveMessage` 不先清空就直接追加
  - ✅ FIX：`RemoveMessage(id=REMOVE_ALL_MESSAGES)` 必须在 `*new_messages` 前面

## 验收标准
- [ ] 使用 `@before_model` 中间件
- [ ] 返回 `{"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES), *保留的消息]}`
- [ ] SystemMessage 被保留
- [ ] 消息数少时不修剪（返回 `None`）

---

# 约束：LangChain 删除消息（Delete Messages）的代码规范

## 技术边界
- 删除消息通过 `RemoveMessage(id=m.id)` 删除指定消息，或 `RemoveMessage(id=REMOVE_ALL_MESSAGES)` 清空全部
- 可在 `@before_model` 或 `@after_model` 中间件中使用
- 删除后必须确保消息历史仍有效：部分 provider 要求以 user 消息开头、assistant 消息含 tool_calls 后必须跟随 ToolMessage
- `AgentState` 默认使用 `add_messages` reducer，支持 `RemoveMessage`

## 生成要求

### 指定删除
```python
from langchain.messages import RemoveMessage

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > 2:
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}
```

### 清空全部
```python
from langgraph.graph.message import REMOVE_ALL_MESSAGES

def delete_messages(state):
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}
```

### 在 after_model 中使用
```python
from langchain.agents.middleware import after_model

@after_model
def delete_old_messages(state, runtime) -> dict | None:
    messages = state["messages"]
    if len(messages) > 2:
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}
    return None
```

## 反例
- ❌ 删除后 assistant 消息含 tool_calls 但后面没有 ToolMessage
  - ✅ FIX：检查删除后的消息序列是否合法
- ❌ 删除后第一条消息不是 user 或 system 消息
  - ✅ FIX：确保部分 provider 的消息序列要求
- ❌ 使用 `RemoveMessage` 但 State 未使用 `add_messages` reducer
  - ✅ FIX：默认 `AgentState` 使用 `add_messages`，自定义时确保

## 验收标准
- [ ] `RemoveMessage` 已从 `langchain.messages` 导入
- [ ] 删除后消息序列合法（user 开头、工具调用后跟 ToolMessage）
- [ ] 使用 `add_messages` reducer 的 State

---

# 约束：LangChain 摘要消息（Summarize Messages）的代码规范

## 技术边界
- 使用内置 `SummarizationMiddleware`，不需要手动写 `@before_model`
- `model` 参数指定执行摘要的模型（可与 Agent 主模型不同，通常用更便宜的模型）
- `trigger` 参数定义触发条件：`("tokens", 4000)` 表示 Token 数超过 4000 时触发
- `keep` 参数定义保留策略：`("messages", 20)` 表示保留最近 20 条消息
- `SummarizationMiddleware` 自动用摘要替换旧消息，摘要对模型可见

## 生成要求

```python
from langchain.agents.middleware import SummarizationMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-5.4",
    tools=[],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20),
        )
    ],
    checkpointer=InMemorySaver(),
)
```

## 反例
- ❌ 摘要模型和主模型用同一个大型模型（成本高）
  - ✅ FIX：摘要用更便宜的模型（如 `gpt-5.4-mini`）
- ❌ `trigger` 阈值设得比模型上下文窗口还大
  - ✅ FIX：阈值应小于模型最大上下文窗口
- ❌ 不用 `SummarizationMiddleware` 而手动在 `@before_model` 中实现摘要
  - ✅ FIX：优先使用内置中间件

## 验收标准
- [ ] 使用 `SummarizationMiddleware` 内置中间件
- [ ] 摘要模型与主模型分离
- [ ] `trigger` 阈值小于模型上下文窗口
- [ ] `keep` 保留数合理（不过多也不过少）

---

# 约束：LangChain 工具中访问记忆的代码规范

## 技术边界
- 工具通过 `runtime: ToolRuntime` 参数访问 State
- 读取：`runtime.state["key"]` 或 `runtime.state.get("key")`
- 写入：返回 `Command(update={"key": value, "messages": [ToolMessage(...)]})`
- `ToolRuntime` 的泛型可选指定 Context 和 State 类型
- 写入时 `ToolMessage` 的 `tool_call_id` 必须使用 `runtime.tool_call_id`

## 生成要求

### 读取 State
```python
@tool
def get_user_info(runtime: ToolRuntime) -> str:
    """Look up user info."""
    user_id = runtime.state["user_id"]
    return "User is John Smith" if user_id == "user_123" else "Unknown user"
```

### 写入 State
```python
@tool
def update_user_info(runtime: ToolRuntime[CustomContext, CustomState]) -> Command:
    """Look up and update user info."""
    user_id = runtime.context.user_id
    name = "John Smith" if user_id == "user_123" else "Unknown user"
    return Command(update={
        "user_name": name,
        "messages": [
            ToolMessage(
                "Successfully looked up user information",
                tool_call_id=runtime.tool_call_id,
            )
        ],
    })
```

## 反例
- ❌ 直接修改 `runtime.state["key"] = value`
  - ✅ FIX：返回 `Command(update={...})`
- ❌ 写入时不包含 `ToolMessage`
  - ✅ FIX：`messages` 列表中必须有 `ToolMessage`
- ❌ `ToolMessage` 的 `tool_call_id` 硬编码
  - ✅ FIX：使用 `runtime.tool_call_id`

## 验收标准
- [ ] `runtime: ToolRuntime` 已注入
- [ ] 读取时使用 `.get()` 处理不存在键
- [ ] 写入时返回 `Command(update={...})`
- [ ] `ToolMessage` 的 `tool_call_id` 来自 `runtime.tool_call_id`

---

# 约束：LangChain Prompt 中访问记忆的代码规范

## 技术边界
- 通过 `@dynamic_prompt` 装饰器生成动态 System Prompt
- 从 `request.runtime.context` 读取 Context，从 `request.state` 读取 State（如需）
- 函数签名：`(request: ModelRequest) -> str`，返回值为字符串
- 通过 `middleware=[...]` 传入 `create_agent`

## 生成要求

```python
from langchain.agents.middleware import dynamic_prompt, ModelRequest

@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context["user_name"]
    system_prompt = f"You are a helpful assistant. Address the user as {user_name}."
    return system_prompt

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
    middleware=[dynamic_system_prompt],
    context_schema=CustomContext,
)
```

## 反例
- ❌ `@dynamic_prompt` 函数返回 `SystemMessage` 对象
  - ✅ FIX：返回 `str`
- ❌ 直接读 `request.runtime.context["key"]` 不检查 None
  - ✅ FIX：`request.runtime.context` 可能为 None，先检查
- ❌ 用 `@dynamic_prompt` 做复杂业务逻辑
  - ✅ FIX：`@dynamic_prompt` 只负责生成 prompt 字符串

## 验收标准
- [ ] `@dynamic_prompt` 函数返回 `str`
- [ ] 读取 Context 前检查 None
- [ ] 通过 `middleware=[...]` 传入 Agent

---

# 约束：LangChain Before Model 中访问记忆的代码规范

## 技术边界
- `@before_model` 在**每次模型调用前**执行，可能被多次触发（工具调用后再次调用模型时也会触发）
- 函数签名：`(state: AgentState, runtime: Runtime) -> dict[str, Any] | None`
- 返回 `None` 表示不修改 State
- 返回 dict 时，内容合并到 State
- 这是消息修剪/过滤的标准位置

## 生成要求

```python
from langchain.agents.middleware import before_model
from langgraph.runtime import Runtime
from typing import Any

@before_model
def trim_messages(state, runtime: Runtime) -> dict[str, Any] | None:
    messages = state["messages"]
    if len(messages) <= 3:
        return None
    # 修剪逻辑
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES), *new_messages]}

agent = create_agent(
    model,
    tools=[...],
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)
```

## 反例
- ❌ `@before_model` 中修改 `tools` 列表
  - ✅ FIX：修改工具在 `@wrap_model_call` 中，不在 `@before_model`
- ❌ 忘记返回 `None`（不修剪时）
  - ✅ FIX：不修改时明确返回 `None`

## 验收标准
- [ ] 函数正确返回 `dict` 或 `None`
- [ ] 不修改 `tools`/`model`（那是 `wrap_model_call` 的职责）
- [ ] 通过 `middleware=[...]` 传入

---

# 约束：LangChain After Model 中访问记忆的代码规范

## 技术边界
- `@after_model` 在**每次模型调用后**执行，含工具调用后的模型调用
- 函数签名：`(state: AgentState, runtime: Runtime) -> dict | None`
- 返回 dict 时内容合并到 State，返回 `None` 不修改
- 典型用途：验证模型响应、过滤敏感词、删除不安全消息

## 生成要求

```python
from langchain.agents.middleware import after_model
from langchain.messages import RemoveMessage

@after_model
def validate_response(state, runtime) -> dict | None:
    STOP_WORDS = ["password", "secret"]
    last_message = state["messages"][-1]
    if any(word in last_message.content for word in STOP_WORDS):
        return {"messages": [RemoveMessage(id=last_message.id)]}
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[],
    middleware=[validate_response],
    checkpointer=InMemorySaver(),
)
```

## 反例
- ❌ `@after_model` 中修改 `tools` 或 `model`
  - ✅ FIX：这些在 `wrap_model_call` 中修改
- ❌ 检查 `state["messages"][-1]` 不先判断消息列表是否为空
  - ✅ FIX：先检查 `if state["messages"]:` 再取最后一条

## 验收标准
- [ ] 函数正确返回 `dict` 或 `None`
- [ ] 获取最后一条消息前检查列表非空
- [ ] 通过 `middleware=[...]` 传入

---

**以上为 Short-term Memory 文档全部模块的约束，Short-term Memory 章节完结。**