## Tools 模块划分

声明式意识：你定义"能做什么"，AI 决定"何时做"
Schema 意识：输入输出必须"机器可读"
上下文意识：工具需要知道"当前环境"
函数型	输入 → 处理 → 输出	
状态型	访问对话状态
外部型	调用外部服务



runtime 是会话级别（Session Level） 的
任务级	单次 Agent 执行（可能包含多个工具调用）	⚠️ 部分共享	一个用户问题触发的多个工具调用之间
会话级	整个对话会话（多轮问答）	✅ state 和 store 都支持	整个聊天窗口的生命周期
跨会话	多个独立会话	✅ 仅 store 支持	不同天的对话，仍能记住用户
runtime.state 是会话级的（一个对话窗口内共享），runtime.store 是跨会话级的（永久保存），runtime.context 是会话级但只读的。

LangGraph 的 Checkpointer 就像 Pinia + localStorage 的组合——它自动保存状态并在下次加载时恢复，你只需要在“创建应用”（编译图）时配置一次，后续完全自动运行。
如果你的需求是“无论发生什么都保证任务完成”，需要更高级的持久执行（Durable Execution）框架。但对于绝大多数 Agent 应用（聊天机器人、RAG 问答），Checkpointer 完全够用。


| 模块 | 核心知识点 | 为什么独立 |
|------|----------|-----------|
| **1. 基础工具定义** | `@tool` 装饰器的基本用法、类型提示要求、docstring 自动成为工具描述、命名约束（snake_case） | 工具创建的入口，最基础的代码模式 |
| **2. 自定义工具属性** | 自定义工具名（`@tool("name")`）、自定义描述（`description` 参数） | 与基础定义不同的构造函数参数模式 |
| **3. 高级 Schema 定义** | Pydantic `BaseModel` 和 JSON Schema 定义复杂输入参数、`args_schema` 参数、`Field(description=...)` | 复杂参数结构有专属的代码组织方式，不同于纯类型提示 |
| **4. 保留参数名** | `config` 和 `runtime` 不能被工具函数用作参数名 | 这是一个硬约束规则，违反即报错 |
| **5. 访问运行时上下文 — State** | `runtime: ToolRuntime` 参数注入、`runtime.state` 访问消息和自定义状态、`Command` 更新状态 | State 是一种独立的运行时数据源，代码模式与 Context/Store 不同 |
| **6. 访问运行时上下文 — Context** | `context_schema` 定义不可变配置（dataclass）、`runtime.context` 读取、`invoke` 时传入 `context` | Context 是不可变的调用级配置，与可变的 State 有本质区别 |
| **7. 访问运行时上下文 — Store** | `runtime.store` 访问持久化存储、`store.get`/`store.put` 的 namespace/key 模式 | Store 是跨会话持久化的，生命周期与 State 完全不同 |
| **8. Stream Writer** | `runtime.stream_writer` 发送实时进度更新、需在 LangGraph 执行上下文中使用 | 流式反馈是独立功能，有环境依赖 |
| **9. Execution Info & Server Info** | `runtime.execution_info`（thread_id、run_id、重试次数）、`runtime.server_info`（assistant_id、graph_id） | 运行元数据读取，非所有环境可用，有版本要求 |
| **10. ToolNode** | `ToolNode` 的创建、工具返回值类型（字符串/对象/Command）、错误处理（`handle_tool_errors`）、`tools_condition` 条件路由 | ToolNode 是 LangGraph 原生工作流的工具执行节点，代码结构完全不同于 `create_agent` 中的工具使用 |
| **11. 预构建工具** | LangChain 提供的开箱即用工具，通过集成页面查找和导入 | 使用者只需知道如何查找和导入，不需要编写工具定义 |
| **12. 服务端工具** | provider 内置工具（web_search、code interpreter），通过 `bind_tools` 传入 dict schema 而非函数 | 与客户端工具的定义方式完全不同 |

# 约束：LangChain 基础工具定义的代码规范

