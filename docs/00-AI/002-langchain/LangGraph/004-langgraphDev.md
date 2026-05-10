### 心智模型

本地服务器通过 `langgraph dev` 命令启动一个在内存模式下运行的 Agent Server，为 LangGraph 应用提供本地开发与测试环境。它暴露 API 端点供客户端调用，并可通过 Studio 进行可视化调试。

### 二级标题及内容

*   **【步骤】**
    1.  **安装 CLI**：`pip install -U "langgraph-cli[inmem]"`（需 Python >= 3.11）。
    2.  **创建应用**：`langgraph new` 从模板创建项目。
    3.  **安装依赖**：在项目根目录用 `pip install -e .` 或 `uv sync` 安装。
    4.  **配置 `.env`**：设置 `LANGSMITH_API_KEY`。
    5.  **启动服务**：`langgraph dev`，启动后 API 在 `http://127.0.0.1:2024`，Studio 可通过对应 URL 访问。
    6.  **在 Studio 中测试**：访问 Studio URL 进行可视化、交互与调试。Safari 用户需加 `--tunnel`。
    7.  **测试 API**：通过 Python SDK（同步/异步）或 REST API 发送请求。

### 最佳实践

*   **内存模式仅用于开发测试**：生产环境应使用持久化存储后端的部署方案。
*   **确保 Python 版本**：需 Python >= 3.11。
*   **正确配置 API Key**：`.env` 文件中的 `LANGSMITH_API_KEY` 是连接服务的前提。
*   **利用 Studio 调试**：启动后直接访问 Studio 进行可视化开发和问题排查。