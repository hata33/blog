https://docs.langchain.com/oss/python/langchain/messages

## Messages 模块划分

| 模块 | 核心知识点 | 为什么独立 |
|------|----------|-----------|
| **1. 消息类型** | SystemMessage / HumanMessage / AIMessage / ToolMessage 四种消息的职责和构造方式 | 消息是对话的基本单元，四类消息各有独立的构造参数和行为约束 |
| **2. 消息内容与 Content Blocks** | `content` vs `content_blocks` 的区别；标准内容块类型（text、reasoning、image、audio、video、file 等）的结构 | Content Blocks 是 LangChain v1 的核心抽象，是跨 provider 统一的媒介，与旧 `content` 属性有明确的使用边界 |
| **3. 多模态输入** | 图像/音频/视频/文件/PDF 在消息中的三种传入方式（URL、base64、file_id）及 provider 兼容性 | 代码结构完全不同于纯文本消息，需要独立约束 |
| **4. 多模态输出** | 从 `AIMessage.content_blocks` 中提取多模态数据 | 与输入对称但提取逻辑不同，需要独立约束 |
| **5. 工具调用消息** | AIMessage.tool_calls 的结构；ToolMessage 的 `tool_call_id` 匹配约束；`artifact` 字段的用途 | 工具调用消息有严格的结构契约（ID 匹配、执行顺序），是独立的知识点 |
| **6. 流式消息** | AIMessageChunk 的累积逻辑（`full = chunk if full is None else full + chunk`） | 流式与非流式的代码模式完全不同，需要独立约束 |
| **7. Token 用量追踪** | `usage_metadata` 的读取；`UsageMetadataCallbackHandler` 和上下文管理器两种聚合方式 | 跨模型追踪 token 用量是一个独立功能，与消息本身的创建/发送无关 |
| **8. 标准内容块参考** | TextContentBlock、ReasoningContentBlock、ToolCall、ToolCallChunk、ServerToolCall 等各块类型的字段结构 | 这是“字典的 schema 约束”——每种块类型有独立的必填字段和可选字段，适合作为独立的类型参考 | 



# 约束：LangChain 消息类型（Message Types）的代码规范

## 技术边界
- LangChain 消息分四种类型：`SystemMessage`、`HumanMessage`、`AIMessage`、`ToolMessage`
- 每条消息是独立对象，消息列表按时间顺序排列，模型依次处理
- 消息对象同时包含 `content`（原始内容）和 `content_blocks`（标准化内容块，LangChain v1 新增）
- `content` 向后兼容所有 provider，`content_blocks` 提供跨 provider 统一的类型安全接口
- 消息初始化时可用字符串简化方式（`SystemMessage("...`) 或 content blocks 列表方式
- 消息还包含 `name`、`id` 等可选元数据字段，`name` 在不同 provider 中行为不一致

## 生成要求

### 1. 消息构造方式
- 纯文本用简化方式：`SystemMessage("You are a helpful assistant.")`
- 含多模态或其他 content blocks 时用列表方式：`HumanMessage(content=[...])` 或 `HumanMessage(content_blocks=[...])`

### 2. 四种消息类型的创建

#### SystemMessage（系统消息）
- 用来设定对话基调、角色、行为准则
- 构造方式同 HumanMessage，一般在整个对话中只有一条，且放在消息列表开头
- 可使用多行字符串写长系统提示

```python
from langchain.messages import SystemMessage

system_msg = SystemMessage("You are a helpful assistant.")
```

#### HumanMessage（用户消息）
- 代表用户输入，可包含文本或多模态内容
- 可选字段 `name`（标识不同用户，provider 行为不一致）和 `id`（追踪用唯一 ID）

```python
from langchain.messages import HumanMessage

# 简化方式
human_msg = HumanMessage("What is machine learning?")

# 带元数据的完整方式
human_msg = HumanMessage(
    content="Hello!",
    name="alice",
    id="msg_123",
)
```

#### AIMessage（AI 回复）
- 由模型返回，也可手动构造并注入消息历史
- 关键属性：`.content`、`.content_blocks`、`.tool_calls`、`.usage_metadata`、`.response_metadata`
- 注入手动构造的 AIMessage 可用于模拟对话历史

```python
from langchain.messages import AIMessage

ai_msg = AIMessage("I'd be happy to help you with that question!")

# 含工具调用的 AIMessage
ai_msg = AIMessage(
    content=[],
    tool_calls=[{
        "name": "get_weather",
        "args": {"location": "San Francisco"},
        "id": "call_123"
    }]
)
```

