### 心智模型

**消息队列 / Message queues** 模式将用户与 Agent 的交互从“同步等待”转变为“异步排队”。用户可以连续发送多条消息，无需等待回复即可提交下一条。所有消息在服务端排队，`useStream` Hook 通过 `queue` 属性暴露待处理队列，Agent 按序逐一处理，用户可随时查看、取消队列中的项。

### 二级标题及内容

*   **【用途】Why message queues?**
    解决“必须等 Agent 回复完才能发下一条”的痛点，适用于用户想批量提问、在处理中补充说明、自动化测试或连续数据录入等场景。

*   **【工作机制】How it works**
    后端使用 `multitaskStrategy: "enqueue"` 管理并发提交。若 Agent 忙时收到新消息，会被加入服务端队列。当前任务完成后，自动取下一项处理。前端通过 `useStream` 的 `queue` 对象（包含 `entries`、`size`、`cancel(id)`、`clear()` 等）实时反映队列状态。

*   **【设置】Setting up `useStream`**
    常规配置 `useStream` 即可。`stream.submit()` 用于提交消息，`stream.queue` 用于访问队列状态。所有前端框架（React/Vue/Svelte/Angular）的使用方式类似。

*   **【展示】Displaying the queue**
    构建 `QueueList` 组件，展示每条待处理消息的预览、创建时间及取消按钮，让用户对队列中等待的内容有清晰认知。

*   **【取消】Cancelling queued messages**
    支持两级取消：`queue.cancel(id)` 取消单条；`queue.clear()` 一键清空整个队列。**注意**：只能取消尚未开始处理的消息，正在处理中的任务无效。

*   **【链式提交】Chaining follow-up submissions with `onCreated`**
    利用 `stream.submit` 的 `onCreated` 回调，可在一次提交被接受后，立即程序化地提交后续消息，实现多步骤工作流的自动排队。

*   **【新线程】Starting a new thread**
    调用 `stream.switchThread(null)` 可开启全新会话，同时清空当前消息历史与队列。

*   **【完整示例】Complete example**
    融合上述所有功能的 `QueueChat` 组件代码示例，演示了一个完整的、带队列管理的聊天界面。

### 最佳实践

*   **限制队列大小**：虽无硬限制，但过长的队列影响体验，建议在超过合理阈值（如 10 项）时给出提示。
*   **显示队列位置**：为队列中的项编号，让用户清楚处理顺序。
*   **保持输入焦点**：提交后让输入框立即恢复焦点，便于连续输入。
*   **动画过渡**：当队列项开始处理时，使用平滑动画将其从队列面板移入消息列表。
*   **优雅处理错误**：若队列中某条消息失败，应展示错误但不阻塞后续消息的处理。
*   **防抖快速提交**：对于程序化或自动化提交，建议在消息间添加微小延迟，以免压垮服务端。