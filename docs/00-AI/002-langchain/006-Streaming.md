## 🎯 Streaming 心智模型

**核心本质**：将单次完整的响应拆解为多个时间片段的实时推送。

```
传统模式：等待 → 完整结果
流式模式：开始 → 持续推送 → 结束
```

---

## 📊 三种流式模式

| 模式 | 推送内容 | 推送时机 | 适用场景 |
|-----|---------|---------|---------|
| **`updates`** | 节点执行后的完整状态 | 每个Agent步骤完成时 | 调试、进度追踪、步骤可视化 |
| **`messages`** | LLM生成的单个token | token生成时 | 聊天UI、实时文本显示 |
| **`custom`** | 任意自定义数据 | 主动调用`get_stream_writer()`时 | 进度条、中间结果、状态通知 |

---

## 🔧 核心特性

### 1. 多模式组合
- `stream_mode=["updates", "messages", "custom"]` 同时启用多种模式

### 2. v2统一格式 (LangGraph ≥1.1)
- `chunk["type"]` - 标识模式类型
- `chunk["data"]` - 实际数据载荷
- `chunk["ns"]` - 命名空间

### 3. 子Agent流式标识
- 通过`name`参数标识source
- 元数据中通过`lc_agent_name`区分

### 4. Human-in-the-Loop流式
- `updates`模式可捕获`__interrupt__`节点
- 实时获取人工审批请求

### 5. 禁用流式
- `streaming=False` - 模型级禁用
- `disable_streaming=True` - 基类级禁用

---

## 🎯 场景速查

| 场景 | 推荐模式 | 关键点 |
|-----|---------|-------|
| 聊天界面 | `messages` | 逐字显示AI响应 |
| 任务进度条 | `custom` | 工具内主动推送进度 |
| 多步调试 | `updates` | 观察每个节点状态变化 |
| 文件处理 | `custom` | 推送处理百分比 |
| 多Agent系统 | `messages` + `name` | 区分不同Agent输出 |
| 人工审批 | `updates` | 捕获`__interrupt__`节点 |
| 生产监控 | `updates` + `custom` | 状态追踪+业务指标 |

---

## ⚡ 关键限制

1. **`custom`模式**：只能在LangGraph执行上下文中使用
2. **token累积**：`messages`模式需手动拼接chunks
3. **v2 vs v1**：v2返回`StreamPart`字典，v1返回`(mode, data)`元组


## 场景 1：聊天界面（messages 模式）

**Prompt 提示词**：
```
实现一个聊天界面，使用 stream_mode="messages" 实时显示 AI 响应。
要求：每个 token 到达时立即追加到 UI，而非等待完整响应。
```

**代码特征**：
```python
for chunk in agent.stream(..., stream_mode="messages"):
    token, _ = chunk
    ui.append_text(token.text)
```

---

## 场景 2：长时间任务（custom 模式）

**Prompt 提示词**：
```
实现一个文件处理工具，使用 get_stream_writer() 在处理过程中推送进度百分比
(0%、30%、70%、100%)，前端通过 stream_mode="custom" 接收并更新进度条。
```

**代码特征**：
```python
@tool
def process_file(path: str) -> str:
    writer = get_stream_writer()
    writer({"progress": 30, "status": "解析中"})
    # ... 处理逻辑
    writer({"progress": 100, "status": "完成"})
```

---

## 场景 3：多步调试（updates 模式）

**Prompt 提示词**：
```
实现 Agent 调试输出，使用 stream_mode="updates" 捕获每个节点(model/tools)
执行后的状态变化，记录到调试面板而非直接显示给用户。
```

**代码特征**：
```python
for chunk in agent.stream(..., stream_mode="updates"):
    for node, state in chunk["data"].items():
        debug_panel.log(f"{node}: {state.keys()}")
```

---

## 场景 4：多 Agent 系统（messages + name）

**Prompt 提示词**：
```
实现多 Agent 系统，为每个 Agent 设置不同的 name，在流式输出时通过
metadata["lc_agent_name"] 区分消息来源，分别渲染到不同的 UI 区域。
```

**代码特征**：
```python
agent = create_agent(..., name="weather_agent")
# 流式中判断来源
if metadata.get("lc_agent_name") == "weather_agent":
    weather_ui.append(token.text)
```

