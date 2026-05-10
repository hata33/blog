### 心智模型

**加入与重新加入流 / Join & rejoin streams** 模式解耦了客户端与 Agent 的连接，允许客户端在 Agent **持续运行于服务端**的前提下，随时断开并稍后重新连接，恢复到断开时的状态继续接收流式输出。其核心是将“连接”视为临时状态，而非任务生命周期的一部分。

### 二级标题及内容

*   **【用途】Why join & rejoin?**
    解决传统流式 API 中“客户端断连即丢失流”的问题。适用于网络切换（如移动端在 Wi-Fi 和蜂窝网络间切换）、页面导航后返回、App 退到后台、长时间运行的任务（无需保持页面打开）以及多设备接力等场景。

*   **【核心概念】Core concepts**
    涉及四个关键机制：
    *   `stream.stop()`: 仅断开客户端连接，**不停止**服务端 Agent 的执行。
    *   `stream.joinStream(runId)`: 通过保存的 `runId` 重新连接到正在运行或已完成的流。
    *   `onDisconnect: "continue"`: 提交时的选项，告知服务器在客户端断开后**继续**运行 Agent（默认是取消）。
    *   `streamResumable: true`: 提交时的选项，启用流的可恢复特性，允许稍后重新加入。

*   **【设置】Setting up `useStream`**
    关键是在 `useStream` 的 `onCreated` 回调中捕获 `run.run_id` 并保存，以便后续重新加入时使用。

*   **【提交】Submitting with resumable options**
    提交消息时，必须同时传入 `{ onDisconnect: "continue", streamResumable: true }` 这两个选项，才能实现“断连后 Agent 继续运行”并“允许稍后重新加入流”。**注意**：若只设 `continue` 而不设 `streamResumable`，Agent 虽继续运行，但客户端无法再重连。

*   **【断开】Disconnecting from a stream**
    调用 `stream.stop()` 后，`stream.isLoading` 置为 `false`，消息列表保留已接收部分，Agent 在服务端继续运行，直至重连前不再推送新消息。

*   **【重新加入】Rejoining a stream**
    使用保存的 `runId` 调用 `stream.joinStream(savedRunId)` 即可重连。重连后，`isLoading` 恢复为 `true`，将立即接收到断连期间产生的所有消息，并与当前实时输出同步。若 Agent 已完成，则直接收到最终状态。

*   **【连接状态】Building a connection status indicator**
    建议构建一个可视化指示器（如绿/红状态点），通过监听 `stream.isLoading` 让用户明确知晓当前是“已连接”还是“已断开”。

*   **【控制组件】Disconnect and rejoin controls**
    提供显式的“断开”和“重新加入”按钮，让用户能完全手动控制连接状态。

*   **【持久化】Persisting the run ID**
    为实现跨会话重连（如关闭浏览器后回来），应将 `runId` 持久化到 `localStorage`。页面加载时检查是否存在有效 ID，有则自动 `joinStream`。**注意**：当运行完成后必须清除持久化的 ID，避免无效重连。

*   **【错误处理】Error handling**
    重连可能因运行过期、被删除或服务重启而失败，应使用 `try/catch` 捕获错误，并清理过时的 `runId`。

*   **【完整示例】Complete example**
    整合了连接状态显示、消息列表、输入框、带重连选项的发送按钮以及断开/重连控件的完整 `JoinRejoinChat` 组件代码。

### 最佳实践

*   **始终保存 run ID**：这是重连的唯一凭证，建议同时保存在组件状态和 `localStorage` 中以增强健壮性。
*   **显示清晰的连接状态**：用户必须能随时分辨当前是正在接收实时更新，还是只看到了一个快照。
*   **利用页面可见性 API 自动重连**：可以监听 `visibilitychange` 事件，在用户返回标签页时自动尝试 `joinStream`。
*   **设置合理的超时**：如果重连尝试耗时过长，应回退到获取线程历史记录，而不是无限等待。
*   **清理已完成的运行**：Agent 运行结束后，应立即从 `localStorage` 等存储中清除对应的 `runId`，避免无用的重连尝试。