## 技术边界
- 工具通过 `@tool` 装饰器从普通函数创建，装饰器从 `langchain.tools` 导入
- 函数类型提示**必须存在**，它们定义工具的输入 schema，模型据此生成调用参数
- 函数的 docstring **自动成为工具描述**，模型根据描述决定何时调用该工具
- 工具名默认取自函数名，必须使用 `snake_case`（全小写+下划线）
- 工具名中包含空格或特殊字符会导致部分 provider 报错或拒绝调用
- 服务端工具（web_search、code interpreter）不通过此方式定义，见服务端工具模块

## 生成要求

### 1. 基本工具定义
- 从 `langchain.tools` 导入 `tool`
- 函数必须有类型提示和 docstring
- docstring 第一行写功能概述，Args 块写参数说明

```python
from langchain.tools import tool

@tool
def search_database(query: str, limit: int = 10) -> str:
    """Search the customer database for records matching the query.

    Args:
        query: Search terms to look for
        limit: Maximum number of results to return
    """
    return f"Found {limit} results for '{query}'"
```

### 2. 命名约束
- 函数名使用 `snake_case`，禁用空格和特殊字符
- 工具名由函数名自动确定

## 反例
- ❌ 工具函数没有类型提示
  - ✅ FIX：所有参数和返回值必须有类型提示
- ❌ 工具函数没有 docstring
  - ✅ FIX：docstring 是模型的“使用说明书”，必须写
- ❌ 工具名用驼峰 `def searchDatabase(...)`
  - ✅ FIX：改为 `search_database`
- ❌ docstring 只写实现细节不写功能
  - ✅ FIX：第一句描述工具做什么，模型的决策依赖这个描述

## 验收标准
- [ ] `@tool` 装饰器已从 `langchain.tools` 正确导入
- [ ] 函数所有参数和返回值有类型提示
- [ ] docstring 包含功能描述和 Args 块
- [ ] 函数名全小写+下划线，无空格无特殊字符

---

# 约束：LangChain 自定义工具属性的代码规范

## 技术边界
- 工具名默认与函数名相同，可通过 `@tool("custom_name")` 覆盖
- 工具描述默认来自 docstring，可通过 `@tool(description="...")` 覆盖
- 同时覆盖名称和描述时，使用 `@tool("name", description="...")` 格式
- 自定义名称同样遵循 snake_case 命名约束

## 生成要求

### 1. 自定义工具名
```python
@tool("web_search")
def search(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"
```

### 2. 自定义工具描述
```python
@tool("calculator", description="Performs arithmetic calculations. Use this for any math problems.")
def calc(expression: str) -> str:
    """Evaluate mathematical expressions."""
    return str(eval(expression))
```

## 反例
- ❌ `@tool("Web Search")` — 工具名含空格
  - ✅ FIX：改为 `@tool("web_search")`
- ❌ docstring 空白但仍期望模型正确调用
  - ✅ FIX：无 docstring 时必须通过 `description` 参数提供描述

## 验收标准
- [ ] 自定义工具名遵循 snake_case
- [ ] 无 docstring 时使用 `description` 参数提供描述
- [ ] `@tool` 的第一个参数是字符串（自定义名）或省略（使用函数名）

---

# 约束：LangChain 高级 Schema 定义的代码规范

## 技术边界
- 复杂输入参数通过 `args_schema` 指定，支持 Pydantic `BaseModel` 和 JSON Schema dict 两种格式
- Pydantic 方式使用 `Field(description=...)` 为每个字段添加描述
- JSON Schema 方式必须包含 `type`、`properties`、`required` 三个顶级字段
- `args_schema` 定义的 schema 替代函数类型提示成为模型的调用依据
- 函数参数仍需与 schema 字段一一对应

## 生成要求

### 1. Pydantic 方式（优先）
```python
from pydantic import BaseModel, Field
from typing import Literal

class WeatherInput(BaseModel):
    """Input for weather queries."""
    location: str = Field(description="City name or coordinates")
    units: Literal["celsius", "fahrenheit"] = Field(
        default="celsius",
        description="Temperature unit preference"
    )
    include_forecast: bool = Field(
        default=False,
        description="Include 5-day forecast"
    )

@tool(args_schema=WeatherInput)
def get_weather(location: str, units: str = "celsius", include_forecast: bool = False) -> str:
    """Get current weather and optional forecast."""
    ...
```

