# S06 Context Compact - 上下文压缩流程图

本文档描述 `s06_context_compact.py` 的三层上下文压缩机制和执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph Messages["对话消息"]
        Msgs["messages 列表"]
    end

    subgraph Layer1["Layer 1: 微压缩"]
        Micro["micro_compact()"]
        Clean["清理旧 tool_result"]
        Marker["'[Previous: used tool_name]'"]
    end

    subgraph Layer2["Layer 2: 自动压缩"]
        Auto["auto_compact()"]
        Save["保存到 .transcripts/"]
        LLM2["LLM 生成摘要"]
        Replace["替换为摘要消息"]
    end

    subgraph Layer3["Layer 3: 手动压缩"]
        CompactTool["compact 工具"]
        Trigger["手动触发"]
        Manual["auto_compact()"]
    end

    subgraph Threshold["Token 阈值"]
        Check["estimate_tokens()"]
        Limit["THRESHOLD = 50000"]
    end

    Msgs --> Micro
    Micro --> Clean
    Clean --> Check

    Check --> Limit
    Limit -->|"超过阈值"| Auto
    Limit -->|"未超过"| NextLLM["LLM 调用"]

    Auto --> Save
    Save --> LLM2
    LLM2 --> Replace
    Replace --> NextLLM

    NextLLM --> CompactTool
    CompactTool --> Trigger
    Trigger --> Manual

    style Layer1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Layer2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style Layer3 fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 2. 三层压缩策略对比

```mermaid
graph LR
    subgraph L1["Layer 1: micro_compact"]
        L1A["每轮自动执行"]
        L1B["静默执行"]
        L1C["保留最近 3 个结果"]
    end

    subgraph L2["Layer 2: auto_compact"]
        L2A["Token 超阈值触发"]
        L2B["保存完整对话"]
        L2C["LLM 生成摘要"]
    end

    subgraph L3["Layer 3: compact 工具"]
        L3A["手动触发"]
        L3B["同 Layer 2 逻辑"]
        L3C["主动管理上下文"]
    end

    L1 -.->|自动| L2
    L2 -.->|可手动| L3

    style L1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style L2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style L3 fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 3. 微压缩流程 (micro_compact)

```mermaid
flowchart TD
    Start([micro_compact 调用]) --> Collect["收集所有 tool_result<br/>嵌套遍历 messages"]

    Collect --> CheckCount{"结果数量<br/>>= 3?"}

    CheckCount -->|"否"| ReturnMsgs([返回原列表])
    CheckCount -->|"是"| BuildMap["构建 tool_name_map"]

    BuildMap --> ScanAssist["扫描 assistant 消息<br/>提取 tool_use 块"]

    ScanAssist --> ForResults["遍历旧结果<br/>[:-3] 切片"]

    ForResults --> CheckContent{"content<br/>> 100?"}

    CheckContent -->|"是"| ReplaceMark["替换为<br/>'[Previous: used tool_name]'"]
    CheckContent -->|"否"| ForResults

    ReplaceMark --> ForResults
    ForResults -->|"完成"| ReturnMsgs

    style Collect fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style ReplaceMark fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 4. 自动压缩流程 (auto_compact)

```mermaid
flowchart TD
    Start([auto_compact 调用]) --> CreateDir["创建 .transcripts/ 目录"]

    CreateDir --> GenName["生成文件名<br/>transcript_{timestamp}.jsonl"]

    GenName --> SaveFile["保存完整对话<br/>JSONL 格式"]

    SaveFile --> Truncate["截断前 80000 字符"]

    Truncate --> CallLLM["请求 LLM 生成摘要<br/>包含: 完成内容、状态、决策"]

    CallLLM --> GetSummary["获取摘要文本"]

    GetSummary --> BuildMsg["构建新消息列表"]

    BuildMsg --> AddUser["用户消息: 压缩通知 + 摘要"]
    BuildMsg --> AddAssist["助手消息: 确认"]

    AddAssist --> ReturnNew([返回新消息列表])

    style CallLLM fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 5. 代理主循环流程（集成三层压缩）

```mermaid
flowchart TD
    Start([agent_loop 开始]) --> Micro["micro_compact(messages)"]
    Micro --> CheckToken{"estimate_tokens()<br/>> THRESHOLD?"}

    CheckToken -->|"是"| Auto["auto_compact(messages)"]
    CheckToken -->|"否"| CallLLM["client.messages.create()"]

    Auto --> CallLLM
    CallLLM --> AppendResp["messages.append(response)"]

    AppendResp --> CheckStop{"stop_reason<br/>== tool_use?"}

    CheckStop -->|"否"| Return([返回])
    CheckStop -->|"是"| ProcessTools

    ProcessTools --> CheckCompact{"调用了<br/>compact 工具?"}

    CheckCompact -->|"是"| Manual["auto_compact(messages)"]
    CheckCompact -->|"否"| AppendResults

    Manual --> AppendResults["messages.append(results)"]
    AppendResults --> Loop(["继续循环"])

    Loop --> Micro

    style Micro fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Auto fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style Manual fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 6. 上下文压缩前后对比