#### ToolMessage（工具返回结果）
- 必须与 AIMessage.tool_calls 中的 `id` 匹配
- 三个必填参数：`content`、`tool_call_id`、`name`
- 可选参数 `artifact`：存储不发送给模型但可供程序访问的额外数据

```python
from langchain.messages import ToolMessage

tool_message = ToolMessage(
    content="Sunny, 72°F",
    tool_call_id="call_123",
    name="get_weather",
)
```

### 3. 消息列表构造与传递给模型
- 调用模型时入参是消息对象列表或 dict 列表
- 同一个调用中消息格式统一，不混用对象和 dict

```python
messages = [system_msg, human_msg]
response = model.invoke(messages)
```

## 反例
- ❌ 工具调用后不追加 ToolMessage，直接发下一轮 HumanMessage
  - ✅ FIX：追加 `ToolMessage(content=..., tool_call_id=..., name=...)` 后再继续对话
- ❌ ToolMessage 的 `tool_call_id` 与 AIMessage 中的 tool_call `id` 不匹配
  - ✅ FIX：`tool_call_id` 必须从 `tool_call["id"]` 精确复制
- ❌ 在一个列表里混用 Message 对象和 dict
  - ✅ FIX：统一为一种格式
- ❌ 手动构造 AIMessage 时不传 `content=[]`（当有 tool_calls 时）
  - ✅ FIX：有 tool_calls 时 content 不能是纯文本，应为 `[]` 或与 tool_calls 对应的 content blocks 


# 约束：LangChain 消息内容与 Content Blocks 的代码规范

## 技术边界
- `content` 属性是消息的原始内容，支持字符串或列表（list of dict），与 provider 原生格式兼容
- `content_blocks` 属性是 LangChain v1 新增的跨 provider 标准化内容表示，通过惰性解析 `content` 生成
- 消息初始化时可直接传入 `content`（向后兼容）或 `content_blocks`（类型安全接口），但不能同时传两者
- `content_blocks` 是一个列表，每个元素为强类型 dict，`type` 字段标识块类型（`text`、`reasoning`、`image`、`audio`、`video`、`file`、`tool_call`、`server_tool_call` 等）
- 不同 provider 原生格式不同（如 Anthropic 用 `thinking`，OpenAI 用 `reasoning`），但 `content_blocks` 统一为 `reasoning`
- 如需外部访问标准化格式，可设置 `output_version="v1"` 或环境变量 `LC_OUTPUT_VERSION=v1`，将 `content_blocks` 存入 `content`

## 生成要求

### 1. 内容传入方式选择
- 纯文本：使用简化方式 `HumanMessage("文本内容")`，`content` 为字符串，`content_blocks` 自动生成
- provider 原生格式：使用 `content=[...]` 传入 provider 原生 dict 列表，`content_blocks` 惰性解析
- 标准格式：使用 `content_blocks=[...]` 传入 LangChain 标准块类型列表，`content` 自动填充

```python
from langchain.messages import HumanMessage

# 方式一：纯文本
msg = HumanMessage("Hello, how are you?")

# 方式二：provider 原生格式
msg = HumanMessage(content=[
    {"type": "text", "text": "Hello, how are you?"},
    {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
])

# 方式三：标准 content_blocks
msg = HumanMessage(content_blocks=[
    {"type": "text", "text": "Hello, how are you?"},
    {"type": "image", "url": "https://example.com/image.jpg"},
])
```

### 2. 读取内容
- 优先使用 `content_blocks` 读取，保证跨 provider 一致
- `content_blocks` 由 `content` 惰性解析得来，无额外开销
- 遍历时必须检查 `block["type"]` 做分支处理

```python
response = model.invoke("prompt")
for block in response.content_blocks:
    if block["type"] == "text":
        print(block["text"])
    elif block["type"] == "reasoning":
        print(block["reasoning"])
    elif block["type"] == "image":
        print(block.get("url") or block.get("base64"))
```