### 2. JSON Schema 方式
```python
weather_schema = {
    "type": "object",
    "properties": {
        "location": {"type": "string"},
        "units": {"type": "string"},
        "include_forecast": {"type": "boolean"}
    },
    "required": ["location", "units", "include_forecast"]
}

@tool(args_schema=weather_schema)
def get_weather(location: str, units: str = "celsius", include_forecast: bool = False) -> str:
    """Get current weather and optional forecast."""
    ...
```

## 反例
- ❌ Pydantic schema 中 `Field` 不加 `description`
  - ✅ FIX：每个 `Field` 必须提供 `description`，这是模型理解参数的唯一途径
- ❌ JSON Schema 缺 `required` 字段
  - ✅ FIX：必须列出所有必填字段名
- ❌ schema 中的字段名与函数参数名不一致
  - ✅ FIX：保持两者完全一致

## 验收标准
- [ ] `args_schema` 使用 Pydantic `BaseModel` 或 JSON Schema dict
- [ ] 所有字段有 `description`
- [ ] schema 字段名与函数参数名一致
- [ ] JSON Schema 包含 `type`、`properties`、`required`

---

# 约束：LangChain 工具保留参数名的代码规范

## 技术边界
- `config` 和 `runtime` 是 LangChain 的保留参数名，**绝对不能**作为工具函数的自定义参数
- `config` 预留给内部传递 `RunnableConfig`
- `runtime` 预留给 `ToolRuntime` 参数注入
- 使用这两个名字会导致运行时错误

## 生成要求
- 自定义参数名避免使用 `config` 和 `runtime`
- 如需访问运行时信息，使用 `runtime: ToolRuntime` 参数注入，不可自己命名

```python
# 正确：runtime 作为 ToolRuntime 注入
@tool
def my_tool(query: str, runtime: ToolRuntime) -> str:
    ...

# 错误：自定义参数叫 config
@tool
def my_tool(query: str, config: dict) -> str:  # ❌
    ...
```

## 反例
- ❌ `def search(query: str, config: dict)` — `config` 是保留参数名
  - ✅ FIX：改用其他名字如 `settings`、`options`
- ❌ `def search(query: str, runtime: str)` — `runtime` 用于自定义参数而非 `ToolRuntime`
  - ✅ FIX：改用其他名字，或用 `runtime: ToolRuntime`

## 验收标准
- [ ] 工具函数的参数列表不含 `config` 或 `runtime`（除非 `runtime` 作为 `ToolRuntime` 类型注入）
- [ ] 注入 `ToolRuntime` 时必须使用 `runtime` 这个名字，且有类型提示

---

# 约束：LangChain 工具访问 State 的代码规范

## 技术边界
- State 是当前对话的短期记忆，随会话结束而消失
- 工具通过 `runtime: ToolRuntime` 参数访问 State，该参数对模型不可见
- `runtime.state` 是 dict 类型，`"messages"` 键存储消息历史
- 更新 State 必须通过返回 `Command` 对象，不能直接修改 `runtime.state`
- `Command.update` 中包含 `"messages"` 字段时需加入 `ToolMessage`，使用 `runtime.tool_call_id`
- 并行工具调用可能同时更新同一字段，需为可能冲突的字段定义 reducer

## 生成要求

### 1. 从 State 读取
```python
from langchain.tools import tool, ToolRuntime
from langchain.messages import HumanMessage

@tool
def get_last_user_message(runtime: ToolRuntime) -> str:
    """Get the most recent message from the user."""
    messages = runtime.state["messages"]
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            return message.content
    return "No user messages found"
```

### 2. 更新 State
```python
from langchain.messages import ToolMessage
from langgraph.types import Command

@tool
def set_user_name(new_name: str, runtime: ToolRuntime) -> Command:
    """Set the user's name in the conversation state."""
    return Command(
        update={
            "user_name": new_name,
            "messages": [
                ToolMessage(
                    content=f"User name set to {new_name}.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )
```

## 反例
- ❌ 直接修改 `runtime.state["key"] = value` 而不返回 `Command`
  - ✅ FIX：返回 `Command(update={"key": value, "messages": [ToolMessage(...)]})`
- ❌ 更新 State 时不包含 `ToolMessage`
  - ✅ FIX：`update` 中必须包含 `messages` 及对应的 `ToolMessage`
