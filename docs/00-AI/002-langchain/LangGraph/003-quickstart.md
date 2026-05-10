### 心智模型

这个快速入门展示了用 LangGraph 构建一个最简 Agent 的两种方式，其核心思想都是将一个大任务分解为**可编排的最小单元**。这两种方式在逻辑上是一致的，都是实现“思考（模型）→ 行动（工具）→ 观察（结果）→ 再思考”的循环。

*   **Graph API**：像一个**流程图**。你需要显式地定义每个步骤（节点）和它们之间的连线（边）。这让你对 Agent 的执行逻辑有精细的控制。
*   **Functional API**：像一个**函数**。你在一个主函数里用标准的 `while` 循环和 `if` 条件判断来编写业务逻辑。这种方式更接近传统的编程思维，代码更紧凑。

### 二级标题及内容

*   **【两种方式对比】Use the Graph API / Use the Functional API**
    *   **Graph API** 适合需要可视化、精细控制执行流程的复杂场景。
    *   **Functional API** 适合用标准代码逻辑快速实现、更易读的简单或中等复杂度场景。

*   **【Graph API 构建步骤】Use the Graph API**
    1.  **定义工具和模型**：初始化模型（如 Claude），定义具体功能（加、乘、除），并绑定到模型。
    2.  **定义状态**：创建一个用于在步骤间传递数据的结构，如 `MessagesState`。
    3.  **定义模型节点**：一个函数，调用 LLM 并记录调用次数。
    4.  **定义工具节点**：一个函数，根据 LLM 的决策执行具体工具并返回结果。
    5.  **定义结束逻辑**：一个条件判断函数，检查最后一条消息是否包含工具调用，以决定是继续调用工具还是结束。
    6.  **构建和编译**：将所有节点和边添加到 `StateGraph` 中，编译成一个可运行的应用。

*   **【Functional API 构建步骤】Use the Functional API**
    1.  **定义工具和模型**：与 Graph API 相同。
    2.  **定义模型任务**：用 `@task` 装饰一个函数来调用 LLM。
    3.  **定义工具任务**：用 `@task` 装饰一个函数来执行具体工具。
    4.  **定义 Agent**：用 `@entrypoint` 装饰主函数，在 `while` 循环中依次执行模型任务和工具任务，直到不再需要调用工具。

### 最佳实践

*   **根据偏好选择 API**：如果你喜欢可视化或需要构建复杂流程，选 Graph API；如果你喜欢用 Python 原生控制流来写逻辑，选 Functional API。
*   **状态追加而非覆盖**：定义状态时，使用 `Annotated[list, operator.add]` 来确保新消息是追加到历史记录中，而不是替换掉，这对于多轮对话至关重要。
*   **利用 AI 助手**：可以安装 [LangChain Docs MCP server](https://docs.langchain.com/use-these-docs) 来让 AI 助手实时查阅文档，或者安装 [LangChain Skills](https://github.com/langchain-ai/langchain-skills) 来提升它在 LangChain 生态中的任务表现。