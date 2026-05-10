LangChain 模型配置文件（Model Profiles）
# 约束：LangChain 模型配置文件（Model Profiles）的代码规范

## 技术边界
- `model.profile` 是模型实例上的字典属性，暴露模型的能力和限制数据
- 要求 `langchain>=1.1`，更低版本无此属性
- profile 数据主要来源为 [models.dev](https://models.dev) 开源项目，LangChain 集成包合并额外字段后随包发布
- profile 常用字段包括：`max_input_tokens`、`tool_calling`、`structured_output`、`image_inputs`、`reasoning_output` 等
- profile 是普通 `dict`，可直接读取、合并、覆盖
- `init_chat_model` 支持通过 `profile` 参数传入自定义 profile，覆盖默认数据
- 通过 `model.model_copy(update={"profile": new_profile})` 生成新实例，不修改共享的原实例
- 正式数据修复路径：models.dev PR → `profile_augmentations.toml` PR → `langchain-model-profiles` CLI 刷新
- **beta 功能**：profile 格式可能变更，不可做硬逻辑依赖

## 生成要求

### 1. 读取 Profile（最基本用法）
- 通过 `model.profile` 直接访问，返回 `dict`
- 读取前不需要任何额外配置
```python
profile = model.profile
max_tokens = profile.get("max_input_tokens", None)
supports_tools = profile.get("tool_calling", False)
```

### 2. 基于 Profile 做动态决策
- 使用 `.get()` 方法读取字段，提供默认值
- 不可假设字段一定存在
- 典型用法：
  - 根据 `max_input_tokens` 触发 summarization middleware
  - 根据 `tool_calling` / `structured_output` 选择 Agent 的 response_format 策略
  - 根据 `image_inputs` 决定是否启用多模态输入

### 3. 覆盖或补充 Profile（快速修复）
- 通过 `init_chat_model(..., profile=custom_profile)` 在初始化时传入
- 更新已有实例时使用 `model.model_copy(update={"profile": new_profile})`，不可直接修改共享实例的 `model.profile`
- 合并字段时使用字典合并操作符：`new_profile = model.profile | {"key": "value"}`

### 4. Profile 数据修复的正确路径（上游修复）
- 仅当 profile 数据缺失/陈旧/错误时走此路径
- 不走此路径不影响正常使用

## 反例
- ❌ `if model.profile["structured_output"]:` — 直接键访问，字段可能不存在导致 KeyError
  - ✅ FIX：`if model.profile.get("structured_output", False):`
- ❌ `model.profile["new_field"] = value` — 直接修改共享实例的 profile
  - ✅ FIX：`new_profile = model.profile | {"new_field": value}; model.model_copy(update={"profile": new_profile})`
- ❌ 硬编码 `if model.model_name == "gpt-5.4": max_tokens = 400000` 做能力判断
  - ✅ FIX：`max_tokens = model.profile.get("max_input_tokens")`
- ❌ 依赖 profile 字段做关键业务逻辑的硬分支（如字段不存在即报错）
  - ✅ FIX：始终提供默认值，做降级处理
- ❌ 在 `langchain<1.1` 版本上访问 `model.profile`
  - ✅ FIX：检查 langchain 版本或使用 try/except 保护
多模态（Multimodal）
# 约束：LangChain 多模态（Multimodal）的代码规范

## 技术边界
- 多模态指模型可处理/返回文本以外的数据：图像、音频、视频
- 多模态输入通过消息的 `content_blocks` 传入，非单独参数
- LangChain 聊天模型支持三种多模态数据格式：跨 provider 标准格式、OpenAI Chat Completions 格式、provider 原生格式
- 多模态输出同样通过 `AIMessage.content_blocks` 返回，检查 `"type"` 字段区分内容类型
- **并非所有模型都支持多模态**，需通过 `model.profile` 检查 `image_inputs` / `audio_inputs` 等字段

## 生成要求

### 1. 多模态输入（传入非文本数据）
- 必须通过 content blocks 格式传入，不可将 base64 字符串直接拼在 `content` 文本中
- 跨 provider 标准格式使用 `{"type": "image_url", "image_url": {"url": "..."}}` 等结构
- 如需支持多 provider，优先使用跨 provider 标准格式；仅针对特定 provider 时可用原生格式

### 2. 多模态输出（提取非文本数据）
- 从 `response.content_blocks` 遍历，按 `block["type"]` 判断内容类型
- 类型判断必须处理未知类型（降级为忽略或日志记录）

```python
for block in response.content_blocks:
    if block["type"] == "text":
        print(block["text"])
    elif block["type"] == "image":
        # block 包含 "base64" 和 "mime_type"
        save_image(block["base64"], block["mime_type"])
    elif block["type"] == "audio":
        # block 包含 "base64" 和 "mime_type"
        save_audio(block["base64"], block["mime_type"])
    # 不认识的 type 做降级处理，不报错
```

### 3. 能力检查（必须执行）
- 调用多模态功能前，必须通过 `model.profile` 检查对应能力
- 不支持时提供明确的降级提示，不可直接调用后捕获异常

```python
profile = model.profile

if not profile.get("image_inputs", False):
    # 降级处理：跳过图片、提示用户更换模型等
    pass
```

## 反例
- ❌ `model.invoke("描述这张图片: data:image/png;base64,...")` — 将 base64 数据拼在文本中
  - ✅ FIX：使用 content blocks 格式传入图片数据
- ❌ 假设所有模型都支持多模态，不做能力检查
  - ✅ FIX：调用前通过 `model.profile.get("image_inputs")` 检查
- ❌ `block["base64"]` — 直接访问字段，不检查 `block["type"]`
  - ✅ FIX：先判断 `block["type"] == "image"` 再提取对应字段
- ❌ 对不认识的 `block["type"]` 抛出异常
  - ✅ FIX：做降级处理，至少不阻塞后续块的处理
- ❌ 多模态输出时只读取 `response.content`，忽略 `content_blocks`
  - ✅ FIX：遍历 `response.content_blocks` 分别处理各类型块
```
推理（Reasoning）
# 约束：LangChain 推理（Reasoning）的代码规范

## 技术边界
- 推理指模型在输出最终答案前进行的多步思考过程，不是最终回复本身
- 推理内容通过 `content_blocks` 中 `"type": "reasoning"` 的块暴露，与 `"type": "text"` 的块分离
- 部分模型支持通过参数控制推理力度：层级式（`"low"` / `"high"`）或 token 预算式（整数值）
- 部分模型支持完全关闭推理——关闭后 `content_blocks` 中不再出现 `"type": "reasoning"` 块
- 推理是 provider 专属功能，**非所有模型支持**，需通过 `model.profile` 检查 `reasoning_output` 字段

## 生成要求

### 1. 流式模式下提取推理内容
- 遍历 `chunk.content_blocks`，筛选 `block["type"] == "reasoning"` 的块
- 推理块中 `block.get("reasoning")` 为实际推理文本
- 推理块和文本块可能出现在同一个 chunk 中，必须分别处理

```python
for chunk in model.stream("prompt"):
    for block in chunk.content_blocks:
        if block["type"] == "reasoning" and (reasoning := block.get("reasoning")):
            print(f"[Reasoning]: {reasoning}")
        elif block["type"] == "text":
            print(block["text"])
```

### 2. 非流式模式下提取完整推理
- 从 `response.content_blocks` 中筛选推理块并拼接

```python
response = model.invoke("prompt")
reasoning_steps = [
    b.get("reasoning")
    for b in response.content_blocks
    if b["type"] == "reasoning"
]
full_reasoning = " ".join(reasoning_steps)
```

### 3. 推理力度控制（模型支持时）
- 通过模型初始化参数或 `bind` 传入推理控制参数
- 层级式：`reasoning_effort="low"` / `reasoning_effort="high"`
- Token 预算式：具体参数名因 provider 而异，查阅对应集成文档
- 关闭推理：同样因 provider 而异，查阅对应集成文档

### 4. 能力检查
- 调用推理功能前通过 `model.profile.get("reasoning_output")` 检查
- 不支持时做降级处理，不可假设推理块一定存在

## 反例
- ❌ 从 `chunk.text` 或 `response.content` 中手动正则匹配 `<thinking>...</thinking>` 标签来提取推理
  - ✅ FIX：从 `content_blocks` 中筛选 `"type": "reasoning"` 块
- ❌ `chunk.text` 和 `content_blocks` 混用，用 `.text` 打印后又在 `.content_blocks` 中找推理
  - ✅ FIX：统一通过 `content_blocks` 处理所有内容类型
- ❌ 假设所有模型都支持推理，不检查 `reasoning_output`
  - ✅ FIX：通过 `model.profile.get("reasoning_output")` 检查
- ❌ 筛选推理块时直接用 `block["reasoning"]` 键访问，不处理字段缺失
  - ✅ FIX：使用 `block.get("reasoning")` 并提供默认值
- ❌ 推理参数随意设置，不看 provider 文档
  - ✅ FIX：确认 provider 支持的推理参数名称和取值范围后再设置
```
本地模型（Local Models）
# 约束：LangChain 本地模型（Local Models）的代码规范

## 技术边界
- 本地模型运行在用户自有硬件上，不依赖云服务
- 典型场景：数据隐私要求、自定义模型、避免云服务成本
- [Ollama](https://ollama.com) 是最简单的本地模型运行方式，提供标准化的 HTTP API，需先安装并启动 Ollama 服务
- 使用 `init_chat_model("ollama:model_name")` 或 `ChatOllama` 连接本地模型
- 本地模型**不自动具备云模型的高级能力**（工具调用、结构化输出等需模型本身支持）
- 需安装 `langchain-ollama` 集成包

## 生成要求

### 1. 环境准备（代码外）
- 不在代码中安装 Ollama 或拉取模型，这在代码外提前完成
- 代码中不需要指定 Ollama 服务的 host/port，默认连接 `http://localhost:11434`

### 2. 模型初始化
```python
from langchain.chat_models import init_chat_model

model = init_chat_model("ollama:mistral")
model = init_chat_model("ollama:llama3.1")
```

### 3. 能力检查（必须）
- 本地模型的能力取决于拉取的模型本身，不可假设支持工具调用或结构化输出
- 调用前通过 `model.profile` 检查对应能力
- 不支持时降级处理：简化 prompt、减少工具依赖或提示用户更换模型

## 反例
- ❌ 假设本地模型和云端模型能力相同，不做能力检查直接调 `bind_tools`
  - ✅ FIX：通过 `model.profile.get("tool_calling")` 检查
- ❌ `init_chat_model("mistral")` — 不写 provider，被错误推断为云 provider
  - ✅ FIX：`init_chat_model("ollama:mistral")`
- ❌ 代码中执行 `subprocess.run("ollama pull ...")` 拉取模型
  - ✅ FIX：模型拉取在代码外提前完成，代码只负责调用
- ❌ 本地模型初始化不处理连接失败
  - ✅ FIX：Ollama 未启动时 `invoke` 会抛连接异常，需在调用处 try/except 处理
提示缓存（Prompt Caching）
# 约束：LangChain 提示缓存（Prompt Caching）的代码规范

## 技术边界
- Prompt Caching 是指将 prompt 中重复出现的内容缓存，后续相同请求免除该部分 token 计费和推理耗时
- 分隐式和显式两种：隐式缓存 provider 自动处理，不需要代码干预；显式缓存需要在代码中手动标记缓存点
- 隐式缓存 provider：OpenAI、Gemini（默认启用，无感知）
- 显式缓存 provider：Anthropic（通过 `cache_control` 字段）、ChatOpenAI（通过 `prompt_cache_key` 参数）、AWS Bedrock
- 缓存通常在超过最小输入 token 阈值后才生效（各 provider 不同，一般 1024-4096 tokens）
- 缓存命中结果反映在 `response.usage_metadata` 中的 `cache_read` / `cache_creation` 字段
- **不支持缓存的 provider 传入缓存参数会被忽略或报错**

## 生成要求

### 1. 隐式缓存（OpenAI / Gemini）
- 代码中不写任何缓存相关参数，provider 自动处理
- 不可手动添加 `cache_control` 或其他缓存标记

### 2. 显式缓存 — Anthropic（cache_control）
- 通过 `SystemMessage` 的 `content` 块中设置 `"cache_control": {"type": "ephemeral"}`
- 缓存标记只对标记的内容块生效，不对整个 prompt 生效
- 同一个 `SystemMessage` 中未被标记的块不缓存

```python
from langchain.messages import SystemMessage

system_prompt = SystemMessage(
    content=[
        {"type": "text", "text": "简短指令，不缓存"},
        {"type": "text", "text": "大段文本内容...", "cache_control": {"type": "ephemeral"}},
    ]
)
```

### 3. 显式缓存 — ChatOpenAI（prompt_cache_key）
- 通过 `ChatOpenAI` 构造器或 `bind` 传入 `prompt_cache_key` 参数
- `prompt_cache_key` 为任意字符串，相同 key 的请求共享缓存
- 不同 key 的请求不共享缓存

```python
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-5.4", prompt_cache_key="my-session-key")
```

### 4. 缓存验证
- 调用后检查 `response.usage_metadata` 确认缓存是否命中
- 不依赖缓存一定命中（首次调用无缓存、缓存过期、阈值未达到等）

## 反例
- ❌ 隐式缓存 provider（OpenAI）上手动设置 `cache_control` 字段
  - ✅ FIX：隐式缓存 provider 不写任何缓存代码，自动处理
- ❌ 显式缓存 provider 上标记了整个 prompt 但不检查 token 量是否达到阈值
  - ✅ FIX：缓存标记只放在长内容块上，短内容不标记（低于阈值的标记无效）
- ❌ `response.usage_metadata` 中看不到缓存字段就判断缓存功能不工作
  - ✅ FIX：首次调用无缓存命中，`cache_read` 为 0 是正常现象
- ❌ 把 `cache_control` 放在非 Anthropic provider 的请求中
  - ✅ FIX：`cache_control` 是 Anthropic 专属字段，其他 provider 忽略或报错
- ❌ `cache_control` 放在 `HumanMessage` 而非 `SystemMessage` 中
  - ✅ FIX：Anthropic 显式缓存标记在 system 消息中效果最好，user 消息中可能不生效 

服务端工具调用（Server-Side Tool Use）
# 约束：LangChain 服务端工具调用（Server-Side Tool Use）的代码规范

## 技术边界
- 服务端工具调用：工具在 provider 服务器端执行，不在用户代码中执行
- 一次 `invoke` 完成“调用工具→执行→生成答案”全流程，无需客户端手动执行工具和传递 ToolMessage
- 工具通过 model 初始化参数或 `bind_tools` 绑定，工具格式为 dict（如 `{"type": "web_search"}`），非 `@tool` 装饰的函数
- 返回的 `AIMessage.content_blocks` 中包含完整的服务端工具调用记录：`server_tool_call`（调用请求）→ `server_tool_result`（执行结果）→ `text`（最终答案）
- 不是所有 provider 支持此功能，需查阅 provider 集成文档确认
- text 块可能包含 `annotations` 字段（引用标注），指向搜索来源的 URL、标题等

## 生成要求

### 1. 服务端工具绑定
- 服务端工具使用 dict 格式定义，传入 `model.bind_tools([tool_dict])`
- 不可对服务端工具使用 `@tool` 装饰器（那是客户端工具的定义方式）

```python
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-5.4-mini")
tool = {"type": "web_search"}
model_with_tools = model.bind_tools([tool])
```

### 2. 结果提取
- 必须从 `response.content_blocks` 遍历提取，不可从 `.tool_calls` 提取（这是客户端工具调用的字段）
- `content_blocks` 中出现的类型：`server_tool_call`、`server_tool_result`、`text`
- `server_tool_call` 结构：`{"type": "server_tool_call", "name": "...", "args": {...}, "id": "..."}`
- `server_tool_result` 结构：`{"type": "server_tool_result", "tool_call_id": "...", "status": "success"}`
- text 块可能含 `annotations` 引用数组

```python
response = model_with_tools.invoke("今天有什么正面新闻？")
for block in response.content_blocks:
    if block["type"] == "server_tool_call":
        print(f"[调用工具]: {block['name']}")
    elif block["type"] == "server_tool_result":
        print(f"[工具完成]: {block['status']}")
    elif block["type"] == "text":
        print(f"[回答]: {block['text']}")
```

### 3. 消息管理
- 不要把服务端工具调用的 AIMessage 当作需要回复 ToolMessage 的消息
- 不要把 `content_blocks` 中的 `server_tool_call` 当作客户端 `tool_calls` 去执行工具
- 服务端工具调用在单轮对话内完成，消息列表追加 AIMessage 后可直接继续多轮对话

## 反例
- ❌ 用 `@tool` 装饰器定义服务端工具函数
  - ✅ FIX：服务端工具用 dict 格式，如 `{"type": "web_search"}`
- ❌ 从 `response.tool_calls` 提取服务端工具调用信息
  - ✅ FIX：从 `response.content_blocks` 中筛选 `"type": "server_tool_call"` 的块
- ❌ 看到 `content_blocks` 中有 server_tool_call，就去执行工具并返回 ToolMessage
  - ✅ FIX：服务端已完成工具执行，不需要客户端再执行
- ❌ 把 `server_tool_call` block 当成 `tool_calls` 来读取 `tool_call["name"]` 的字段结构
  - ✅ FIX：分别以 `block["type"] == "server_tool_call"` 和 `block["type"] == "server_tool_result"` 独立处理
- ❌ 忽略 text 块中的 `annotations` 字段（如果存在）
  - ✅ FIX：当 block 的 text 有检索来源引用需求时提取 `annotations` 信息
速率限制（Rate Limiting）
# 约束：LangChain 速率限制（Rate Limiting）的代码规范

## 技术边界
- 速率限制指 provider 对单位时间内调用次数的上限，超限会返回速率限制错误（通常为 HTTP 429）
- LangChain 通过 `rate_limiter` 参数在客户端控制请求速率，避免触发 provider 限制
- 内置 `InMemoryRateLimiter` 是线程安全的，同进程多线程可共享
- `InMemoryRateLimiter` 三个核心参数：
  - `requests_per_second`：每秒允许的请求数（如 `0.1` = 每 10 秒 1 次）
  - `check_every_n_seconds`：检查间隔（如 `0.1` = 每 100ms 检查一次是否可发请求）
  - `max_bucket_size`：最大突发容量（允许的瞬时并发请求数上限）
- 速率限制器**仅限制请求频率，不限制请求大小**（如 token 数量）
- 速率限制器通过 `init_chat_model` 的 `rate_limiter` 参数传入，也可在模型类构造器中传入

## 生成要求

### 1. 导入与初始化
- 必须从 `langchain_core.rate_limiters` 导入，不可从其他路径导入

```python
from langchain_core.rate_limiters import InMemoryRateLimiter

rate_limiter = InMemoryRateLimiter(
    requests_per_second=0.1,
    check_every_n_seconds=0.1,
    max_bucket_size=10,
)
```

### 2. 绑定到模型
- 通过 `init_chat_model` 的 `rate_limiter` 参数传入
- 同一 rate_limiter 实例可被多个模型共享（线程安全）

```python
model = init_chat_model(
    model="gpt-5.4",
    model_provider="openai",
    rate_limiter=rate_limiter,
)
```

### 3. 参数选择指导
- `requests_per_second`：根据 provider 的速率限制文档设置，通常设为略低于官方上限
- `check_every_n_seconds`：保持默认 `0.1`（100ms），无需修改
- `max_bucket_size`：根据应用并发量设置，高并发场景适当调大以容纳突发流量

## 反例
- ❌ 不使用速率限制器，连续大量 `invoke` 调用，依赖 provider 的 429 错误来被动限速
  - ✅ FIX：在初始化模型时绑定 `InMemoryRateLimiter`
- ❌ `requests_per_second` 设为 provider 官方上限的精确值
  - ✅ FIX：设为略低于上限（如官方上限 1 req/s，设为 0.9），留缓冲空间
- ❌ `from langchain.rate_limiters import InMemoryRateLimiter` — 导入路径错误
  - ✅ FIX：`from langchain_core.rate_limiters import InMemoryRateLimiter`
- ❌ 每个模型实例单独创建一个 rate_limiter，同一线程内重复限速
  - ✅ FIX：同进程内共享一个 `InMemoryRateLimiter` 实例
- ❌ 认为速率限制器可以限制 token 消耗
  - ✅ FIX：速率限制器只限制请求频率，token 用量需通过 `max_tokens` 等其他参数控制
```
LangChain 基础 URL 和代理设置
# 约束：LangChain 基础 URL 和代理设置的代码规范

## 技术边界
- `base_url` 用于指定 OpenAI 兼容 API 的服务地址，适用于第三方 provider（Together AI、vLLM 等）或本地部署的模型服务
- `base_url` 仅在 `model_provider="openai"` 或直接使用 `ChatOpenAI` 时支持
- `model_provider="openai"` 遵循官方 OpenAI API 规范，路由器/代理的 provider 特有字段可能丢失
- OpenRouter 和 LiteLLM 有专属集成（`langchain-openrouter`、`langchain-litellm`），不应用 `base_url` 方式连接
- HTTP 代理通过 provider 专属参数配置（如 `ChatOpenAI` 的 `openai_proxy` 参数），参数名因 provider 而异
- 代理支持并非所有集成都有，需查阅对应 provider 参考文档
- `api_key` 与 `base_url` 配合使用时必须显式传入，不可依赖环境变量默认值（因为 base_url 指向非官方服务）

## 生成要求

### 1. 自定义 Base URL（OpenAI 兼容 API）
- 使用 `init_chat_model` 时指定 `model_provider="openai"`
- 必须同时传入 `base_url` 和 `api_key`
- `model` 参数为第三方服务支持的模型名

```python
model = init_chat_model(
    model="MODEL_NAME",
    model_provider="openai",
    base_url="https://your-custom-endpoint.com/v1",
    api_key="YOUR_API_KEY",
)
```

### 2. 使用直接模型类时
- 参数名因 provider 而异，需查阅对应参考文档
- `ChatOpenAI` 支持 `base_url` 参数

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    model="gpt-5.4",
    base_url="https://your-custom-endpoint.com/v1",
    api_key="YOUR_API_KEY",
)
```

### 3. OpenRouter / LiteLLM
- **不使用 `base_url` 参数**
- 使用专属集成包和专属模型类

```python
# OpenRouter
from langchain_openrouter import ChatOpenRouter
model = ChatOpenRouter(model="auto")

# LiteLLM
from langchain_litellm import ChatLiteLLM
model = ChatLiteLLM(model="gpt-5.4")
```

### 4. HTTP 代理配置
- 仅在部署环境需要通过代理访问外网时使用
- 参数名因 provider 而异，`ChatOpenAI` 使用 `openai_proxy`

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    model="gpt-5.4",
    openai_proxy="http://proxy.example.com:8080",
)
```

### 5. `api_key` 处理
- 使用 `base_url` 时必须显式传入 `api_key`，不依赖环境变量
- 不可将第三方 API Key 写入系统的 `OPENAI_API_KEY` 环境变量（会导致与官方 OpenAI 服务冲突）

## 反例
- ❌ 用 `base_url` 连接 OpenRouter：`init_chat_model("openai:gpt-5.4", base_url="https://openrouter.ai/...")`
  - ✅ FIX：使用 `langchain-openrouter` 的 `ChatOpenRouter`
- ❌ `init_chat_model(model="...", model_provider="openai", base_url="...")` — 缺 `api_key`
  - ✅ FIX：同时显式传入 `api_key`
- ❌ 将第三方 API Key 设为环境变量 `OPENAI_API_KEY`，然后连接第三方 base_url
  - ✅ FIX：第三方 API Key 显式传入 `api_key` 参数，避免污染官方 API Key 环境变量
- ❌ `ChatAnthropic(model="...", openai_proxy="...")` — 使用了不存在的参数名
  - ✅ FIX：查阅对应 provider 参考文档确认正确的代理参数名
- ❌ 用 `base_url` 指向官方 OpenAI API 来做代理转发
  - ✅ FIX：代理转发用 HTTP 代理配置（如 `openai_proxy`），非 `base_url`
```

LangChain 对数概率（Log Probabilities）
# 约束：LangChain 对数概率（Log Probabilities）的代码规范

## 技术边界
- Log Probabilities 指模型生成每个 token 时的对数概率，反映模型对该 token 的确定程度
- 通过 `model.bind(logprobs=True)` 启用，非所有 provider 支持（需查阅对应集成文档）
- 结果存储在 `response.response_metadata["logprobs"]` 中，不在 `.content` 或 `.content_blocks` 中
- 每个 token 项包含：`token`（生成的 token 字符串）、`logprob`（对数概率，接近 0 表示高确定性，越负越不确定）、`top_logprobs`（该位置其他候选 token 及概率列表）
- **流式模式下不返回完整 logprobs**，需在非流式 `invoke` 后获取
- 仅用于调试、评估和优化，不用于运行时业务逻辑判断

## 生成要求

### 1. 启用 logprobs
- 通过 `.bind(logprobs=True)` 在模型初始化后绑定，不可在 `init_chat_model` 的 kwargs 中直接传入

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    model="gpt-5.4",
    model_provider="openai",
).bind(logprobs=True)
```

### 2. 提取 logprobs
- 必须从 `response.response_metadata["logprobs"]` 提取，不可从 `.content` 或其他路径
- `response_metadata` 是 dict，`logprobs` 不一定存在——取决于 provider 是否支持和是否启用

```python
response = model.invoke("Why do parrots talk?")
logprobs = response.response_metadata.get("logprobs")

