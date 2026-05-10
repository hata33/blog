https://docs.langchain.com/oss/python/langchain/agents#model
概览：
LangChain 关键核心知识点概览
基于你学习的所有文档和产出的约束，汇总成一张核心知识地图：

一、架构认知
概念	一句话本质
Agent	模型 + 工具 + 提示词 + 记忆，在 ReAct 循环中自主决策的系统
ReAct 循环	推理 → 工具调用 → 观测结果 → 继续推理，直到输出最终答案
LangGraph 底层	Agent 是基于图的运行时，节点（模型、工具、中间件）由边连接
约束工程	不恳求模型遵守规则，而是构建让破坏规则变得不可能的系统

二、Agent 组装四要素
create_agent(model, tools, system_prompt, checkpointer, middleware)
             │       │         │              │            │
             ▼       ▼         ▼              ▼            ▼
          推理引擎  能力边界   行为边界      会话记忆     扩展钩子
要素	必填	核心约束
model	✅	用 init_chat_model，显式设 temperature/timeout/max_tokens
tools	✅	用 @tool 装饰，docstring 含 Args/Returns/Raises，函数名 snake_case
system_prompt	✅	含 ## Capabilities + ## Rules，工具名用反引号与函数名严格一致
checkpointer	✅	开发用 InMemory，生产用 Postgres；同 thread_id 同会话
middleware	❌	拦截模型调用/工具调用/状态变化，动态模型/工具/prompt

三、模型使用核心要点
要点	规则
初始化	init_chat_model("provider:model") 优先
单次调用	invoke(messages) → AIMessage
流式调用	stream() → 迭代 AIMessageChunk
批量调用	batch(inputs) → 并行处理
逐结果返回	batch_as_completed(inputs) → 异步返回
工具绑定	bind_tools([...]) → .tool_calls
结构化输出	with_structured_output(Schema) → model 实例
 

四、工具定义规范
@tool
def tool_name(param: str) -> str:          # snake_case 命名
    """一句话描述工具做什么。              # ← 第一行注入模型上下文

    Args:
        param: 参数类型和含义

    Returns:
        返回值结构和含义

    Raises:
        ExceptionType: 触发条件
    """
关键边界：
● 函数名与 system_prompt 反引号内名称 字符级一致
● docstring 缺 Args/Returns/Raises → 模型调用可能错误
● 动态工具需同时实现 wrap_model_call + wrap_tool_call

五、Middleware 拦截节点
Hook	触发时机	用途
@wrap_model_call	模型调用前	动态切换模型/过滤工具列表
@wrap_tool_call	工具执行前	错误处理/动态工具执行
@before_model	模型调用前（不修改请求）	状态预处理/消息裁剪
@after_model	模型返回后	响应验证/内容过滤
@dynamic_prompt	模型调用前	根据运行时上下文动态生成 system prompt
核心规则：
● 修改请求必须用 request.override(...)，不可直接改属性
● handler 只能调用一次

六、记忆系统分层
层级	机制	持久性
消息历史	checkpointer + thread_id	InMemory（开发）/ Postgres（生产）
自定义状态	AgentState TypedDict 扩展	会话内持久，会话间通过 store
长期记忆	store（跨会话持久化）	数据库持久化
核心约束：
● 同会话复用 thread_id，不同会话用不同 thread_id
● 自定义状态必须继承 AgentState 且为 TypedDict（v1 起）
● 长对话必须配消息管理策略（裁剪/摘要 middleware）

七、调用与流式输出
# 同步
```
result = agent.invoke({"messages": [{"role": "user", "content": "..."}]})
answer = result["messages"][-1].content_blocks
```
# 流式
```
for chunk in agent.stream({"messages": [...]}, stream_mode="values"):
    latest = chunk["messages"][-1]
    if isinstance(latest, AIMessage):
        if latest.content: print(latest.content)
        if latest.tool_calls: print(latest.tool_calls)
```
核心约束：
● invoke 必须传入消息列表，不可传字符串
● 流式必须区分消息类型（HumanMessage / AIMessage / ToolMessage）
● 提取结果用 .content_blocks 而非 .content（当有 tool_calls 时 .content 为空）