### 3. 各内容块类型的核心字段（只列出必填和常用字段，完整参考见标准内容块参考模块）
- `TextContentBlock`：`"type": "text"`，必填 `text`
- `ReasoningContentBlock`：`"type": "reasoning"`，`reasoning` 为推理文本
- `ImageContentBlock`：`"type": "image"`，`url` 或 `base64` 或 `file_id` 三选一
- `AudioContentBlock`：`"type": "audio"`，`base64` 时必填 `mime_type`
- `VideoContentBlock`：`"type": "video"`，`base64` 时必填 `mime_type`
- `FileContentBlock`：`"type": "file"`，`base64` 时必填 `mime_type`
- `ToolCall`：`"type": "tool_call"`，必填 `name`、`args`、`id`
- `ServerToolCall`：`"type": "server_tool_call"`，必填 `name`、`args`、`id`
- `ServerToolResult`：`"type": "server_tool_result"`，必填 `tool_call_id`、`status`

### 4. 标准化输出（v1 模式）
- 如需外部系统访问标准化 content_blocks，设置 `output_version="v1"` 或 `LC_OUTPUT_VERSION=v1`
- 此模式下 `content` 存储标准化格式，非 provider 原生格式

```python
from langchain.chat_models import init_chat_model
model = init_chat_model("gpt-5-nano", output_version="v1")
```

## 反例
- ❌ 同时传 `content` 和 `content_blocks` 给同一条消息
  - ✅ FIX：二选一，不可同时指定
- ❌ 读取 `content_blocks` 时不检查 `block["type"]`，直接读取 `block["text"]`
  - ✅ FIX：先判断 `block["type"]`，再读取对应字段
- ❌ base64 传文件时不传 `mime_type`
  - ✅ FIX：base64 数据必须附带 `mime_type`
- ❌ 假设所有 provider 都返回相同 content 格式
  - ✅ FIX：通过 `content_blocks` 统一访问，不依赖 provider 原生格式
- ❌ 遍历 `content_blocks` 时因未知 block type 抛异常
  - ✅ FIX：对未知 type 做降级处理，不阻塞其余块的读取 


# 约束：LangChain 多模态输入（Multimodal Input）的代码规范

## 技术边界
- 多模态输入指将图片、音频、视频、PDF 等非文本数据传递给模型
- 三种传递方式：URL、base64 编码、provider 管理的 File ID，三选一不可混用
- 数据通过消息的 `content` 列表或 `content_blocks` 列表传入，每种媒体类型有独立的 content block type
- 支持的媒体类型：`image`、`audio`、`video`、`file`（PDF 等通用文件）、`text-plain`（.txt/.md 文档）
- 非所有模型支持所有媒体类型，需通过 `model.profile` 检查能力
- 部分 provider 对特定类型有额外字段要求（如 OpenAI 和 AWS Bedrock Converse 对 PDF 要求文件名），需查阅对应 provider 文档
- 额外字段可放在 content block 顶层或嵌套在 `"extras": {}` 中

## 生成要求

### 1. 图片输入（ImageContentBlock）
- `type` 固定为 `"image"`
- 传入方式三选一：`url`（图片链接）、`base64` + `mime_type`（编码数据）、`file_id`（provider 托管）

```python
# 方式一：URL
{"role": "user", "content": [
    {"type": "text", "text": "描述这张图片"},
    {"type": "image", "url": "https://example.com/image.jpg"},
]}

# 方式二：base64
{"role": "user", "content": [
    {"type": "text", "text": "描述这张图片"},
    {"type": "image", "base64": "AAAAIGZ0eXBtcDQy...", "mime_type": "image/jpeg"},
]}

# 方式三：File ID
{"role": "user", "content": [
    {"type": "text", "text": "描述这张图片"},
    {"type": "image", "file_id": "file-abc123"},
]}
```

### 2. 音频输入（AudioContentBlock）
- `type` 固定为 `"audio"`
- 支持 base64（需 `mime_type`）和 file_id

```python
{"role": "user", "content": [
    {"type": "text", "text": "描述这段音频"},
    {"type": "audio", "base64": "...", "mime_type": "audio/wav"},
]}
```

### 3. 视频输入（VideoContentBlock）
- `type` 固定为 `"video"`
- 支持 base64（需 `mime_type`）和 file_id

```python
{"role": "user", "content": [
    {"type": "text", "text": "描述这段视频"},
    {"type": "video", "base64": "...", "mime_type": "video/mp4"},
]}
```

### 4. 文件/文档输入（FileContentBlock / PlainTextContentBlock）
- PDF 等通用文件用 `"type": "file"`，文本文件（.txt/.md）用 `"type": "text-plain"`
- 支持 url、base64（需 `mime_type`）、file_id