if logprobs:
    for token_info in logprobs:
        token = token_info.get("token")
        logprob = token_info.get("logprob")
        top_candidates = token_info.get("top_logprobs", [])
        print(f"Token: {token}, Logprob: {logprob}")
```

### 3. 高不确定性检测（调试用途）
- `logprob` 值异常低（如 < -5.0）的 token 是潜在问题点
- 可遍历 logprobs 找出低概率 token 做标记
- 低概率 token 连续出现可能表明模型开始胡编

### 4. 兼容性处理
- 读取前检查 `response_metadata` 中是否包含 `logprobs` 字段
- 不支持 logprobs 的 provider 绑定后不会报错，但 `response_metadata` 中可能无此字段

## 反例
- ❌ `init_chat_model("gpt-5.4", logprobs=True)` — 直接将 logprobs 作为模型初始化参数
  - ✅ FIX：使用链式 `.bind(logprobs=True)`
- ❌ `response.logprobs` — 直接从 response 对象访问
  - ✅ FIX：`response.response_metadata["logprobs"]`
- ❌ 流式模式下调用并期望获取完整 logprobs
  - ✅ FIX：logprobs 在非流式 `invoke` 后获取，流式模式下使用 `astream_events` 或累积后查看
- ❌ 直接 `response.response_metadata["logprobs"]` 键访问不检查字段存在性
  - ✅ FIX：使用 `.get("logprobs")` 并处理 None
- ❌ 依赖 logprobs 做生产环境核心业务逻辑判断
  - ✅ FIX：logprobs 仅用于离线调试和评估，不用于运行时决策
LangChain Token 用量追踪（Token Usage）
# 约束：LangChain Token 用量追踪（Token Usage）的代码规范

## 技术边界
- Token 用量信息由 provider 在调用响应中返回，存储在 `AIMessage.response_metadata` 或 `usage_metadata` 中
- 不同 provider 返回的字段不同，但常见字段包括：`input_tokens`、`output_tokens`、`total_tokens`
- OpenAI 和 Azure OpenAI 在流式模式下需显式 opt-in 才返回 token 用量数据（查阅对应集成文档）
- LangChain 提供两种聚合多模型 token 用量的方式：**回调处理器**（`UsageMetadataCallbackHandler`）和**上下文管理器**（`get_usage_metadata_callback`）
- 回调处理器和上下文管理器的结果结构相同：`{model_name: {input_tokens, output_tokens, total_tokens, ...}}`
- 回调处理器是实例化的对象，可跨多次调用复用；上下文管理器通过 `with` 语句限定作用域

## 生成要求

### 1. 单次调用 Token 用量提取
- 从 `AIMessage` 对象上直接提取，不依赖回调系统
- 检查字段存在性：不同 provider 返回的字段名可能不同

```python
response = model.invoke("Hello")
# 方式一：从 response_metadata 提取
usage = response.response_metadata.get("token_usage", {})