八、核心决策树
需要多步规划/文件系统中转/子Agent？
├─ 是 → create_deep_agent
└─ 否 → create_agent

模型支持原生结构化输出？
├─ 是 → ProviderStrategy（或直接传 Pydantic schema，自动选择）
└─ 否 → ToolStrategy

工具在运行时才确定？
├─ 是 → 动态工具（wrap_model_call + wrap_tool_call）
└─ 否 → 静态工具（直接传 tools 列表）

需要根据用户/状态决定可见工具？
├─ 是 → 过滤预注册工具（wrap_model_call 中过滤）
└─ 否 → 全部工具直接暴露

九、你的约束资产库（已产出）
模块	约束文档
Model 初始化	✅
Tools 定义	✅
System Prompt	✅
Memory	✅
Invocation	✅
Streaming	✅
Middleware	✅
Structured Output	✅
Create and Run	✅
Review Results	✅

这张知识地图是你所有提示词资产的索引。后续复刻任何 LangChain 应用，按这张地图定位所需模块，调出对应的约束文档，嵌入你的任务提示词即可。
LangChain 模型选择
# 约束：LangChain 模型选择的代码规范

## 技术边界
- `create_agent` 的第一个参数可以是**字符串**（自动解析为 "provider:model"）或**模型实例**（完整控制配置）
- 模型标识符字符串 "gpt-5.4" 会被自动推断为 "openai:gpt-5.4"
- 传字符串无法设置 temperature、timeout、max_tokens；传模型实例则全部可控
- 动态模型通过 `middleware` + `@wrap_model_call` 实现，在每次请求时根据 `request.state` 决定用哪个模型
- `bind_tools` 已调用的预绑定模型，不能用于需要结构化输出的动态模型场景

## 生成要求

### 1. 模型选择决策（优先使用模型实例）
生成代码时，必须遵循以下决策链生成 `create_agent` 的第一个参数：

```
if 需要显式设置 temperature/timeout/max_tokens/base_url 中任一参数:
    使用模型实例（如 ChatOpenAI(model="...", temperature=..., timeout=...)）
elif 模型标识符字符串可以被自动推断（如 "gpt-5.4" → "openai:gpt-5.4"）:
    可使用字符串 "provider:model"
else:
    使用模型实例，显式指定 model_provider 和 model
```

### 2. 模型实例（ChatOpenAI / ChatAnthropic 等）
- 必须显式设置 `temperature`（默认 0.5）和 `timeout`（默认 300 秒）
- 从 `langchain_openai`、`langchain_anthropic` 等独立包导入，不通过 langchain 的顶层导出

### 3. 动态模型（middleware 模式）
- 使用 `from langchain.agents.middleware import wrap_model_call` 导入
- 使用 `@wrap_model_call` 装饰器定义函数，签名固定为 `(request: ModelRequest, handler) -> ModelResponse`
- `request.state["messages"]` 可获取当前消息列表
- 通过 `handler(request.override(model=selected_model))` 传入替换后的模型
- 传入 `create_agent` 时使用 `middleware=[...]` 参数，且 `model` 参数必须是默认模型（不预绑定工具）

### 4. 自动推断约束
- 允许省略 provider 的模型标识符：`"gpt-5.4"` 可被自动推断为 `"openai:gpt-5.4"`
- 非知名模型标识符必须显式写出完整 `"provider:model"` 格式
- 可在生成代码时写 `"openai:gpt-5.4"`，即使只用 `"gpt-5.4"` 也能运行

## 反例
- ❌ `create_agent(ChatOpenAI(model="gpt-5.4"))` — 缺少 temperature 和 timeout
  - ✅ FIX：`create_agent(ChatOpenAI(model="gpt-5.4", temperature=0.5, timeout=300))`
- ❌ `ChatOpenAI(model="gpt-5.4", temperature=0.5)` — 缺 timeout
  - ✅ FIX：显式追加 `timeout=300`