```python
# PDF
{"role": "user", "content": [
    {"type": "text", "text": "总结这个文档"},
    {"type": "file", "url": "https://example.com/document.pdf"},
]}

# 文本文件
{"role": "user", "content": [
    {"type": "text", "text": "总结这个文档"},
    {"type": "text-plain", "text": "...", "mime_type": "text/plain"},
]}
```

### 5. 多模态输入格式选择
- dict 格式（直接构造 `content` 列表）和 content_blocks 格式均可
- dict 格式示例见上述代码
- content_blocks 格式将上述 dict 列表作为 `content_blocks` 参数值传入

### 6. 能力检查
- 调用前通过 `model.profile` 检查对应能力字段
- 不支持时给出提示或降级处理

## 反例
- ❌ 同一条 content block 同时传 `url` 和 `base64` 和 `file_id`
  - ✅ FIX：三选一
- ❌ base64 数据不传 `mime_type`
  - ✅ FIX：base64 方式必须附带 `mime_type`（如 `image/jpeg`、`audio/wav`、`application/pdf`）
- ❌ 不检查 provider 支持的文件格式和大小限制，传任意文件
  - ✅ FIX：查阅 provider 文档确认支持的格式和大小
- ❌ 纯文本内容用 `"type": "file"` 而非 `"text-plain"`
  - ✅ FIX：文本文件用 `"type": "text-plain"`
- ❌ 使用 `text` 字段放非文本的 base64 数据
  - ✅ FIX：非文本数据用对应的媒体类型 content block 



# 约束：LangChain 多模态输出（Multimodal Output）的代码规范

## 技术边界
- 部分模型可在响应中返回多模态数据（图片、音频等），不只是文本
- 多模态输出通过 `AIMessage.content_blocks` 提取，不在 `.content` 或 `.text` 中
- 文本块和多模态块混合在同一个 `content_blocks` 列表中，按生成顺序排列
- 多模态块的 `type` 字段标识类型：`image`、`audio`、`video` 等
- 通过 `model.profile` 检查模型是否支持多模态输出（如 `image_outputs`、`audio_outputs` 等字段）
- 多模态输出能力因模型和 provider 而异，不可假设所有模型都支持

## 生成要求

### 1. 多模态输出提取
- 必须遍历 `response.content_blocks`，按 `block["type"]` 分别处理
- 文本块用 `block["text"]` 提取，多模态块用对应字段提取

```python
response = model.invoke("Create a picture of a cat")
for block in response.content_blocks:
    if block["type"] == "text":
        print(f"[文本]: {block['text']}")
    elif block["type"] == "image":
        base64_data = block.get("base64")
        mime_type = block.get("mime_type")
        url = block.get("url")
        if base64_data:
            save_base64_image(base64_data, mime_type)
        elif url:
            download_image(url)
    elif block["type"] == "audio":
        base64_data = block.get("base64")
        mime_type = block.get("mime_type")
        save_base64_audio(base64_data, mime_type)
    elif block["type"] == "video":
        base64_data = block.get("base64")
        mime_type = block.get("mime_type")
        save_base64_video(base64_data, mime_type)
    else:
        # 未知类型降级处理，不阻塞后续块
        pass
```

### 2. 多模态输出与文本输出的关系
- 模型可能先生成文本描述再生成图片，或先生成图片再生成文本
- `content_blocks` 的顺序即为生成顺序
- 不可假设文本块和多模态块的先后关系

### 3. 能力检查
- 调用多模态输出功能前必须通过 `model.profile` 检查
- 不支持时做降级处理

```python
profile = model.profile
if not profile.get("image_outputs", False):
    # 降级处理：提示用户该模型不支持图片生成
    pass
```

### 4. 多模态块的字段结构
- `image` 块：`url` 或 `base64` + `mime_type`
- `audio` 块：`url` 或 `base64` + `mime_type`
- `video` 块：`url` 或 `base64` + `mime_type`

## 反例
- ❌ 只读 `response.content` 或 `response.text`，忽略多模态输出
  - ✅ FIX：遍历 `response.content_blocks`，按类型分别处理
- ❌ 假设多模态块一定是图片，直接读 `block["base64"]`
  - ✅ FIX：先判断 `block["type"]`，再按类型读对应字段
- ❌ 不知道 `block["type"]` 时抛异常
  - ✅ FIX：对未知 type 降级处理，不阻塞其余块