- ❌ `ToolMessage` 中的 `tool_call_id` 硬编码
  - ✅ FIX：使用 `runtime.tool_call_id`
- ❌ 不定义 reducer 就允许并行工具更新同一字段
  - ✅ FIX：为可能冲突的字段定义 reducer

## 验收标准
- [ ] `runtime: ToolRuntime` 已作为参数注入
- [ ] 读取 State 时用 `.get()` 处理不存在键
- [ ] 更新 State 时返回 `Command` 对象
- [ ] `ToolMessage` 中的 `tool_call_id` 来自 `runtime.tool_call_id`

---

# 约束：LangChain 工具访问 Context 的代码规范

## 技术边界
- Context 是调用时传入的不可变配置数据，对话期间不变
- Context schema 需定义为 dataclass，通过 `create_agent` 的 `context_schema` 参数绑定
- 工具通过 `runtime.context` 读取，`runtime` 的类型泛型指定 schema 类型
- Context 在 `agent.invoke` 时通过 `context` 参数传入
- Context 适用于 user_id、session 信息等调用级配置

## 生成要求

### 1. Context schema 定义
```python
from dataclasses import dataclass

@dataclass
class UserContext:
    user_id: str
```

### 2. 工具中读取 Context
```python
@tool
def get_account_info(runtime: ToolRuntime[UserContext]) -> str:
    """Get the current user's account information."""
    user_id = runtime.context.user_id
    ...
```

### 3. Agent 绑定和调用
```python
agent = create_agent(
    model,
    tools=[get_account_info],
    context_schema=UserContext,
)

result = agent.invoke(
    {"messages": [...]},
    context=UserContext(user_id="user123")
)
```

## 反例
- ❌ Context schema 用普通 class 而非 dataclass
  - ✅ FIX：使用 `@dataclass` 装饰
- ❌ `ToolRuntime` 不写泛型参数 `ToolRuntime[UserContext]`
  - ✅ FIX：显式写泛型以便类型检查
- ❌ 在工具中尝试修改 `runtime.context`
  - ✅ FIX：Context 是不可变的，仅读取
- ❌ Context 值用于确定工具行为但不做 null 检查
  - ✅ FIX：`runtime.context` 可能接收不到值，检查 None

## 验收标准
- [ ] Context schema 使用 `@dataclass` 定义
- [ ] `ToolRuntime` 已指定泛型类型
- [ ] `create_agent` 传入了 `context_schema`
- [ ] `invoke` 时传入了 `context` 实例

---

# 约束：LangChain 工具访问 Store 的代码规范

## 技术边界
- Store 是跨会话的持久化存储，数据在多次对话间保持
- 通过 `runtime.store` 访问，使用 namespace/key 模式组织数据
- `store.get((namespace,), key)` 读取，`store.put((namespace,), key, value)` 写入
- namespace 是元组，单层时写 `("name",)`
- 开发/测试用 `InMemoryStore`，生产环境用 `PostgresStore`
- Store 需在 `create_agent` 时通过 `store` 参数注入

## 生成要求

### 1. 读取 Store
```python
@tool
def get_user_info(user_id: str, runtime: ToolRuntime) -> str:
    """Look up user info from persistent store."""
    store = runtime.store
    user_info = store.get(("users",), user_id)
    return str(user_info.value) if user_info else "Unknown user"
```

### 2. 写入 Store
```python
@tool
def save_user_info(user_id: str, user_info: dict, runtime: ToolRuntime) -> str:
    """Save user info to persistent store."""
    store = runtime.store
    store.put(("users",), user_id, user_info)
    return "Successfully saved user info."
```

### 3. Agent 绑定
```python
store = InMemoryStore()
agent = create_agent(model, tools=[get_user_info, save_user_info], store=store)
```

## 反例
- ❌ 生产环境用 `InMemoryStore`
  - ✅ FIX：替换为 `PostgresStore` 或其他持久化实现
- ❌ namespace 写为字符串而非元组：`store.get("users", key)`
  - ✅ FIX：写成 `store.get(("users",), key)`
- ❌ `store.get` 返回值不检查是否存在就直接用 `.value`
  - ✅ FIX：检查返回值是否为 None
- ❌ 把 Store 当 State 用，存临时会话数据
  - ✅ FIX：Store 是长期记忆，State 是短期记忆