- ❌ 动态模型 middleware 中 `handler(request)` 直接返回，未调用 `.override(model=...)`
  - ✅ FIX：`return handler(request.override(model=selected_model))`
- ❌ 动态模型 middleware 传入预绑定工具的模型
  - ✅ FIX：middleware 中的模型使用原始实例，非 `model.bind_tools(...)` 的返回值
- ❌ 传入未知模型标识符却不显式写 provider
  - ✅ FIX：写完整格式 `"provider:model_name"`

## 验收标准
- [ ] `create_agent` 的第一个参数是模型实例，除非只使用默认配置
- [ ] 模型实例显式设置了 `temperature` 和 `timeout`
- [ ] 动态模型 middleware 使用 `@wrap_model_call`，非自定义中间件
- [ ] `handler` 调用时使用 `.override(model=...)` 模式
- [ ] middleware 中的模型未被 `bind_tools` 预处理


LangChain System Prompt 
# 约束：LangChain 工具（Tools）的代码规范

## 技术边界
- 工具通过 `@tool` 装饰器注册，或直接传入普通 Python 函数/协程
- 工具列表通过 `create_agent` 的 `tools` 参数注入，传入空列表 `[]` 则 Agent 不具工具调用能力
- 静态工具在 `create_agent` 时一次性定义；动态工具在 middleware 中通过 `request.override(tools=...)` 在运行时增删
- 动态工具分两种模式：**过滤预注册工具**（`wrap_model_call` 中过滤）和**运行时注册工具**（需同时实现 `wrap_model_call` 和 `wrap_tool_call`）
- 工具名使用 `snake_case`，禁止包含空格或特殊字符（多 provider 兼容性要求）
- Agent 遵循 ReAct 循环：推理 → 工具调用 → 观测结果 → 继续推理/输出答案

## 生成要求

### 1. 静态工具定义
- 每个工具函数使用 `@tool` 装饰器，docstring 第一行为功能描述
- 工具函数名全小写+下划线，与 `system_prompt` 中反引号引用的工具名完全一致
- 传递给 `create_agent` 时使用 `tools=[tool1, tool2]` 列表形式

### 2. 动态工具 — 过滤预注册工具
- 使用 `@wrap_model_call` 装饰器，在 middleware 中根据 `request.state` / `request.runtime.context` / `request.runtime.store` 过滤 `request.tools`
- 过滤后必须通过 `request.override(tools=filtered_tools)` 返回
- 适用场景：所有可能的工具在创建 Agent 时已知，但根据权限/状态动态开关

### 3. 动态工具 — 运行时注册
- 条件：工具在运行时才被发现（MCP 服务器、远程注册表等）
- **必须同时实现两个 middleware hook**：
  - `wrap_model_call`：通过 `request.override(tools=[*request.tools, new_tool])` 添加工具
  - `wrap_tool_call`：拦截工具调用请求，通过 `request.override(tool=new_tool)` 指定执行函数
- 仅当 `request.tool_call["name"]` 匹配动态工具名时才做 override

### 4. 工具错误处理
- 使用 `@wrap_tool_call` 定义错误处理 middleware
- 捕获异常后必须返回 `ToolMessage(content=..., tool_call_id=request.tool_call["id"])`
- `tool_call_id` 必须从 `request.tool_call["id"]` 提取，不可硬编码

## 反例
- ❌ 工具函数用驼峰命名 `def searchProduct(...)` 
  - ✅ FIX：改为 `search_product`，`system_prompt` 中引用 `search_product`
- ❌ 动态工具只在 `wrap_model_call` 中注册，未实现 `wrap_tool_call`
  - ✅ FIX：同时实现两个 hook，`wrap_tool_call` 中对匹配的动态工具做 `request.override(tool=...)`
- ❌ 工具异常处理中用 `return f"Error: {e}"` 返回字符串
  - ✅ FIX：返回 `ToolMessage(content=f"Tool error: ...", tool_call_id=request.tool_call["id"])`