- ❌ 不检查 `model.profile` 就调用多模态输出
  - ✅ FIX：调用前通过 `model.profile` 检查能力
- ❌ 假设所有模型的 `content_blocks` 顺序都是先文本后图片
  - ✅ FIX：按实际顺序处理，不假定先后关系 


# 约束：LangChain 工具调用消息的代码规范

## 技术边界
- 工具调用涉及两种消息类型：AIMessage（含 `tool_calls`）和 ToolMessage（工具执行结果）
- AIMessage 的 `tool_calls` 是列表，每个元素包含 `name`（工具名）、`args`（参数）、`id`（唯一标识）
- ToolMessage 必须通过 `tool_call_id` 与 AIMessage 中的 `id` 精确匹配
- 模型可同时发起多个并行工具调用（默认开启），`tool_calls` 列表中每个元素是独立的调用请求
- 客户端工具调用：模型发起 tool_calls → 开发者执行工具 → 返回 ToolMessage → 模型处理结果
- 服务端工具调用不走此流程，直接在 content_blocks 中返回 server_tool_call 和 server_tool_result
- ToolMessage 的 `artifact` 字段存储不发送给模型的额外数据（如文档 ID、页码、调试信息），供程序读取
- 手动构造含 tool_calls 的 AIMessage 注入对话历史时，`content` 必须为 `[]` 而非文本字符串

## 生成要求

### 1. 工具调用 AIMessage 的构造
- 由模型自动生成时从 `response.tool_calls` 提取
- 手动构造注入历史时，必须同时设置 `content=[]` 和 `tool_calls` 字段

```python
from langchain.messages import AIMessage

ai_msg = AIMessage(
    content=[],
    tool_calls=[{
        "name": "get_weather",
        "args": {"location": "San Francisco"},
        "id": "call_123"
    }]
)
```

### 2. ToolMessage 的构造
- 三个必填参数：`content`（字符串形式的工具返回结果）、`tool_call_id`（必须匹配对应 tool_call 的 `id`）、`name`（工具名称）
- `tool_call_id` 必须从对应 AIMessage 的 `tool_call["id"]` 原样提取，不可硬编码或伪造

```python
from langchain.messages import ToolMessage

# 对应上面的 tool_call id="call_123"
tool_message = ToolMessage(
    content="Sunny, 72°F",
    tool_call_id="call_123",
    name="get_weather",
)
```

### 3. 带 artifact 的 ToolMessage
- `artifact` 是一个 dict，存储程序需要的额外数据
- `artifact` 不会被发送给模型，不影响推理
- 典型用途：存储原始数据、文档 ID、页码、调试信息

```python
tool_message = ToolMessage(
    content="It was the best of times...",
    tool_call_id="call_456",
    name="search_books",
    artifact={"document_id": "doc_123", "page": 0},
)
```

### 4. 工具调用循环的完整消息序列
- 用户提问 → AIMessage(含 tool_calls) → ToolMessage → AIMessage(含最终文本回复)
- 多个并行工具调用时，ToolMessage 的顺序不重要（通过 `tool_call_id` 匹配），但所有 ToolMessage 必须在再次调用模型前全部追加

```python
# 步骤 1：模型发起工具调用
messages = [HumanMessage("What's the weather?")]
ai_msg = model_with_tools.invoke(messages)
messages.append(ai_msg)

# 步骤 2：执行工具并追加 ToolMessage
for tool_call in ai_msg.tool_calls:
    result = execute_tool(tool_call["name"], tool_call["args"])
    messages.append(ToolMessage(
        content=result,
        tool_call_id=tool_call["id"],
        name=tool_call["name"],
    ))

# 步骤 3：模型整合结果
final_response = model_with_tools.invoke(messages)
```

### 5. 多工具调用时的 ID 匹配
- 每个 ToolMessage 的 `tool_call_id` 必须与 AIMessage 中对应工具调用的 `id` 一 一匹配
- 不可一个 ToolMessage 对应多个 tool_call_id
- 不可省略 `tool_call_id`

## 反例
- ❌ ToolMessage 的 `tool_call_id` 硬编码字符串 `"call_001"`
  - ✅ FIX：从 `tool_call["id"]` 动态提取
- ❌ 手动构造含 tool_calls 的 AIMessage 时不传 `content=[]`
  - ✅ FIX：有 tool_calls 时必须设置 `content=[]`