# 方式二：从 usage_metadata 提取
usage = response.usage_metadata
```

### 2. 多模型 Token 用量聚合 — 回调处理器方式
- 创建一个 `UsageMetadataCallbackHandler` 实例
- 每次 `invoke` 时通过 `config={"callbacks": [callback]}` 传入同一实例
- 调用结束后通过 `callback.usage_metadata` 获取聚合结果

```python
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import UsageMetadataCallbackHandler

model_1 = init_chat_model("gpt-5.4-mini")
model_2 = init_chat_model("claude-haiku-4-5-20251001")

callback = UsageMetadataCallbackHandler()
model_1.invoke("Hello", config={"callbacks": [callback]})
model_2.invoke("Hello", config={"callbacks": [callback]})

print(callback.usage_metadata)
# {'gpt-5.4-mini': {...}, 'claude-haiku-4-5-20251001': {...}}
```

### 3. 多模型 Token 用量聚合 — 上下文管理器方式
- 使用 `with` 语句限定追踪作用域
- `cb.usage_metadata` 在 `with` 块结束后访问

```python
from langchain_core.callbacks import get_usage_metadata_callback

with get_usage_metadata_callback() as cb:
    model_1.invoke("Hello")
    model_2.invoke("Hello")
    print(cb.usage_metadata)
