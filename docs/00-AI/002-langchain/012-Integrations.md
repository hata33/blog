### 心智模型

**集成概述 / Overview** 的核心思想是：`useStream` 是 UI 无关的，它只提供纯粹的响应式状态。各种 UI 库可以围绕这个统一的数据源，以各自不同的哲学和方式构建聊天界面和生成式 UI。

### 二级标题及内容

*   **【集成】Integrations**
    介绍了四种与 LangChain 前端集成的库：
    *   **CopilotKit**：全功能 AI 聊天运行时，支持结构化的生成式 UI。通过在 LangGraph 部署中添加自定义端点，可在 React 中渲染动态组件树。
    *   **AI Elements**：基于 `shadcn/ui` 的可组合组件。提供 `Conversation`、`Message`、`Tool`、`Reasoning` 等可直接与 `stream.messages` 连接的组件。
    *   **assistant-ui**：无头（Headless）React 框架，带有完整的运行时层。通过 `useExternalStoreRuntime` 适配器将 `useStream` 连接到其 `AssistantRuntimeProvider`。
    *   **OpenUI**：生成式 UI 库，让 Agent 用声明式组件 DSL 生成完整的、交互式仪表盘，专为数据丰富的报告型 UI 设计。

*   **【库的选择】Choosing a library**
    通过对比表格，从**适用场景**、**UI 风格**、**定制化程度**、**流式体验**、**工具调用**和**Agent 格式**等维度，帮助在不同库之间做出选择。

### 最佳实践

*   CopilotKit 尤其适用于需要更丰富的运行时层，并能与 LangGraph 部署并行使用的场景。
*   除 CopilotKit 外，其他三个库都直接连接到 `useStream`。
*   

文档推荐的集成方式是 “前端 UI 库 ↔ useStream ↔ LangGraph Platform (后端)”。既然你不能使用 useStream，就需要绕过这个官方推荐的连接管道，将你的自定义 SSE 后端与这些 UI 库对接。

你提到需要“前后端约定的形式来渲染”，这个理解完全正确。对于这些库，你需要做的是：让后端输出库能“听懂”的数据格式，或者在前端创建一个“翻译层”。

AI Elements (最推荐尝试)

设计定位：它本质是一套无状态的、声明式的 UI 组件，直接消费 stream.messages 数组。

集成可行性：非常高。

做法：你完全放弃 useStream，自己写一个 useCustomSSE Hook 来获取数据，形成 messages 和 toolCalls 状态。然后直接将这个状态传给 AI Elements 的 `<MessageList>`、`<Tool>`等组件。

结论：完全可用。它不强制要求后端是 LangGraph Platform。