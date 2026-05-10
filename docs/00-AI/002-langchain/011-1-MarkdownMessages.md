### 心智模型

**流式 Markdown 渲染**遵循一个简单的三步管线：
1.  **接收**：`useStream` Hook 将后端 Agent 实时输出的 Token 累积为响应式的 `msg.text` 字符串。
2.  **解析**：前端 Markdown 库在每次文本更新时，将原始文本即时转换为 HTML 或 React 元素树。对于常规聊天内容，此过程极快（< 5ms）。
3.  **渲染**：框架将解析后的结果更新到 DOM 中，实现打字机效果的格式化内容呈现。

### 关键实践提示

*   **【安全】务必消毒**：在 Vue (`v-html`)、Svelte (`{@html}`) 或 Angular (`[innerHTML]`) 中，**必须**使用 `dompurify` 对解析后的 HTML 进行消毒，防止来自 LLM 的恶意脚本注入。React 使用 `react-markdown` 直接生成元素，因此无需此步骤。
*   **【选型】框架匹配**：
    *   **React**：使用 `react-markdown` + `remark-gfm`，它直接生成 React 元素，无需处理原始 HTML，更安全。
    *   **其他框架** (Vue/Svelte/Angular)：推荐轻量快速的 `marked` 库，但输出为原始 HTML 字符串，**必须搭配 `dompurify`**。
*   **【配置】启用标准**：启用 `GFM` (GitHub 风格 Markdown) 和 `breaks: true`（将单换行转为 `<br>`），因为 LLM 经常使用这些语法。
*   **【性能考量】**：对于超长回复（> 50 KB），简单的全文重解析可能导致卡顿。优化手段包括用 `requestAnimationFrame` 节流渲染，或进行增量解析。**详见原文 `Streaming Considerations` 小节**。
*   **【样式】紧凑布局**：为 `.markdown-content` 下的元素（如段落、列表、代码块）应用紧凑的边距和内边距，使其适合聊天气泡，而非全宽文档。

### 总结自检

*   **性能相关**：已提及全文重解析的性能特点及优化方向，并指引到原文的 `Streaming Considerations` 小节。
*   **安全相关**：已将使用 `dompurify` 消毒列为必须遵循的安全实践，并指出了 React 与其他框架的例外情况。
*   **技术细节**：已涵盖 Markdown 库的选择逻辑（React 的组件方案 vs. 其他框架的原始 HTML 方案）、推荐的 GFM 配置以及流式特性如何处理。

## ✨ Vibe Coding 实现提示词

你可以把下面这些“清晰指令”发给 Cursor、Copilot 等 AI 编程工具。

### 1. 创建基础 Markdown 组件

**React (最安全，推荐)**
```
创建一个名为 Markdown 的 React 组件。使用 react-markdown 和 remark-gfm 插件，接收 children 作为字符串输入。为它添加 className="markdown-content" 的外层 div。不要使用 dangerouslySetInnerHTML。
```

**Vue / Svelte / Angular (需清洗)**
```
创建一个 Markdown 组件，使用 marked 和 dompurify。开启 marked 的 gfm 和 breaks 选项。将输入的文本用 marked.parse 转成 HTML，然后**必须**用 DOMPurify.sanitize 清洗，最后用 v-html / {@html} / [innerHTML] 渲染。包裹在 class="markdown-content" 的 div 中。
```

### 2. 集成到聊天流

```
在我的 Chat 组件中，用 useStream 钩子获取消息列表。遍历消息，如果是 AIMessage.isInstance，就把它渲染到 Markdown 组件里展示，传入 msg.text。如果是 HumanMessage，就用普通 p 标签展示。
```

### 3. 注入紧凑的聊天样式

```
给我写一段 CSS，为 class="markdown-content" 下的元素设置样式。要求非常紧凑，适合聊天气泡：
- p, ul, ol 上下边距设为 0.3em
- pre 背景色用浅灰 (0.05透明度)，加圆角和内边距，字体小号
- 内联 code 背景稍深一点，圆角，小号字体
- blockquote 左框线，加透明度
- 表格边框细线，单元格紧凑内边距
```

你可以直接复制这些提示词开始 Vibe Coding。