```

### 4. 流式模式下的 Token 用量
- OpenAI / Azure OpenAI 流式调用需要额外配置才返回 token 数据
- 查阅对应集成文档确认 opt-in 方式
- 其他 provider 可能流式模式下不返回 token 数据

## 反例
- ❌ 期望所有 provider 都返回 `total_tokens` 字段，不检查字段存在性
  - ✅ FIX：不同 provider 字段不同，通过 `.get("total_tokens", 0)` 提供默认值
- ❌ 每次 `invoke` 创建新的 `UsageMetadataCallbackHandler` 实例
  - ✅ FIX：同一实例跨多次调用复用，结果在 `usage_metadata` 中自动聚合
- ❌ `config={"callback": callback}` — 键名 `callback` 而非 `callbacks`
  - ✅ FIX：`config={"callbacks": [callback]}`，值为列表且键名复数
- ❌ 从 `response.content` 中正则提取 token 数字
  - ✅ FIX：从 `response.response_metadata` 或 `response.usage_metadata` 中结构化提取
- ❌ 上下文管理器方式：在 `with` 块外访问 `cb.usage_metadata`
  - ✅ FIX：必须在 `with` 块内访问，或赋值给外部变量
```
LangChain 调用配置（Invocation Config）
# 约束：LangChain 调用配置（Invocation Config）的代码规范

