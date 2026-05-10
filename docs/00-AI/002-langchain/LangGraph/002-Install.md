### 心智模型

安装 LangGraph 是搭建有状态 Agent 的第一步。核心包 `langgraph` 提供了底层编排框架，而为了访问模型和定义工具，通常还会安装 `langchain` 以及对应模型提供商的包。这三层共同构成了一个完整的开发环境。

### 核心组件

*   **基础层：`langgraph`**。提供了构建、管理、部署长时间运行、有状态 Agent 的运行时和编排能力。
*   **集成层：`langchain`**。这是一个可选但推荐的框架，用于集成各种模型、定义和调用工具，为 LangGraph 提供组件支持。
*   **提供层：Provider packages**。与特定 LLM 提供商（如 OpenAI, Anthropic）交互需要单独安装其 SDK。

### 最佳实践

*   **顺序安装**：建议按 `langgraph` → `langchain` → provider package 的顺序进行安装，以确保依赖关系清晰。
*   **检查 Python 版本**：确保 Python 版本在 3.10 或以上，因为对 `langchain` 有硬性要求。
*   **按需安装**：`langchain` 并非必须，如果你有自己的模型交互和工具定义方式，可以只安装 `langgraph`。但对于初学者或标准开发，安装全套是最高效的选择。