- ❌ `create_agent(tools=[])` 但仍期望 Agent 能调用工具
  - ✅ FIX：传入实际工具列表，或在 middleware 中动态注入
# 约束：LangChain System Prompt 的代码规范

## 技术边界
- `system_prompt` 参数接受 `str` 或 `SystemMessage` 对象
- 传入 `str` 时，LangChain 自动包装为 `SystemMessage`
- 传入 `SystemMessage` 时，可使用 provider 特定功能（如 Anthropic 的 `cache_control`）
- 不传 `system_prompt` 时，Agent 直接从消息列表推断任务
- 动态 system prompt 通过 `@dynamic_prompt` 装饰器实现，在 middleware 中根据 `request.runtime.context` 生成

## 生成要求

### 1. 静态 System Prompt（字符串形式）
- 直接传入 `str`：`system_prompt="You are a helpful assistant. Be concise and accurate."`
- 字符串中如果引用工具名，使用反引号包裹，工具名与函数名完全一致

### 2. 静态 System Prompt（SystemMessage 形式）
- 需要 provider 高级特性（如缓存）时使用 `SystemMessage`
- Anthropic prompt caching 格式：
  ```python
  SystemMessage(content=[
      {"type": "text", "text": "..."},
      {"type": "text", "text": "<content>", "cache_control": {"type": "ephemeral"}}
  ])
  ```
- `cache_control` 字段只在 Anthropic provider 下生效，不兼容其他 provider

### 3. 动态 System Prompt
- 使用 `from langchain.agents.middleware import dynamic_prompt` 导入
- 函数签名：`(request: ModelRequest) -> str`，返回 prompt 字符串
- 从 `request.runtime.context` 中读取上下文数据决定 prompt 内容
- 通过 `middleware=[...]` 传入 `create_agent`，需配合 `context_schema` 使用

## 反例
- ❌ `system_prompt=SystemMessage("You are a helpful assistant")` — 将字符串直接传入 SystemMessage 构造器
  - ✅ FIX：使用 `system_prompt="You are a helpful assistant"` 或 `SystemMessage(content=[...])`
- ❌ 在非 Anthropic provider 下使用 `cache_control`
  - ✅ FIX：仅在 `model="anthropic:..."` 时使用，或移除该字段
- ❌ 动态 prompt 函数返回 `SystemMessage` 对象而非 `str`
  - ✅ FIX：`@dynamic_prompt` 函数必须返回 `str`
- ❌ 引用工具名时用中文或与函数名不一致的命名
  - ✅ FIX：system_prompt 中反引号内的工具名与 Python 函数名字符级一致

LangChain Agent 调用（Invocation）
# 约束：LangChain Agent 调用（Invocation）的代码规范

## 技术边界
- Agent 通过 `invoke`（同步）或 `stream`（流式）调用
- `invoke` 的第一个参数为 `{"messages": [...]}` 格式的 dict
- `messages` 列表中每条消息可以是 raw dict `{"role": "...", "content": "..."}` 或 LangChain Message 对象
- `stream` 调用时，`stream_mode="values"` 返回完整 State 快照，`stream_mode="messages"` 返回增量消息
- `invoke` 返回的结果中，`result["messages"][-1]` 是最后一条消息，通过 `.content` 或 `.content_blocks` 提取内容
- Agent 基于 LangGraph，支持所有 LangGraph 的方法（`invoke`、`stream`、`astream` 等）

## 生成要求

### 1. invoke 调用
- 必须传入消息列表，格式为：
  ```python
  result = agent.invoke(
      {"messages": [{"role": "user", "content": "..."}]}
  )
  ```
- 不可传入单独的字符串作为消息
- 提取最终回答：`result["messages"][-1].content_blocks`

### 2. stream 流式调用
- 使用 for 循环遍历：`for chunk in agent.stream({"messages": [...]}, stream_mode="values"):`
- 每次 chunk 是完整 State 快照，`chunk["messages"][-1]` 取最新消息
- 需要区分消息类型：
  - `isinstance(latest_message, HumanMessage)`：用户消息
  - `isinstance(latest_message, AIMessage)` 且有 `.content`：模型文本回复
  - `isinstance(latest_message, AIMessage)` 且有 `.tool_calls`：工具调用请求