- ❌ 并行工具调用只追加一个 ToolMessage 就再次调用模型
  - ✅ FIX：所有并行调用的 ToolMessage 全部追加后再发起下次模型调用
- ❌ 把 `artifact` 里的数据放进 `content` 试图让模型处理
  - ✅ FIX：`artifact` 是给程序读的，`content` 才是给模型读的
- ❌ 工具调用返回后直接读 `response.content` 当最终答案，不检查还有无后续 tool_calls
  - ✅ FIX：追加 ToolMessage 后再次调用模型，直到 AIMessage 不含 tool_calls 且 `.content` 有值 



# 约束：LangChain 流式消息（Streaming Messages）的代码规范

## 技术边界
- 流式模式返回 `AIMessageChunk` 对象，非完整 `AIMessage`
- 每个 chunk 包含部分输出内容，通过 `.text` 快速获取文本，通过 `.content_blocks` 获取结构化内容
- `AIMessageChunk` 可通过 `+` 运算符累积为完整 `AIMessage`：`full = chunk if full is None else full + chunk`
- 累积后的 `full` 具备 `AIMessage` 的全部属性：`.content_blocks`、`.tool_calls`、`.usage_metadata` 等
- `content_blocks` 在流式模式下同样可用，类型包括 `text`、`reasoning`、`tool_call_chunk` 等
- `tool_call_chunk` 是流式特有的块类型，随流式进度渐增完整；累积为 `AIMessage` 后自动转换为 `tool_call`
- `model.stream()` 返回迭代器，每次迭代只产出当前 chunk 的增量数据
- LangGraph Agent 中 `invoke` 在流式上下文会自动委托为流式

## 生成要求

### 1. 基础流式循环
- 使用 `for chunk in model.stream(prompt):` 遍历
- 每个 chunk 通过 `.text` 打印增量文本
- 同时累积 chunk 为完整消息

```python
chunks = []
full = None
for chunk in model.stream("写一首关于春天的诗"):
    chunks.append(chunk)
    print(chunk.text, end="", flush=True)
    full = chunk if full is None else full + chunk

# 循环结束后 full 是完整 AIMessage
print(full.content_blocks)
```

### 2. 区分内容块的流式循环
- 遍历 `chunk.content_blocks`，按 `block["type"]` 分别输出

```python
for chunk in model.stream("复杂推理问题"):
    for block in chunk.content_blocks:
        if block["type"] == "reasoning" and block.get("reasoning"):
            print(f"[推理]: {block['reasoning']}")
        elif block["type"] == "text":
            print(block["text"], end="", flush=True)
        elif block["type"] == "tool_call_chunk":
            # tool_call_chunk 是增量片段，不在此处完整输出
            pass
        else:
            # 未知类型降级
            pass
```

### 3. 累积 AIMessageChunk
- 固定模式：`full = chunk if full is None else full + chunk`
- 两个 `AIMessageChunk` 可通过 `+` 合并
- `AIMessageChunk` + `AIMessage` 也返回 `AIMessage`

```python
full = None
for chunk in model.stream("Hello"):
    full = chunk if full is None else full + chunk
    print(full.text)  # 输出累积到当前的结果

# 循环结束，full 等同于 invoke 返回的 AIMessage
```

### 4. 流式模式下的工具调用
- 工具调用信息在流式模式下通过 `tool_call_chunks` 属性逐块到达
- 累积后 `full.tool_calls` 包含完整的工具调用列表
- 流式过程中不执行工具调用：等循环结束后从 `full.tool_calls` 取完整结构

### 5. 流式文本输出约定
- `chunk.text` 是当前增量文本片段
- `chunk.content_blocks` 中 `"type": "text"` 的块与 `.text` 内容一致
- 每次 chunk 的新增文本是累积文本的后缀，与前一个 chunk 拼接后形成连贯文本

## 反例
- ❌ 流式循环内直接 `print(chunk)` 而非 `print(chunk.text)`
  - ✅ FIX：使用 `chunk.text` 打印增量文本
- ❌ 流式结束后不累积 `full`，每次 chunk 单独处理
  - ✅ FIX：使用 `full = chunk if full is None else full + chunk` 累积
- ❌ 在流式循环中途执行工具调用（此时 tool_call_chunks 不完整）
  - ✅ FIX：循环结束后从累积的 `full.tool_calls` 获取完整工具调用
- ❌ `chunk.content` 与 `chunk.text` 混用，期望相同结果
  - ✅ FIX：流式模式下优先用 `.text` 取文本增量
