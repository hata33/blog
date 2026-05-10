### 心智模型

Agent 评估通过**评判器函数**对 Agent 的执行轨迹（消息和工具调用序列）进行评分，用于捕获修改提示词、工具或模型后的行为回归。提供两种互补方式：**轨迹匹配**（确定性、零成本对比参考轨迹）和 **LLM 评判者**（定性评估整体质量，无需严格参考）。所有评估器支持异步，并可集成到 LangSmith 中跟踪历史实验。

### 二级标题及内容

*   **【安装】Install AgentEvals**
    ```bash
    pip install agentevals
    ```

*   **【轨迹匹配评估器】Trajectory match evaluator**
    提供四种模式：
    *   `strict`：严格顺序匹配工具调用，内容可不同。
    *   `unordered`：工具调用可任意顺序。
    *   `subset`：Agent 调用仅限参考轨迹中的工具，无额外调用。
    *   `superset`：Agent 至少调用参考轨迹中的工具，允许更多。
    还可通过 `tool_args_match_mode` 自定义工具参数的相等判定规则。

*   **【LLM 评判者评估器】LLM-as-judge evaluator**
    使用 LLM 评估轨迹质量，可不提供参考轨迹，也可提供参考轨迹使用 `TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE` 提示。支持异步版本（`create_async_trajectory_llm_as_judge` 等）。

*   **【在 LangSmith 中运行评估】Run evals in LangSmith**
    设置 `LANGSMITH_API_KEY` 和 `LANGSMITH_TRACING=true` 后，可通过两种方式集成：
    *   **pytest 集成**：用 `@pytest.mark.langsmith` 标记测试，使用 `langsmith.testing` 记录输入输出和参考，运行 `pytest --langsmith-output`。
    *   **evaluate 函数**：基于 LangSmith 数据集运行，数据集需包含 `input` 和 `output` 字段。

### 最佳实践

*   **轨迹匹配用于确定性的快速检查**：当你明确知道 Agent 应该调用什么工具时，用 `strict` 或 `superset` 做零成本验证。
*   **LLM 评判者用于整体质量评估**：当你更关心推理质量和最终答案的合理性，而非具体调用序列时使用。
*   **合理选择匹配模式**：不要对所有场景都用 `strict`，`unordered` 和 `superset` 更稳健，能减少因合理行为变化导致的假失败。
*   **利用异步版本提升效率**：批量评估或并发测试时使用 `create_async_*` 版本的评估器。
*   **通过 LangSmith 跟踪历史**：将评估结果记录到 LangSmith，便于横向对比不同版本的 Agent 性能变化。