### 3. 消息格式兼容性
- 优先使用 raw dict：`{"role": "user", "content": "..."}`（兼容所有 provider）
- 使用 LangChain Message 对象时需显式导入：`from langchain.messages import HumanMessage, AIMessage`

## 反例
- ❌ `agent.invoke("what is the weather")` — 传入字符串
  - ✅ FIX：`agent.invoke({"messages": [{"role": "user", "content": "what is the weather"}]})`
- ❌ `print(result)` — 直接打印整个 result 对象
  - ✅ FIX：`print(result["messages"][-1].content_blocks)`
- ❌ `result["messages"][-1].content` — 与 `.content_blocks` 混用，当存在 tool_calls 时 `.content` 为空字符串
  - ✅ FIX：始终使用 `.content_blocks` 提取最终结构化输出
- ❌ stream 循环中不区分消息类型，直接打印 `.content`
  - ✅ FIX：用 `isinstance` 判断消息类型后再处理
Structured Output
# 约束：LangChain 结构化输出（Structured Output）的代码规范

## 技术边界
- 结构化输出通过 `create_agent` 的 `response_format` 参数指定
- 两种策略：`ToolStrategy`（通过人工工具调用生成结构化输出）和 `ProviderStrategy`（使用 provider 原生能力）
- `ToolStrategy` 适用于任何支持工具调用的模型；`ProviderStrategy` 仅适用于支持原生结构化输出的 provider
- 从 `langchain 1.0` 起，直接传入 Pydantic schema（如 `response_format=ContactInfo`）会自动选择策略：provider 支持则用 `ProviderStrategy`，否则 fallback 到 `ToolStrategy`
- 使用 `ToolStrategy` 时，结构化输出的 schema 通过人工工具调用的参数定义，工具名由框架自动生成
- 使用 `ProviderStrategy` 时，结构化输出由模型 provider 原生生成，不依赖工具调用机制

## 生成要求

### 1. Schema 定义
- 必须使用 Pydantic `BaseModel` 定义输出结构，不可用 dict 或 TypedDict
- 每个字段必须声明类型：`str`、`int`、`float`、`bool` 或嵌套 Pydantic 模型
- 示例：
  ```python
  from pydantic import BaseModel
  
  class ContactInfo(BaseModel):
      name: str
      email: str
      phone: str
  ```

### 2. 策略选择
- **默认行为（推荐）**：直接传入 Pydantic 类，让框架自动选择策略
  ```python
  agent = create_agent(model=..., response_format=ContactInfo)
  ```
- **显式使用 ToolStrategy**（跨模型兼容）：
  ```python
  from langchain.agents.structured_output import ToolStrategy
  agent = create_agent(model=..., response_format=ToolStrategy(ContactInfo))
  ```
- **显式使用 ProviderStrategy**（仅兼容特定 provider）：
  ```python
  from langchain.agents.structured_output import ProviderStrategy
  agent = create_agent(model=..., response_format=ProviderStrategy(ContactInfo))
  ```

### 3. 结果提取
- 结构化输出通过 `result["structured_response"]` 获取，而非 `result["messages"][-1].content`
- `result["structured_response"]` 返回的是 Pydantic 模型实例，可直接访问字段：`result["structured_response"].name`

## 反例
- ❌ `response_format={"name": str, "email": str}` — 使用 dict 定义 schema
  - ✅ FIX：使用 Pydantic `BaseModel` 定义
- ❌ 使用 `ToolStrategy` 时从 `result["messages"][-1].content` 中手动解析 JSON
  - ✅ FIX：使用 `result["structured_response"]` 直接获取 Pydantic 实例
- ❌ 在不支持原生结构化输出的 provider 上强制使用 `ProviderStrategy`
  - ✅ FIX：使用 `ToolStrategy` 或直接传入 schema 让框架自动 fallback 