- ❌ 累积时用 `list.append` 拼接字符串而非用 `+` 合并 AIMessageChunk 对象
  - ✅ FIX：`+` 合并保留结构化信息，字符串拼接丢失 tool_calls、content_blocks 等 


# 约束：LangChain Token 用量追踪的代码规范

## 技术边界
- Token 用量信息存储在 `AIMessage.response_metadata` 或 `usage_metadata` 中
- 不同 provider 返回的字段略有不同，常用字段：`input_tokens`、`output_tokens`、`total_tokens`、`input_token_details`、`output_token_details`
- 读取前检查字段存在性，不假设所有 provider 都返回完整的 token 统计
- 多模型场景下可用两种聚合方式：`UsageMetadataCallbackHandler`（跨调用复用）和 `get_usage_metadata_callback`（上下文管理器）
- 聚合结果以模型名称为 key 的 dict，每个 value 是 token 用量的 dict
- OpenAI 和 Azure OpenAI 流式模式下默认不返回 token 用量，需显式 opt-in

## 生成要求

### 1. 单次调用读取 token 用量
- 从 `response.response_metadata` 或 `response.usage_metadata` 读取

```python
response = model.invoke("Hello")

# 方式一：response_metadata
usage = response.response_metadata.get("token_usage", {})
input_tokens = usage.get("input_tokens", 0)
output_tokens = usage.get("output_tokens", 0)

# 方式二：usage_metadata（推荐）
total = response.usage_metadata.get("total_tokens", 0)
```

### 2. 多模型聚合 — 回调处理器方式
- 创建 `UsageMetadataCallbackHandler` 实例，跨多次 `invoke` 复用
- 每次调用通过 `config={"callbacks": [callback]}` 传入同一实例
- 调用结束后 `callback.usage_metadata` 为聚合结果

```python
from langchain_core.callbacks import UsageMetadataCallbackHandler

model_1 = init_chat_model("gpt-5.4-mini")
model_2 = init_chat_model("claude-haiku-4-5-20251001")

callback = UsageMetadataCallbackHandler()
model_1.invoke("Hello", config={"callbacks": [callback]})
model_2.invoke("Hello", config={"callbacks": [callback]})

print(callback.usage_metadata)
# {'gpt-5.4-mini': {...}, 'claude-haiku-4-5-20251001': {...}}
```

### 3. 多模型聚合 — 上下文管理器方式
- 使用 `with get_usage_metadata_callback() as cb:` 限定作用域
- `cb.usage_metadata` 在 `with` 块内或块外访问（需赋值给外部变量）

```python
from langchain_core.callbacks import get_usage_metadata_callback

with get_usage_metadata_callback() as cb:
    model_1.invoke("Hello")
    model_2.invoke("Hello")
    usage_data = cb.usage_metadata

print(usage_data)
# {'gpt-5.4-mini': {...}, 'claude-haiku-4-5-20251001': {...}}
```

### 4. 聚合结果的结构
- Key 为模型名称（与 `init_chat_model` 传入的名字一致）
- Value 为 dict，典型字段：
  - `input_tokens`：输入 token 数
  - `output_tokens`：输出 token 数
  - `total_tokens`：总 token 数
  - `input_token_details`：输入 token 细节（如 `audio`、`cache_read`）
  - `output_token_details`：输出 token 细节（如 `reasoning`）

## 反例
- ❌ 假设所有 provider 都返回 `total_tokens`，不检查字段存在性
  - ✅ FIX：使用 `.get("total_tokens", 0)` 提供默认值
- ❌ 每次 `invoke` 创建新的 `UsageMetadataCallbackHandler`
  - ✅ FIX：同一实例跨调用复用，结果自动聚合
- ❌ `config={"callback": callback}` 单数键名
  - ✅ FIX：`config={"callbacks": [callback]}`，值为列表
- ❌ 上下文管理器方式在 `with` 块外访问 `cb` 变量
  - ✅ FIX：在 `with` 块内将 `cb.usage_metadata` 赋值给外部变量
- ❌ 流式模式下期望自动返回 token 用量（OpenAI/Azure）
  - ✅ FIX：查阅对应集成文档，确认是否需要 opt-in 



之前每个模块的格式是**技术边界 → 生成要求 → 反例 → 验收标准**，你说得对，最后一个模块缺了反例。补上：

---

# 约束：LangChain 标准内容块类型参考的代码规范