## 验收标准
- [ ] Store 通过 `runtime.store` 访问
- [ ] namespace 使用元组格式
- [ ] `store.get` 返回值做了 None 检查
- [ ] 生产环境使用持久化 Store 实现

---

# 约束：LangChain 工具 Stream Writer 的代码规范

## 技术边界
- `runtime.stream_writer` 用于在工具执行期间发送实时进度更新
- `stream_writer` 是可调用对象，传入字符串即可发送更新
- 使用 `stream_writer` 的工具必须在 LangGraph 执行上下文中运行
- 不需要额外配置即生效，但仅在 Agent 以流式模式调用时前端可见

## 生成要求

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_weather(city: str, runtime: ToolRuntime) -> str:
    """Get weather for a given city."""
    writer = runtime.stream_writer
    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")
    return f"It's always sunny in {city}!"
```

## 反例
- ❌ 在非 Agent 上下文（如单独 `model.invoke`）中使用 `stream_writer`
  - ✅ FIX：`stream_writer` 需在 Agent/Graph 执行上下文中运行
- ❌ `stream_writer` 传入非字符串对象
  - ✅ FIX：传入字符串或其他可序列化数据
- ❌ 把 `stream_writer` 当成最终返回值
  - ✅ FIX：`stream_writer` 发送进度更新，`return` 才是工具结果

## 验收标准
- [ ] 工具签包含 `runtime: ToolRuntime` 参数
- [ ] `runtime.stream_writer` 用于发送进度更新，不是最终返回值
- [ ] 工具在 Agent/Graph 上下文中运行

---

# 约束：LangChain 工具 Execution Info 和 Server Info 的代码规范

## 技术边界
- `runtime.execution_info` 提供当前执行的元数据：`thread_id`、`run_id`、`node_attempt`
- `runtime.server_info` 提供 LangGraph Server 相关信息：`assistant_id`、`graph_id`、`user.identity`
- `server_info` 在非 LangGraph Server 环境中为 `None`
- 两者均需要 `deepagents>=0.5.0` 或 `langgraph>=1.1.5`

## 生成要求

### 1. Execution Info
```python
@tool
def log_execution_context(runtime: ToolRuntime) -> str:
    """Log execution identity information."""
    info = runtime.execution_info
    print(f"Thread: {info.thread_id}, Run: {info.run_id}")
    print(f"Attempt: {info.node_attempt}")
    return "done"
```

### 2. Server Info
```python
@tool
def get_assistant_data(runtime: ToolRuntime) -> str:
    """Fetch data scoped to the current assistant."""
    server = runtime.server_info
    if server is not None:
        print(f"Assistant: {server.assistant_id}, Graph: {server.graph_id}")
        if server.user is not None:
            print(f"User: {server.user.identity}")
    return "done"
```

## 反例
- ❌ 不检查 `server_info` 是否为 None 就直接访问属性
  - ✅ FIX：`if server is not None:` 后再访问
- ❌ 在未满足版本要求的包上使用此功能
  - ✅ FIX：确认 `deepagents>=0.5.0` 或 `langgraph>=1.1.5`
- ❌ 把 `execution_info` 或 `server_info` 的内容返回给模型当做回答
  - ✅ FIX：这是元数据，用于日志和调试，不作为最终回答

## 验收标准
- [ ] `server_info` 访问前检查 `is not None`
- [ ] 版本依赖已确认满足要求
- [ ] 元数据仅用于日志/调试，不作为工具返回结果

---

# 约束：LangChain ToolNode 的代码规范

## 技术边界
- `ToolNode` 是 LangGraph 预构建节点，用于在自定义图中执行工具
- 从 `langgraph.prebuilt` 导入
- `ToolNode` 自动处理并行工具执行、错误处理和状态注入
- `tools_condition` 是条件路由函数，根据模型是否产生 tool_calls 做分支
- 工具返回值可以是字符串（纯文本）、对象（结构数据）、`Command`（更新状态）
- 错误处理通过 `handle_tool_errors` 参数配置

## 生成要求

### 1. 基本用法
```python
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph import StateGraph, MessagesState, START, END

tool_node = ToolNode([search, calculator])