## 技术边界
- `config` 参数是一个 `RunnableConfig` 字典，在 `invoke`/`stream`/`batch` 调用时传入
- `config` 控制运行时的执行行为、回调、元数据追踪和并发控制，不影响模型本身的参数
- `config` 中的 `tags` 和 `metadata` 会被所有子调用继承；`run_name` 不被继承
- `callbacks` 传入的处理器在单次调用中生效，不与模型实例绑定
- `max_concurrency` 仅在 `batch()` 和 `batch_as_completed()` 时生效
- `recursion_limit` 限制链/图的递归深度，防止无限循环
- 所有 config 字段都是可选的，不传入时使用默认值

## 生成要求

### 1. 基本调用配置
- `config` 必须作为 `invoke`/`stream`/`batch` 的第二个参数传入（关键字参数形式）
- `config` 是一个 dict，内部字段名使用下划线命名

```python
response = model.invoke(
    "Tell me a joke",
    config={
        "run_name": "joke_generation",
        "tags": ["humor", "demo"],
        "metadata": {"user_id": "123"},
    },
)
```

### 2. 各字段使用约束

| 字段 | 使用要求 |
|------|---------|
| `run_name` | 字符串，用于标识本次调用。不可用于追踪跨调用的关联关系（不被继承） |
| `tags` | 字符串列表，用于分类和过滤。如 `["production", "chatbot"]`。所有子调用自动继承 |
| `metadata` | 字典，自定义键值对。如 `{"user_id": "123", "session_id": "abc"}`。所有子调用自动继承 |
| `callbacks` | 回调处理器列表，如 `[UsageMetadataCallbackHandler()]`。可复用同一实例跨多次调用 |
| `max_concurrency` | 整数，仅 `batch()`/`batch_as_completed()` 时使用。如 `config={"max_concurrency": 5}` |
| `recursion_limit` | 整数，限制链的最大递归深度。默认值足够大多数场景 |

