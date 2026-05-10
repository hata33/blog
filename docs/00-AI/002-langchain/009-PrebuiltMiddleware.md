中间件数量控制在 10个以内，复杂逻辑走工具或子代理，中间件只做轻量级拦截。
一次 LLM 调用会触发所有已注册中间件按顺序执行。
从功能执行角度看，Middleware 就像是"不需要 LLM 决定、固定会执行、且 LLM 完全感知不到的特殊 Tools"。
Middleware 可以在 LLM 看不见的地方，任意修改 State、动态改写提示词、甚至限制可用工具——这是它比 Tools 更强大的地方。
Middleware 的本质是"在 LLM 和外部世界之间插入控制逻辑"。只要你能想到"在模型调用前后需要做什么"，就能用 Middleware 实现。
场景： 

1. **缓存**：相同请求直接返回缓存结果，跳过 LLM 调用
2. **A/B 测试**：不同用户使用不同提示词或模型版本
3. **请求追踪**：为每次执行生成 trace_id，记录完整链路日志
4. **预算控制**：执行前估算 token 成本，超预算则拒绝
5. **内容审核**：输入/输出双向过滤敏感词，拦截违规内容
6. **多模态预处理**：用户上传图片时自动转文字描述
7. **会话注入**：从 CRM/数据库拉取用户信息，注入上下文
8. **响应后处理**：将长响应自动简化为短句或摘要
9. **限流排队**：按用户 ID 限制每分钟请求次数
10. **功能开关**：按用户灰度启用新能力或推理链
11. 

## 🎯 Prebuilt Middleware 心智模型

**核心本质**：Agent 执行流程的预置拦截器，解决横切关注点。

---

## 📊 分类矩阵

| 类别 | 中间件 | 核心职责 | 触发时机 |
|-----|--------|---------|---------|
| **上下文管理** | Summarization | 超长对话自动摘要 | token超限时 |
| | ContextEditing | 清理旧工具输出 | token超限时 |
| | FilesystemMiddleware | 文件系统读写 | 工具调用时 |
| **流程控制** | HumanInTheLoop | 人工审批工具 | 工具执行前 |
| | Subagent | 子代理委派 | 任务分发时 |
| **可靠性** | ModelRetry | 模型调用重试 | 调用失败时 |
| | ToolRetry | 工具调用重试 | 调用失败时 |
| | ModelFallback | 主模型降级 | 主模型失败时 |
| **安全合规** | PIIMiddleware | PII检测脱敏 | 输入/输出时 |
| | ShellToolMiddleware | 沙箱命令执行 | 命令执行前 |
| **性能成本** | ModelCallLimit | 限制模型调用次数 | 调用计数时 |
| | ToolCallLimit | 限制工具调用次数 | 调用计数时 |
| | LLMToolSelector | 动态筛选工具 | 模型调用前 |
| **测试模拟** | LLMToolEmulator | LLM模拟工具响应 | 工具调用时 |
| **任务规划** | TodoListMiddleware | 任务列表管理 | 整个会话 |
| **文件操作** | FileSearch | 文件搜索(glob/grep) | 搜索时 |

---

## 🔧 关键特性速查

| 中间件 | 特殊要求 | 退出行为 | 重试策略 |
|-------|---------|---------|---------|
| Summarization | 需要模型profile | - | - |
| HITL | **必须配置checkpointer** | - | - |
| ModelCallLimit | 可选checkpointer | end / error | - |
| ToolCallLimit | 可选checkpointer | continue / error / end | - |
| ModelRetry | - | continue / error | 指数退避 |
| ToolRetry | - | return_message / raise | 指数退避 |
| ModelFallback | - | - | 顺序降级 |
| PIIMiddleware | - | block / redact / mask / hash | - |
| LLMToolSelector | - | - | - |
| ShellTool | 需要执行策略 | - | - |
| Subagent | 需要定义子代理 | - | - |

---

## 🎯 场景速查

| 场景 | 推荐中间件组合 |
|-----|---------------|
| 长对话聊天 | Summarization + ModelCallLimit |
| 敏感操作 | HITL + PIIMiddleware |
| 生产高可用 | ModelFallback + ModelRetry + ToolRetry |
| 多工具Agent | LLMToolSelector + ToolCallLimit |
| 复杂任务分解 | Subagent + TodoListMiddleware |
| 代码执行 | ShellToolMiddleware + FilesystemMiddleware |
| 测试环境 | LLMToolEmulator |
| 大型代码库 | FileSearch + FilesystemMiddleware |


## 🎯 生产级 Middleware Vibecoding 提示词

### 通用模板

