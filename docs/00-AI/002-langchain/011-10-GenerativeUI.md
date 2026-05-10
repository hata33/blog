### 心智模型

**Generative UI** 将 AI 的输出从对话文本提升为**可直接渲染的用户界面**。其核心流程是：开发者预先定义一个**组件目录（Catalog）**，限制 AI 可用的 UI 组件；AI 根据用户提示，生成一个描述界面结构的 JSON **规范（Spec）**；`json-render` 的 `Renderer` 将此 Spec 安全地渲染为真实的 UI 组件树。

### 二级标题及内容

*   **【工作机制】How it works**
    流程分为四步：1. 定义组件目录；2. 用户用自然语言描述需求；3. AI 生成 JSON 规范；4. `Renderer` 安全渲染。组件目录充当护栏，确保 AI 只能使用预定义、类型安全的组件。

*   **【定义目录】Define a component catalog**
    使用 `defineCatalog` 和 `zod` 为每个可用组件定义描述和严格的 `props` 模式。目录应保持精简，只包含当前用例需要的组件。

*   **【构建注册表】Build a component registry**
    使用 `defineRegistry` 将目录中的每个组件映射到其在具体框架（如 React、Vue）中的渲染实现，实现类型安全的绑定。

*   **【连接 Agent】Connect to the agent**
    AI 通过结构化输出的工具调用返回 JSON 规范。前端从 `AIMessage` 的 `tool_calls[0].args` 中提取这个 `rawSpec`。

*   **【渐进式渲染】Stream and render progressively**
    流式传输时，Spec 是逐步构建的。必须过滤掉 `type` 或 `props` 不完整的元素，并将 `loading={true}` 传给 `Renderer`，以在子元素尚未到达时静默跳过，实现 UI 的渐进式构建。

*   **【规范格式】The spec format**
    AI 生成的 JSON 规范是一个扁平结构，包含指向根元素的 `root` 键和一个包含所有组件定义的 `elements` 映射表，每个元素通过 ID 引用其子元素。

### 最佳实践

*   **使用描述性的组件描述**：AI 依赖描述来理解何时使用组件，清晰的描述能提升生成界面的质量。
*   **渲染前必须校验**：由于流式传输会传递部分数据，务必检查元素是否具有有效的 `type` 和非空 `props`。
*   **为流式设计**：在流式传输期间传递 `loading={true}`，确保 Renderer 能优雅处理尚未到达的子元素。
*   **使用设计令牌（Design Tokens）样式**：利用 CSS 自定义属性，使渲染的组件能自动适应明暗主题。
*   **用 JSONUIProvider 包裹**：`Renderer` 必须置于 `JSONUIProvider` 内部，才能访问其内部的状态和动作上下文。