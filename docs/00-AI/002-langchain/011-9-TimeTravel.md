### 心智模型

**时间旅行 / Time travel** 模式将 Agent 的每一次状态变更都记录为一个**检查点（Checkpoint）**，形成一个完整的时间线。用户可以浏览、审查任何历史检查点的完整状态，并有权选择**从任意一点恢复执行**，从而探索不同的对话路径。它集调试器、撤销按钮和审计日志于一身。

### 二级标题及内容

*   **【工作机制】How checkpoints work**
    LangGraph 每次节点执行后都会持久化一个 `ThreadState`，其中包含：检查点元数据（ID、时间戳）、完整的代理状态（`values`）、计划执行的任务（`tasks`）和后续节点（`next`）。这构成了一条线性时间线，供 UI 渲染并让用户跳转。

*   **【设置】Setting up useStream**
    通过向 `useStream` 传入 `fetchStateHistory: true` 来加载完整的检查点历史。随后可通过 `stream.history` 数组访问所有时间线数据。

*   **【数据结构】The ThreadState object**
    历史数组中的每个 `ThreadState` 条目代表一个检查点，关键属性包括：`checkpoint`（用于恢复执行的标识符）、`values`（当时的消息和状态）、`tasks`（运行的任务及中断）和 `next`（计划执行的下一个节点）。

*   **【构建时间线】Building a checkpoint timeline**
    构建一个 `TimelineSidebar` 组件，将历史记录渲染为可点击的列表，每个条目显示节点名称、消息数量等，让用户能直观浏览和选择。

*   **【检查状态】Inspecting checkpoint state**
    提供一个检查点审查器（`CheckpointInspector`），当用户点击时间线中的某条记录时，能以 JSON 格式显示当时 Agent 的全部状态，方便开发者调试。

*   **【核心操作：恢复执行】Resuming from a checkpoint**
    时间旅行的核心动作：调用 `stream.submit(null, { checkpoint: selectedCheckpoint.checkpoint })`。这会指示后端回滚到指定状态并重新执行，从而创建一条新的对话分支。这不会删除原有时间线。

*   **【布局】The SplitView layout**
    推荐采用分屏布局（`SplitView`）：左侧为主聊天区，右侧为可浏览和检查的时间线侧边栏。

*   **【元数据提取】Extracting checkpoint metadata**
    建议将原始检查点数据转换为更易于 UI 展示的格式，例如提取任务名、消息数、是否有中断等信息，使时间线条目更具可读性。

*   **【用途】Use cases**
    适用于调试 Agent 行为、撤销错误操作、探索不同对话分支、合规审计以及教学演示。

*   **【中断处理】Handling interrupts in the timeline**
    对于包含人机协同中断的检查点，应在时间线 UI 中进行高亮或特殊标记（如使用琥珀色背景），提示用户此处曾暂停等待输入。

### 最佳实践

*   **懒加载历史**：对于有成百上千个检查点的长线程，应分页或仅加载最近 N 条记录，以保持 UI 响应速度。
*   **显示有意义的标签**：在时间线中展示节点名称和消息计数，而不是原始 UUID，为用户提供上下文。
*   **恢复前需确认**：从旧检查点恢复会**替换**当前执行路径，务必弹出确认对话框，防止用户意外丢失当前会话状态。
*   **高亮当前检查点**：在视觉上明确标识哪个检查点对应着当前对话状态。
*   **支持键盘导航**：为时间线添加键盘事件（如上下箭头键），方便高级用户快速浏览检查点。
*   **对比状态差异**：对于高级用户，可以展示两个连续检查点之间的状态变化，揭示 Agent 状态的具体演变过程。