builder = StateGraph(MessagesState)
builder.add_node("tools", tool_node)
builder.add_conditional_edges("llm", tools_condition)
builder.add_edge("tools", "llm")
```

### 2. 错误处理
```python
# 捕获所有错误并返回错误消息给模型
ToolNode(tools, handle_tool_errors=True)

# 自定义错误消息
ToolNode(tools, handle_tool_errors="Something went wrong, please try again.")

# 只捕获指定异常类型
ToolNode(tools, handle_tool_errors=(ValueError, TypeError))
```

### 3. 工具返回值类型
- **字符串**：`return "结果文本"`，自动转为 ToolMessage
- **对象**：`return {"key": "value"}`，序列化后传给模型
- **Command**：`return Command(update={...})`，更新状态，可选附带 ToolMessage

## 反例
- ❌ `ToolNode` 不传入 `handle_tool_errors`，工具异常直接崩溃
  - ✅ FIX：根据需求配置错误处理策略
- ❌ `tools_condition` 用自定义函数替代
  - ✅ FIX：`tools_condition` 内置判断模型输出是否含 tool_calls
- ❌ 用 `Command` 更新状态时不附 `ToolMessage`，模型不知道工具执行结果
  - ✅ FIX：`update` 中包含 `"messages": [ToolMessage(...)]`

## 验收标准
- [ ] `ToolNode` 从 `langgraph.prebuilt` 导入
- [ ] 图中使用 `tools_condition` 做工具调用分支
- [ ] 错误处理策略已根据场景配置
- [ ] `Command` 返回值中包含 `ToolMessage` 时使用 `runtime.tool_call_id`

---

# 约束：LangChain 预构建工具的代码规范

## 技术边界
- LangChain 提供大量开箱即用的工具（搜索、代码解释器、数据库等）
- 预构建工具通过对应集成包导入，不需要编写工具定义函数
- 完整列表在 [tools and toolkits 集成页面](/oss/python/integrations/tools)
- 预构建工具可以直接加入 `tools` 列表传递

## 生成要求
- 查找预构建工具：查阅集成页面，确定工具名和所需安装包
- 导入后直接放入 `tools` 列表

## 反例
- ❌ 自己重新实现已有的预构建工具
  - ✅ FIX：先查集成页面确认是否已有现成工具
- ❌ 预构建工具导入后还用 `@tool` 包装
  - ✅ FIX：预构建工具已是工具对象，直接使用

## 验收标准
- [ ] 已查阅集成页面确认工具是否已存在
- [ ] 预构建工具直接放入 `tools` 列表，无需二次包装

---

# 约束：LangChain 服务端工具的代码规范

## 技术边界
- 服务端工具由 provider 在服务器端执行，不需要定义或托管工具逻辑
- 通过 `model.bind_tools([tool_dict])` 绑定，工具用 dict 格式传入（如 `{"type": "web_search"}`）
- 绑定后模型自动调用服务端工具，结果通过 `content_blocks` 返回
- 常见服务端工具：web_search、code interpreter
- 工具 dict 的格式取决于 provider，查阅对应集成文档
- **不可以用 `@tool` 装饰器定义服务端工具**

## 生成要求
- 通过 `model.bind_tools` 传入服务端工具 dict
- 从 `response.content_blocks` 中提取执行记录

```python
model = init_chat_model("gpt-5.4-mini")
tool = {"type": "web_search"}
model_with_tools = model.bind_tools([tool])

response = model_with_tools.invoke("今天有什么正面新闻？")
```

## 反例
- ❌ `@tool` 装饰服务端工具逻辑
  - ✅ FIX：只通过 `bind_tools` 传入 dict
- ❌ 从 `response.tool_calls` 提取服务端工具结果
  - ✅ FIX：结果在 `response.content_blocks` 中，以 `server_tool_call` 和 `server_tool_result` 形式出现
- ❌ 看到 `response.tool_calls` 就去执行客户端函数
  - ✅ FIX：服务端工具执行记录在 `content_blocks` 中，不需要客户端手动执行

## 验收标准
- [ ] 服务端工具以 dict 格式传入 `bind_tools`，不通过 `@tool` 定义
- [ ] 结果从 `content_blocks` 提取
- [ ] 查阅了对应 provider 集成文档确认可用工具 