```mermaid
graph TB
    subgraph Before["压缩前"]
        B1["messages 长度: ~60000 tokens"]
        B2["包含完整对话历史"]
        B3["所有 tool_result 完整内容"]
    end

    subgraph After["压缩后"]
        A1["messages 长度: ~2000 tokens"]
        A2["只有摘要和确认消息"]
        A3["完整对话已保存到磁盘"]
    end

    subgraph Saved[".transcripts/transcript_xxx.jsonl"]
        S1["完整的对话记录"]
        S2["可恢复但不在内存中"]
    end

    Before -->|"压缩触发"| After
    Before -->|"保存"| Saved

    style After fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style Saved fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 7. 压缩决策流程图

```mermaid
flowchart TD
    Start([每轮循环开始]) --> L1["Layer 1: micro_compact"]
    L1 --> TokenCheck{"tokens > 50000?"}

    TokenCheck -->|"是"| L2["Layer 2: auto_compact"]
    TokenCheck -->|"否"| LLMCall

    L2 --> LLMCall["LLM API 调用"]
    LLMCall --> ToolCheck{"调用了 compact?"}

    ToolCheck -->|"是"| L3["Layer 3: 手动压缩"]
    ToolCheck -->|"否"| Continue

    L3 --> Continue["继续下一轮"]

    Continue --> Start

    style L1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style L2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style L3 fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 8. 数据结构

### tool_result 清理前
```python
{
    "type": "tool_result",
    "tool_use_id": "toolu_001",
    "content": "完整的命令输出（可能很长）"
}
```

### tool_result 清理后
```python
{
    "type": "tool_result",
    "tool_use_id": "toolu_001",
    "content": "[Previous: used bash]"
}
```

### 压缩后的消息结构
```python
[
    {
        "role": "user",
        "content": "[Conversation compressed. Transcript: .transcripts/transcript_xxx.jsonl]\n\n# 摘要内容..."
    },
    {
        "role": "assistant",
        "content": "Understood. I have the context from the summary. Continuing."
    }
]
```

---

## 9. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Normal: tokens < 50000
    Normal --> AutoComp: tokens >= 50000

    Normal --> MicroCompact: 每轮执行
    MicroCompact --> Normal: 静默完成

    AutoComp --> Normal: 压缩完成
    AutoComp --> Manual: 主动调用 compact

    Manual --> Normal: 手动压缩完成

    note right of MicroCompact
        Layer 1: 微压缩
        保留最近 3 个完整结果
        旧结果替换为占位符
    end note

    note right of AutoComp
        Layer 2: 自动压缩
        Token 超过 50000 时触发
        保存完整对话到磁盘
    end note

    note right of Manual
        Layer 3: 手动压缩
        主动调用 compact 工具
        同 Layer 2 逻辑
    end note
```

---

## 10. 三层压缩特性总结

| 层级 | 触发条件 | 执行频率 | Token 节省 |
|------|----------|----------|------------|
| **Layer 1: micro_compact** | 每轮自动执行 | 每轮 | ~几千 tokens |
| **Layer 2: auto_compact** | Token 超过阈值 | 按需 | ~几万 tokens |
| **Layer 3: compact 工具** | 手动调用 | 按需 | ~几万 tokens |

---

## 11. 关键特性总结

| 特性 | 说明 |
|------|------|
| **渐进式压缩** | 从小幅清理到全面摘要 |
| **可恢复性** | 完整对话保存到磁盘 |
| **透明性** | 摘要保留关键信息 |
| **主动性** | 代理可以主动触发压缩 |
| **Token 估算** | 约 4 字符 = 1 token |

---

## 12. 核心洞察

> **"The agent can forget strategically and keep working forever."**
>
> 代理可以战略性遗忘并无限期工作。