### 3. 与 LangSmith 追踪配合
- `run_name` 在 LangSmith trace 中显示为本次 run 的名称
- `tags` 在 LangSmith 中用于过滤和组织 trace
- `metadata` 在 LangSmith 中作为自定义字段附加到 trace 上

### 4. 多模型共享 config
- `callbacks` 列表中传入 `UsageMetadataCallbackHandler` 可跨模型聚合 token 用量
- 同一 config 字典可复用于多次调用

## 反例
- ❌ `model.invoke("prompt", run_name="test")` — 将 config 字段作为独立关键字参数
  - ✅ FIX：`model.invoke("prompt", config={"run_name": "test"})`
- ❌ `config={"tags": "production"}` — tags 是字符串而非字符串列表
  - ✅ FIX：`config={"tags": ["production"]}`
- ❌ `config={"run_name": "parent"}` 后期望子调用 run 名称也是 `"parent"`
  - ✅ FIX：`run_name` 不被继承，子调用需单独设置
- ❌ 在 `invoke` 中使用 `config={"max_concurrency": 5}` — 对单次调用无意义
  - ✅ FIX：`max_concurrency` 仅在 `batch()`/`batch_as_completed()` 中生效
- ❌ `config={"callbacks": callback}` — callbacks 是单个对象而非列表
  - ✅ FIX：`config={"callbacks": [callback]}`，即使只有一个也要用列表包裹 