```
实现 [功能] 中间件，使用 [具体中间件名称]，配置：

【可靠性】
- max_retries=3, backoff_factor=2.0（如适用）
- 异常时降级策略：exit_behavior="continue" / on_failure="continue"

【安全边界】
- 配额限制：thread_limit + run_limit 两者至少配置一个
- PII 检测：apply_to_input=True, strategy="redact"

【可观测】
- 关键操作打印结构化日志（包含耗时、输入摘要）
- 通过 runtime.context 透传 request_id

【依赖检查】
- HITL 必须有 checkpointer
- Summarization 必须有模型 profile（max_input_tokens）
- ShellTool 必须有执行策略（Host/Docker/Codex）

【验收】
- 单元测试覆盖异常路径
- 并发场景无竞态条件
- 配置参数支持环境变量覆盖
```

---

### 场景专项提示词

**长对话管理**：
```
实现 SummarizationMiddleware：trigger=("tokens", 4000) 或 ("fraction", 0.8)，
keep=("messages", 20)，使用 gpt-4o-mini 做摘要，配置 token_counter 自定义计数。
```

**人工审批**：
```
实现 HumanInTheLoopMiddleware：interrupt_on={"敏感工具": {"allowed_decisions": ["approve","reject"]}}，
配合 PostgresSaver checkpointer，thread_id 隔离不同会话。
```

**高可用降级**：
```
实现 ModelFallbackMiddleware + ModelRetryMiddleware 组合：
主模型失败→重试3次→降级到备用模型(Claude/Gemini)，
重试捕获 (RateLimitError, APIConnectionError)，on_failure="continue"。
```

**成本控制**：
```
实现 ModelCallLimitMiddleware：thread_limit=50, run_limit=10,
exit_behavior="end"，配合 checkpointer 跨会话计数。
```

**安全合规**：
```
实现 PIIMiddleware：检测 email + credit_card + 自定义 api_key，
strategy="redact" 用于输入，"mask" 用于输出，自定义 detector 函数。
```

**上下文压缩**：
```
实现 ContextEditingMiddleware：ClearToolUsesEdit(trigger=20000, keep=5)，
清除旧工具输出但保留参数，placeholder="[已清理]"。
```


## 🎯 Prebuilt Middleware 场景速查

### 按问题分类

| 问题 | 中间件 | 一句话配置 |
|-----|--------|-----------|
| **对话太长** | Summarization | `trigger=("tokens",4000), keep=20` |
| **工具输出太多** | ContextEditing | `ClearToolUsesEdit(trigger=20000, keep=5)` |
| **需要人工审批** | HumanInTheLoop | `interrupt_on={"send_email": {...}}` |
| **模型总失败** | ModelFallback + ModelRetry | 主模型→重试→降级备用模型 |
| **工具总失败** | ToolRetry | `max_retries=3, backoff_factor=2.0` |
| **成本失控** | ModelCallLimit + ToolCallLimit | `thread_limit=50, run_limit=10` |
| **敏感数据泄露** | PIIMiddleware | `strategy="redact", apply_to_input=True` |
| **工具太多(10+)** | LLMToolSelector | `max_tools=3, always_include=["search"]` |
| **复杂任务规划** | TodoListMiddleware | 默认配置即可 |
| **需要执行命令** | ShellToolMiddleware | `execution_policy=DockerExecutionPolicy()` |
| **需要读写文件** | FilesystemMiddleware | `backend=CompositeBackend(...)` |
| **需要搜索代码** | FileSearch | `root_path="/workspace", use_ripgrep=True` |
| **测试/开发** | LLMToolEmulator | `tools=["expensive_api"]` |
| **任务委派** | Subagent | 定义子代理名称+工具+提示词 |

---

### 组合模式

| 场景 | 组合 |
|-----|------|
| **生产级聊天** | Summarization + ModelCallLimit + PIIMiddleware |
| **高可用API** | ModelFallback + ModelRetry + ToolRetry |
| **敏感操作** | HumanInTheLoop + PIIMiddleware + ModelCallLimit |
| **代码Agent** | ShellTool + FilesystemMiddleware + FileSearch + TodoList |
| **多工具Agent** | LLMToolSelector + ToolCallLimit |
| **长任务** | Summarization + ContextEditing + TodoList |

---

### 依赖提醒

| 中间件 | 必需依赖 |
|-------|---------|
| HumanInTheLoop | `checkpointer` (PostgresSaver/InMemorySaver) |
| ModelCallLimit (thread_limit) | `checkpointer` |
| ToolCallLimit (thread_limit) | `checkpointer` |
| Summarization (fraction模式) | 模型 `profile.max_input_tokens` |
| ShellTool (DockerExecutionPolicy) | Docker daemon |