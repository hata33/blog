### 心智模型

交接（Handoffs）模式通过工具调用**动态更新持久化的状态变量**（如 `current_step` 或 `active_agent`），系统根据此变量**自动调整行为**——切换系统提示、工具集或将执行路由到不同的 Agent 节点。核心流程：工具返回 `Command` 更新状态 → 中间件或路由逻辑读取状态 → 应用新配置。

### 二级标题及内容

*   **【关键特征】Key characteristics**
    状态驱动行为、基于工具的转换、直接用户交互、状态跨回合持久化。

*   **【使用时机】When to use**
    需要强制顺序约束、Agent 需在不同状态下与用户直接对话、构建多阶段对话流时使用。典型场景：客服支持，需按特定顺序收集信息（如先验证保修状态再处理退款）。

*   **【基础实现】Basic implementation**
    核心是工具返回 `Command` 更新状态变量以触发转换。**注意**：必须包含匹配 `tool_call_id` 的 `ToolMessage`，否则会话历史会畸形。

*   **【实现方式】Implementation approaches**
    *   **单 Agent + 中间件**：一个 Agent 通过中间件根据状态动态调整提示和工具。工具返回 `Command` 更新 `current_step`，中间件读取后应用新配置。适用于大多数情况，更简单。
    *   **多 Agent 子图**：多个独立 Agent 作为图中不同节点。交接工具通过 `Command(goto="agent_name", graph=Command.PARENT)` 导航到指定节点。需要显式管理节点间传递的消息。

*   **【上下文工程】Context engineering**（子图交接）
    关键原则：交接时必须包含**触发交接的 `AIMessage`** 和**确认交接的 `ToolMessage`**，否则接收 Agent 会看到不完整的对话。建议只传递这两条消息而非完整子 Agent 历史，以避免上下文臃肿和不必要的 Token 消耗。若接收 Agent 需更多上下文，应在 `ToolMessage` 内容中提供摘要。

### 最佳实践

*   **优先用单 Agent + 中间件**：实现更简单，消息历史自然流动。仅在需要复杂自定义 Agent 节点时才用多 Agent 子图。
*   **交接工具必须返回 ToolMessage**：LLM 调用工具后必须收到响应，缺少会破坏对话结构。
*   **交接时只传必要消息**：仅传递触发交接的消息对（AIMessage + ToolMessage），而非完整子对话历史，以保持上下文整洁、节省 Token。
*   **多 Agent 子图需正确结束**：当 Agent 准备将控制权交还用户时，最终消息应为不含工具调用的 `AIMessage`，以正常结束回合。