## 技术边界
- 内容块分四大类：核心块（text、reasoning）、多模态块（image、audio、video、file、text-plain）、工具调用块（tool_call、tool_call_chunk、invalid_tool_call）、服务端工具块（server_tool_call、server_tool_call_chunk、server_tool_result）
- 所有块共有的必填字段：`type`（字符串，标识块类型）
- 不同 provider 的原生格式自动解析为标准块（如 Anthropic 的 `thinking` → `reasoning`，OpenAI 的 `reasoning` summary → 多个 `reasoning` 块）
- 未知类型用 `"non_standard"` 块承载，仅含 `type` 和 `value`
- 部分 provider 特有字段通过 `extras` 字典传递，不放在块顶层

## 生成要求

### 1. 文本块
```python
{"type": "text", "text": "Here is the answer"}
```

### 2. 推理块
```python
{"type": "reasoning", "reasoning": "The user wants to know about..."}
```

### 3. 图片块（url / base64 / file_id 三选一）
```python
{"type": "image", "url": "https://example.com/image.jpg"}
{"type": "image", "base64": "...", "mime_type": "image/jpeg"}
{"type": "image", "file_id": "file-abc123"}
```

### 4. 音频块
```python
{"type": "audio", "base64": "...", "mime_type": "audio/wav"}
```

### 5. 视频块
```python
{"type": "video", "base64": "...", "mime_type": "video/mp4"}
```

### 6. 文件块
```python
{"type": "file", "url": "https://example.com/document.pdf"}
{"type": "file", "base64": "...", "mime_type": "application/pdf"}
```

### 7. 纯文本文档块
```python
{"type": "text-plain", "text": "# Title\nContent...", "mime_type": "text/markdown"}
```

### 8. 工具调用块
```python
{"type": "tool_call", "name": "search", "args": {"query": "weather"}, "id": "call_123"}
```

### 9. 工具调用块片段（流式）
```python
{"type": "tool_call_chunk", "name": "search", "args": "{\"query\":", "id": "call_123", "index": 0}
```

### 10. 无效工具调用块
```python
{"type": "invalid_tool_call", "name": "search", "error": "JSON parse error"}
```

### 11. 服务端工具调用块
```python
{"type": "server_tool_call", "id": "ws_abc123", "name": "web_search", "args": {"query": "..."}}
```

### 12. 服务端工具调用块片段（流式）
```python
{"type": "server_tool_call_chunk", "id": "ws_abc123", "name": "web_search", "args": "{\"query\":", "index": 0}
```

### 13. 服务端工具结果块
```python
{"type": "server_tool_result", "tool_call_id": "ws_abc123", "status": "success"}
```

### 14. 非标准块
```python
{"type": "non_standard", "value": {...}}
```

### 15. 读取时的类型分发
- 必须按 `block["type"]` 做 if/elif 分支
- 未知 `type` 做降级处理，不抛异常阻塞后续块

## 反例
- ❌ `block["text"]` — 不检查 `block["type"]`，假设所有块都有 `text` 字段
  - ✅ FIX：先 `if block["type"] == "text":` 再读取 `block["text"]`
- ❌ `block["base64"]` — 不检查 `mime_type` 是否存在
  - ✅ FIX：base64 数据必须同时读取 `block.get("mime_type")`
- ❌ 同一个图片块同时传 `url`、`base64`、`file_id`
  - ✅ FIX：三选一
- ❌ 文本文件用 `"type": "file"` 而非 `"type": "text-plain"`
  - ✅ FIX：纯文本文档用 `"text-plain"`
- ❌ 流式模式下把 `tool_call_chunk` 当 `tool_call` 处理
  - ✅ FIX：`tool_call_chunk` 是增量片段，待累积完成后从 `full.tool_calls` 取
- ❌ 服务端工具结果不检查 `status`，假设总是 `"success"`
  - ✅ FIX：检查 `block["status"]`，`"error"` 时做错误处理
- ❌ 对未知 `type` 抛 `ValueError`
  - ✅ FIX：降级处理，不阻塞其余块

## 验收标准
- [ ] 遍历 `content_blocks` 时每个 `type` 都有对应的分支处理
- [ ] 多模态块（image/audio/video/file）的 base64 数据附带 `mime_type`
- [ ] 流式工具调用累积完成后再读取 `tool_calls`，不对 `tool_call_chunk` 做业务处理
- [ ] 未知 `type` 降级处理不抛异常 