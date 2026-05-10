### 心智模型

**Human-in-the-Loop (HITL)** 模式通过**中断-审批-恢复**的闭环，在自动化和人工控制之间建立了一个安全边界。其核心运作遵循一个单向、可控的流程：当 Agent 执行到需要人工确认的敏感操作时，它会主动暂停并发出中断；前端通过 `useStream` Hook 捕获该中断，并将决策权以 UI 形式（审批卡片）转交给用户；在用户做出决定后，`stream.submit()` 再将明确指令（批准/拒绝/编辑）作为恢复命令发回 Agent，使其从断点继续执行。整个中断状态由后端的 checkpoint 持久化，因此用户在页面刷新后仍能看到待处理的中断。

### 关键实践提示

*   **【中断原理】How interrupts work**：Agent 发出中断后，`useStream` Hook 通过 `stream.interrupt` 属性暴露中断负载。用户操作后，通过 `stream.submit(null, { command: { resume: response } })` 恢复执行。
*   **【决策类型】Decision types**：支持四种决策：`approve`（批准）、`reject`（拒绝，可附带原因）、`edit`（修改执行参数）和 `respond`（直接回复，用于 `ask_user` 类工具）。
*   **【UI 构建】Building the ApprovalCard**：审批卡片应根据 `reviewConfigs[].allowedDecisions` 动态展示操作按钮，并为编辑/拒绝等复杂操作提供子界面。
*   **【恢复流程】The resume flow**：调用 `stream.submit()` 后，Agent 会根据收到的 `HITLResponse` 决策继续执行，同时前端 `interrupt` 属性会重置为 `null`。一个 Agent 运行可串联多个 HITL 检查点。
*   **【状态持久化】Persist the interrupt state**：`useStream` 会自动通过线程的 checkpoint 保持中断状态。即使页面刷新，中断卡片仍会显示，这是保证审批流程不会丢失的关键设计。
*   **【用户体验】Make approve the easiest path**：将“批准”设计为最直接（一键）的操作，为“拒绝”或“编辑”等需要额外输入的操作保留多步骤流程。
*   **【输入验证】Validate edited args**：当用户编辑执行参数时，必须在发送前验证其 JSON 结构的合法性，并以内联方式显示错误。
*   **【审计日志】Log all decisions**：所有审批、拒绝或编辑的决策都应被记录，包含时间戳和操作者信息，以便形成完整的审计追踪。
*   **【超时处理】Set timeouts thoughtfully**：长时间等待人工审查的 Agent 不应无限期阻塞，建议向用户显示 Agent 已等待的时长。
*   **【多个操作】Handling multiple pending actions**：一个中断可能包含多个待审批操作 (`actionRequests`)，前端需支持渲染多个卡片并收集所有决策后一次性提交。
*    

### 最佳实践 / Best Practices

实施人机协同（HITL）工作流程时，请牢记以下指导原则：

1.  **展示清晰的背景 / Show clear context**
    *   始终展示代理想做什么以及为什么。包括动作的描述和完整的参数。
    *   Always display *what* the agent wants to do and *why*. Include the action description and the full arguments.

2.  **让“批准”成为最简单的路径 / Make approve the easiest path**
    *   如果操作看起来正确，批准应该只需一键完成。将为拒绝/编辑保留多步操作流程。
    *   If the action looks correct, approving should be a single click. Reserve multi-step flows for reject/edit.

3.  **验证编辑过的参数 / Validate edited args**
    *   当用户编辑动作参数时，在发送前务必验证其JSON结构。对于格式错误的输入，以内联方式显示错误提示。
    *   When users edit action arguments, validate the JSON structure before sending. Show inline errors for malformed input.

4.  **持久化中断状态 / Persist the interrupt state**
    *   即使用户刷新页面，中断状态也应保持可见。`useStream` 会通过线程的检查点机制自动处理此问题。
    *   If the user refreshes the page, the interrupt should still be visible. `useStream` handles this via the thread's checkpoint.

5.  **记录所有决策 / Log all decisions**
    *   为了形成完整的审计追踪，应记录每一次批准、拒绝或编辑的决策，并附上时间戳和做出决策的用户信息。
    *   For audit trails, log every approve/reject/edit decision with timestamps and the user who made the decision.

6.  **合理安排暂停时间 / Set timeouts thoughtfully**
    *   长时间运行的代理不应无限期地阻塞并等待人工审核。考虑向用户展示代理已等待的时长。
    *   Long-running agents should not block indefinitely on human review. Consider showing how long the agent has been waiting. 