LangChain Agent 记忆（Memory）
# 约束：LangChain Agent 记忆（Memory）的代码规范

## 技术边界
- Agent 记忆分为两种类型：**对话历史**（消息列表自动维护）和**自定义状态**（通过 `AgentState` 扩展）
- 消息历史由 `checkpointer` 自动持久化，同一 `thread_id` 的消息自动拼接
- 自定义状态通过继承 `AgentState`（TypedDict）实现，在对话过程中存储额外信息
- 从 `langchain 1.0` 起，自定义 schema **必须**是 `TypedDict`，Pydantic 和 dataclass 已不再支持
- 自定义状态有两种定义方式：**通过 middleware**（推荐，状态与 middleware/tools 作用域绑定）和**通过 `state_schema` 参数**（快捷方式，仅用于 tools 中访问状态）

## 生成要求

### 1. 消息历史（对话记忆）
- 使用 `checkpointer` 参数注入持久化机制
- 开发/测试用 `InMemorySaver`，生产环境用 `PostgresSaver` 或其他数据库 backends
- 每次 `invoke` 时通过 `config={"configurable": {"thread_id": "..."}}` 指定会话 ID
- 同一会话的所有调用必须使用相同的 `thread_id`

### 2. 自定义状态 — 通过 middleware（推荐方式）
- 状态类必须继承 `AgentState` 且定义为 `TypedDict`：
  ```python
  from langchain.agents import AgentState
  
  class CustomState(AgentState):
      user_preferences: dict
  ```
- 在自定义 middleware 类中通过 `state_schema` 属性绑定：
  ```python
  class CustomMiddleware(AgentMiddleware):
      state_schema = CustomState
      tools = [tool1, tool2]  # 需要访问该状态的工具
  ```
- 在 middleware hook 中通过函数参数直接访问：`def before_model(self, state: CustomState, runtime)`

### 3. 自定义状态 — 通过 `state_schema` 参数（快捷方式）
- 仅在工具需要访问额外状态时使用：
  ```python
  class CustomState(AgentState):
      user_preferences: dict
  
  agent = create_agent(model, tools=[tool1, tool2], state_schema=CustomState)
  ```
- 调用 `invoke` 时传入自定义字段：
  ```python
  result = agent.invoke({
      "messages": [{"role": "user", "content": "..."}],
      "user_preferences": {"style": "technical"}
  })
  ```

### 4. 工具中访问自定义状态
- 工具函数通过 `ToolRuntime` 参数访问状态：
  ```python
  @tool
  def my_tool(query: str, runtime: ToolRuntime) -> str:
      user_prefs = runtime.state.get("user_preferences", {})
      # 使用状态数据
  ```

## 反例
- ❌ 使用 Pydantic 模型定义 `CustomState`（已从 v1 起弃用）
  - ✅ FIX：使用 `TypedDict` 定义，继承 `AgentState`
- ❌ 同一用户的多轮对话使用不同的 `thread_id`
  - ✅ FIX：为同一会话固定 `thread_id`
- ❌ 生产环境使用 `InMemorySaver`
  - ✅ FIX：替换为 `PostgresSaver.fromConnString(...)` 或其他持久化方案
- ❌ 在 middleware 外部修改 `state`（直接操作 `result["messages"]`）
  - ✅ FIX：通过 middleware hook 参数中的 `state` 修改，或通过 `invoke` 时的初始状态传入
流式输出（Streaming）
# 约束：LangChain Agent 流式输出（Streaming）的代码规范

## 技术边界
- 流式输出通过 `agent.stream()` 方法调用，非 `agent.invoke()`
- `stream` 返回一个事件迭代器，每次迭代返回一个 chunk
- `stream_mode` 参数决定 chunk 的内容结构：
  - `stream_mode="values"`：每次返回完整的 State 快照，`chunk["messages"]` 包含当前所有消息
  - `stream_mode="messages"`：每次返回增量消息，仅包含新增的消息对象