LangChain 可配置模型（Configurable Models）
# 约束：LangChain 可配置模型（Configurable Models）的代码规范

## 技术边界
- 可配置模型在初始化时不指定具体模型名，在每次 `invoke`/`stream` 时通过 `config` 动态指定
- `init_chat_model(temperature=0)` 不传 `model` 参数时，`model` 和 `model_provider` 默认可配置
- `configurable_fields` 参数可显式声明哪些字段在运行时可选配，未声明的字段使用初始化时的值
- `config_prefix` 用于在多模型链中区分不同模型的可配置参数，避免命名冲突
- `.bind_tools`、`.with_structured_output` 等声明式操作对可配置模型同样生效，最终调用的模型会执行绑定的工具/结构
- 每次 `invoke` 使用的模型可以不同，token 用量和 cost 按实际使用的模型计算

## 生成要求

### 1. 基础可配置模型
- `config` 中通过 `configurable` 子字典传入模型名
- `configurable` 字段的键名：无 `config_prefix` 时使用参数名本身

```python
model = init_chat_model(temperature=0)

model.invoke("prompt", config={"configurable": {"model": "gpt-5-nano"}})
model.invoke("prompt", config={"configurable": {"model": "claude-sonnet-4-6"}})
```

### 2. 有默认值的可配置模型 + config_prefix
- 初始化时指定默认 model
- `configurable_fields` 声明可被覆盖的字段
- `config_prefix` 为可配置字段添加前缀
- 使用 `config_prefix` 时，`configurable` 中的键名格式为 `{prefix}_{field_name}`

