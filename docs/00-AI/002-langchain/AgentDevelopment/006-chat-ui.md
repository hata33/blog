### 心智模型

**Agent Chat UI** 是一个开箱即用的 Next.js 聊天界面，通过 `useStream` 与任何 LangGraph Agent 服务（本地或部署）进行对话交互。它提供了完整的参考实现，内置了实时对话、工具调用可视化以及渐进式 UI 渲染等功能，开发者既可以作为快速测试工具，也可以作为自定义 Agent 界面的起点。

### 二级标题及内容

*   **【快速开始】Quick start**
    提供两种使用方式：可直接访问在线托管版，输入 Agent 地址后直接使用；也可本地开发，通过 `npx create-agent-chat-app` 或克隆仓库后启动。
*   **【连接 Agent】Connect to your agent**
    需要填写 **Graph ID**（`langgraph.json` 中配置）、**Deployment URL**（本地或部署服务地址）和可选的 **LangSmith API Key**。配置完成后界面会自动获取中断的线程。
*   **【隐藏消息】Hiding Messages in the Chat** (来自 GitHub)
    提供两种隐藏消息的方式：通过模型配置的 `langsmith:nostream` 标签阻止实时流式渲染，或通过给消息 ID 添加 `do-not-render-` 前缀实现完全隐藏。

### 最佳实践

*   **快速验证与测试**：利用在线版或一键本地启动，可以零代码为 Agent 创建一个功能完整的聊天界面，快速验证 Agent 逻辑和交互流程。
*   **生产环境部署**：需要生产化时，可通过 API 代理（直通）或自定义认证将 Agent Chat UI 部署到生产环境，并添加认证层保护后端服务。
*   **按需隐藏内部消息**：利用 `do-not-render-` 前缀和 `langsmith:nostream` 标签隐藏内部消息，确保最终用户只看到必要的输出，保持界面整洁。