- 每个 chunk 中通过 `chunk["messages"][-1]` 获取最新消息
- 消息类型判断使用 `isinstance`：`HumanMessage`（用户消息）、`AIMessage`（模型回复）、`ToolMessage`（工具返回）
- `AIMessage` 可能同时包含 `.content`（文本回复）和 `.tool_calls`（工具调用请求），需要分别处理
- `AIMessage` 的 `.content` 在存在 `.tool_calls` 时为空字符串，此时应读取 `.tool_calls` 字段
- 流式调用不支持 `stream_mode` 的混合模式，单次 `stream` 调用只能选一种 mode

## 生成要求

### 1. stream 调用结构
- 必须使用 `for chunk in agent.stream(...)` 循环遍历迭代器
- 第一个参数为 `{"messages": [...]}`，与 `invoke` 格式相同
- `stream_mode` 必须显式传入，不可依赖默认值：
  ```python
  for chunk in agent.stream(
      {"messages": [{"role": "user", "content": "..."}]},
      stream_mode="values"
  ):
  ```

### 2. 消息提取与类型判断
- 从 chunk 中提取最新消息的固定模式：
  ```python
  latest_message = chunk["messages"][-1]
  ```
- 必须按以下顺序判断消息类型，不可省略：
  ```python
  if isinstance(latest_message, HumanMessage):
      print(f"User: {latest_message.content}")
  elif isinstance(latest_message, AIMessage):
      if latest_message.content:
          print(f"Agent: {latest_message.content}")
      if latest_message.tool_calls:
          print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")
  elif isinstance(latest_message, ToolMessage):
      print(f"Tool result: {latest_message.content}")
  ```
- `AIMessage` 的 `.content` 和 `.tool_calls` 必须分开判断，两者可能同时出现或仅出现其一

### 3. 导入依赖
- 必须导入消息类型：
  ```python
  from langchain.messages import HumanMessage, AIMessage
  ```
- 如果处理 `ToolMessage`，也需导入：`from langchain.messages import ToolMessage`

## 反例
- ❌ 用 `agent.invoke()` 替代 `agent.stream()` 做流式输出
  - ✅ FIX：使用 `agent.stream()`，`invoke` 会阻塞等待全部完成
- ❌ `stream_mode` 未显式传入，依赖默认行为
  - ✅ FIX：必须显式指定 `stream_mode="values"` 或 `stream_mode="messages"`
- ❌ `latest_message.content` 在存在 `.tool_calls` 时仍被当作有效输出打印（内容为空字符串）
  - ✅ FIX：先判断 `if latest_message.content:` 再打印文本
- ❌ 不区分 `HumanMessage` 和 `AIMessage`，直接用 `print(latest_message.content)` 打印所有消息
  - ✅ FIX：使用 `isinstance` 判断消息类型，按角色分别格式化输出
- ❌ 工具调用时只打印 `latest_message.tool_calls` 而不打印工具名
  - ✅ FIX：使用列表推导提取工具名：`[tc['name'] for tc in latest_message.tool_calls]`
- ❌ 忘记导入 `HumanMessage` 和 `AIMessage`，导致 `isinstance` 检查失败
  - ✅ FIX：文件顶部显式 `from langchain.messages import HumanMessage, AIMessage`