---

## 场景 5：人工审批（updates + interrupt）

**Prompt 提示词**：
```
实现需要人工审批的敏感操作，使用 HumanInTheLoopMiddleware 和 checkpointer，
通过 stream_mode="updates" 捕获 __interrupt__ 节点，提取 action_requests
并暂停等待用户决策。
```

**代码特征**：
```python
if chunk["type"] == "updates" and "__interrupt__" in chunk["data"]:
    interrupts = chunk["data"]["__interrupt__"]
    approval_modal.show(interrupts[0].value["action_requests"])
```

---

## 场景 6：混合模式（production 全量）

**Prompt 提示词**：
```
实现生产级 Agent，同时启用 messages(实时文本)、updates(步骤追踪)、custom(进度)
三种模式，前端根据 chunk["type"] 分发到不同组件：消息区、步骤面板、进度条。
```

**代码特征**：
```python
for chunk in agent.stream(..., stream_mode=["messages","updates","custom"], version="v2"):
    if chunk["type"] == "messages": message_ui.update(chunk["data"])
    elif chunk["type"] == "updates": step_panel.add(chunk["data"])
    elif chunk["type"] == "custom": progress_bar.set(chunk["data"])
```


## 🎯 双流分离架构（推荐生产环境）

**Prompt**：
```
实现双 SSE 连接的流式架构：

1. messages 流（独立连接）：
   - stream_mode="messages"，version="v2"
   - 原始 token 透传，不做批次聚合
   - 前端逐字渲染打字机效果

2. control 流（独立连接）：
   - stream_mode=["updates", "custom"]，version="v2"
   - updates：去重 + 差异计算，只推送变更字段
   - custom：原始透传

3. 前端分发：
   - messages → 消息区追加
   - updates → 步骤面板追加（相同步骤合并）
   - custom → 进度条覆盖更新（仅保留最新值）
```

---

## 📦 批次聚合方案（适合高并发）

**Prompt**：
```
实现批次聚合流式中间件：

1. 配置参数：
   - token_batch_size: 10（满10个发送）
   - time_window_ms: 50（超时50ms发送）
   - updates_diff: true（启用差异计算）

2. messages 批次处理：
   - 收集 token chunks 到缓冲区
   - 触发条件：满10个 OR 50ms超时
   - 发送格式：{"type": "messages_batch", "data": [token1, token2...]}

3. updates 差异计算：
   - 缓存上一次完整状态
   - 计算深度差异（仅变更路径+新值）
   - 无变更时不推送

4. custom 透传：
   - 保持原始格式，不批处理
```

---

## 🌐 智能退避方案（适合移动端/弱网）

**Prompt**：
```
实现自适应流式策略：

1. 网络质量检测：
   - 心跳包 RTT < 200ms → good
   - 200-500ms → fair
   - >500ms 或丢包率 >5% → poor

2. 降级策略：
   - good：messages 逐字 + updates 完整 + custom 完整
   - fair：messages 每3字发送 + updates 差异 + custom 每2条合并
   - poor：仅 updates（每5步推送摘要）+ custom 仅最终结果

3. 恢复机制：
   - 连续3次心跳 RTT < 200ms 自动升级
   - 升级缓冲期10秒，防抖动
```

---

## 🔥 终极进化版：双流+批次+自适应混合

**Prompt**：
```
实现完整生产级流式架构：

【双流分离】
- 流A（/stream/tokens）：仅 messages 模式
- 流B（/stream/events）：updates + custom 模式

【批次聚合（仅流A）】
- 批次大小：根据网络质量自适应
  - good: 5 tokens
  - fair: 15 tokens
  - poor: 30 tokens
- 时间窗口：根据 RTT 动态调整（RTT × 0.5）

【差异计算（流B - updates）】
- 第一帧推送完整状态
- 后续仅推送变更路径（JSON Patch RFC 6902 格式）

【降级策略（连接数限制）】
- 客户端只允许单连接时：合并为单流
  - messages 降级为批次 frames
  - updates 降级为每节点状态摘要
  - custom 降级为仅关键节点

【前端分发器】
- 入口 switch(chunk.type)
- messages_batch → 解包并逐字动画
- updates_patch → 合并到状态树
- custom → 进度/通知组件
```