```python
model = init_chat_model(
    model="gpt-5.4-mini",          # 默认模型
    temperature=0,                  # 默认温度
    configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
    config_prefix="first",
)

# 使用默认值
model.invoke("prompt")

# 运行时覆盖
model.invoke("prompt", config={
    "configurable": {
        "first_model": "claude-sonnet-4-6",
        "first_temperature": 0.5,
        "first_max_tokens": 100,
    }
})
```

### 3. 声明式操作与可配置模型
- 声明式方法先于 `invoke` 执行，后于 `config` 生效
- `bind_tools` 绑定的工具对所有模型生效，不同模型共用同一工具集合

```python
model = init_chat_model(temperature=0)
model_with_tools = model.bind_tools([GetWeather, GetPopulation])

model_with_tools.invoke("prompt", config={"configurable": {"model": "gpt-5.4-mini"}})
model_with_tools.invoke("prompt", config={"configurable": {"model": "claude-sonnet-4-6"}})
```

## 反例
- ❌ 传给 `configurable` dict 的键名不带 `config_prefix`，但初始化时设置了 prefix
  - ✅ FIX：键名格式必须为 `{prefix}_{field_name}`，如 `first_model`
- ❌ `init_chat_model(temperature=0, config_prefix="first")` — 设置了 prefix 但没有 `configurable_fields`，不知道哪些字段可配
  - ✅ FIX：同时设置 `configurable_fields=("model", "temperature")` 明确可配字段
- ❌ 使用 `config_prefix` 时覆盖未在 `configurable_fields` 中声明的字段
  - ✅ FIX：只可覆盖 `configurable_fields` 中列出的字段，否则参数被忽略
- ❌ 在 `invoke` 的 `config` 中传入了一级键 `{"model": "..."}` 而非 `{"configurable": {"model": "..."}}`
  - ✅ FIX：可配置参数必须嵌套在 `configurable` 子字典中
- ❌ 两个可配置模型使用相同的 `config_prefix`
  - ✅ FIX：不同模型设置不同的 `config_prefix`，避免参数覆盖
```