```
Middleware
# 约束：LangChain Agent 中间件（Middleware）的代码规范

## 技术边界
- Middleware 是 Agent 的扩展机制，通过装饰器或类拦截 Agent 执行流程的关键节点
- Middleware 通过 `create_agent` 的 `middleware` 参数注入，接受单个实例或实例列表
- 装饰器形式的 middleware：`@wrap_model_call`、`@wrap_tool_call`、`@before_model`、`@after_model`、`@dynamic_prompt`
- 类形式的 middleware：继承 `AgentMiddleware`，可在单个类中组合多个 hook 和绑定的工具
- `@wrap_model_call` 在模型调用前执行，可修改 `request.tools`、`request.model`
- `@wrap_tool_call` 在工具执行前执行，可修改工具调用或捕获异常
- `@before_model` 和 `@after_model` 不修改请求，分别用于模型调用前的状态处理和调用后的响应验证
- 类形式 middleware 通过 `state_schema` 绑定自定义状态，通过 `tools` 属性绑定专属工具
- 多个 middleware 按列表顺序执行，顺序影响最终行为

## 生成要求

### 1. 装饰器形式 Middleware — wrap_model_call
- 导入路径：`from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse`
- 函数签名固定为：`(request: ModelRequest, handler: Callable) -> ModelResponse`
- 修改请求时必须通过 `request.override(...)` 创建新请求，不可直接修改 `request` 的属性
- 必须调用 `return handler(request)` 或 `return handler(request.override(...))`，不可省略

### 2. 装饰器形式 Middleware — wrap_tool_call
- 导入路径：`from langchain.agents.middleware import wrap_tool_call`
- 用于工具错误处理和动态工具执行
- 错误处理模式：
  ```python
  @wrap_tool_call
  def handle_tool_errors(request, handler):
      try:
          return handler(request)
      except Exception as e:
          return ToolMessage(
              content=f"Tool error: {str(e)}",
              tool_call_id=request.tool_call["id"]
          )
  ```
- 工具错误处理中返回的 `tool_call_id` 必须从 `request.tool_call["id"]` 提取

### 3. 装饰器形式 Middleware — before_model / after_model
- `@before_model`：签名 `(state, runtime)`，返回 `dict | None`
  - 返回 dict 时，该 dict 会合并到当前 State 中
  - 返回 None 时，不修改 State
- `@after_model`：签名 `(state, runtime)`，返回 `dict | None`
  - 用于响应后处理和验证

### 4. 类形式 Middleware — AgentMiddleware
- 继承自 `AgentMiddleware`
- 可重写的方法：`wrap_model_call`、`wrap_tool_call`、`before_model`、`after_model`
- 类属性：
  - `state_schema`：绑定的自定义状态 TypedDict（推荐在类内定义，而非通过 `create_agent` 的 `state_schema` 参数）
  - `tools`：此 middleware 专属的工具列表，与 `create_agent` 的 `tools` 合并

### 5. 动态工具 Middleware（运行时注册）
- 必须同时实现 `wrap_model_call` 和 `wrap_tool_call`
- `wrap_model_call`：通过 `request.override(tools=[*request.tools, dynamic_tool])` 添加
- `wrap_tool_call`：判断 `request.tool_call["name"]` 匹配后，通过 `handler(request.override(tool=dynamic_tool))` 指定执行函数

### 6. 动态 System Prompt Middleware
- 使用 `@dynamic_prompt` 装饰器
- 函数签名：`(request: ModelRequest) -> str`
- 返回值为字符串，不支持返回 `SystemMessage`

## 反例
- ❌ `return handler(request)` 后还尝试调用 `handler` 两次
  - ✅ FIX：`handler` 只能调用一次，在 `wrap_model_call` 和 `wrap_tool_call` 中
- ❌ 直接修改 `request.tools = [...]` 而非使用 `.override()`
  - ✅ FIX：`request = request.override(tools=[...])` 然后 `return handler(request)`
- ❌ 使用 `before_model` 来修改 tools（model 看不到这个修改）
  - ✅ FIX：修改 tools 必须在 `wrap_model_call` 中进行
- ❌ `@wrap_model_call` 函数的签名写为 `def my_fn(request, handler, extra_arg)`
  - ✅ FIX：签名固定为 `(request, handler)` 两个参数
- ❌ 动态工具只在 `wrap_model_call` 注册，缺 `wrap_tool_call`
  - ✅ FIX：必须同时实现两个 hook
- ❌ 类形式 middleware 忘记继承 `AgentMiddleware`
  - ✅ FIX：`class MyMiddleware(AgentMiddleware):`
- ❌ 多个 middleware 时，修改同一请求的 hook 顺序未考虑（如先过滤 tools 再添加 tools）
  - ✅ FIX：在 `middleware` 列表中按逻辑排好顺序，先过滤再添加
```