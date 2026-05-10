如果工具/中间件的逻辑完全不依赖外部变化的信息（比如就是调个固定 API），就不需要 Runtime。

只要需要认人、记信息、拿请求相关的元数据，就用 Runtime。

### 心智模型

**运行时 / Runtime** 是一个贯穿 Agent 整个生命周期的**依赖注入容器**。通过 `context_schema` 定义结构，在调用时传入具体实例，使工具（Tools）和中间件（Middleware）能无痛访问用户信息、数据库连接等上下文，以及执行和服务器元数据。这避免了硬编码和全局状态，使代码更易于测试和复用。

### 二级标题及内容

*   **【访问】Access**
    通过 `create_agent` 的 `context_schema` 参数定义上下文结构，然后在 `agent.invoke` 时通过 `context` 参数传入具体实例。

*   **【工具内】Inside tools**
    工具通过在函数签名中声明 `runtime: ToolRuntime[Context]` 类型的参数来获得运行时访问能力，可从中读取上下文、操作长期记忆（`runtime.store`）或写入自定义流。

*   **【工具内：执行与服务器信息】Execution info and server info inside tools**
    工具可通过 `runtime.execution_info`（包含线程/运行ID）和 `runtime.server_info`（在 LangGraph Server 上运行时包含助手/用户标识）获取执行和服务器元数据。在本地开发时 `server_info` 为 `None`。

*   **【中间件内】Inside middleware**
    中间件钩子函数（如 `before_model`, `after_model`）通过声明 `runtime: Runtime` 参数来访问运行时上下文，可据此修改系统提示、记录日志或实施基于用户的控制。

*   **【中间件内：执行与服务器信息】Execution info and server info inside middleware**
    中间件同样可访问 `runtime.execution_info` 和 `runtime.server_info`，例如用于身份验证检查：若在服务器上且无用户身份，则拒绝请求。

### 最佳实践

*   **利用依赖注入**：使用 `Runtime` 而非硬编码值或全局变量，能显著提升工具和中间件的可测试性与可复用性。
*   **注意版本要求**：使用 `runtime.execution_info` 和 `runtime.server_info` 需确保 `deepagents>=0.5.0` 或 `langgraph>=1.1.5`。