# S01 Agent Loop - 执行流程图

本文档描述 `s01_agent_loop.py` 的完整执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph User["用户"]
        Input["用户输入"]
    end

    subgraph Agent["代理循环"]
        Loop["agent_loop()"]
        LLM["LLM API 调用"]
        Check["检查 stop_reason"]
        Exec["执行工具"]
    end

    subgraph Tool["工具执行"]
        Bash["run_bash()"]
        Process["subprocess.run()"]
    end

    Input --> Loop
    Loop --> LLM
    LLM --> Check
    Check -->|"tool_use"| Exec
    Check -->|"其他"| Return([返回结果])
    Exec --> Bash
    Bash --> Process
    Process --> Loop
    Loop --> LLM

    style Loop fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Check fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 2. 代理主循环流程 (agent_loop)

```mermaid
flowchart TD
    Start([开始 agent_loop]) --> CallLLM["调用 LLM API<br/>client.messages.create()"]
    CallLLM --> AppendResp["追加 assistant 响应<br/>messages.append()"]
    AppendResp --> CheckStop{"stop_reason<br/>== 'tool_use'?"}

    CheckStop -->|"否"| Return([返回])
    CheckStop -->|"是"| InitResults["初始化 results = []"]

    InitResults --> ForLoop["遍历 response.content"]
    ForLoop --> CheckType{"block.type<br/>== 'tool_use'?"}

    CheckType -->|"否"| ForLoop
    CheckType -->|"是"| PrintCmd["打印命令<br/>(黄色)"]
    PrintCmd --> RunBash["run_bash(command)"]
    RunBash --> PrintOutput["打印输出<br/>(前200字符)"]
    PrintOutput --> AppendResult["results.append()<br/>tool_result 对象"]
    AppendResult --> ForLoop

    ForLoop -->|"完成"| AppendResults["追加工具结果<br/>messages.append(results)"]
    AppendResults --> Loop(["继续循环"])

    Loop --> CallLLM

    style CheckStop fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style RunBash fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 3. 工具执行流程 (run_bash)

```mermaid
flowchart TD
    Start([run_bash 调用]) --> CheckDanger{"命令包含<br/>危险关键词?"}

    CheckDanger -->|"是"| ReturnDanger["返回: Error: Dangerous<br/>command blocked"]
    CheckDanger -->|"否"| TryRun["try: subprocess.run()"]

    TryRun --> SetTimeout["timeout=120秒"]
    SetTimeout --> Capture["capture_output=True"]
    Capture --> RunCmd["执行命令"]

    RunCmd --> MergeOutput["合并 stdout + stderr"]
    MergeOutput --> CheckEmpty{"输出是否<br/>为空?"}

    CheckEmpty -->|"是"| ReturnNoop["返回: (no output)"]
    CheckEmpty -->|"否"| CheckLimit{"输出长度<br/>> 50000?"}

    CheckLimit -->|"是"| Truncate["截断到 50000 字符"]
    CheckLimit -->|"否"| ReturnOutput["返回: 完整输出"]

    Truncate --> ReturnOutput
    ReturnOutput --> End([返回])

    TryRun -.->|"TimeoutExpired"| CatchTimeout["except: 返回 Error:<br/>Timeout (120s)"]
    CatchTimeout --> End

    style CheckDanger fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style RunCmd fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 4. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as agent_loop()
    participant L as LLM API
    participant T as run_bash()
    participant P as subprocess

    U->>A: 输入请求
    A->>A: messages.append(user_msg)

    loop 代理循环
        A->>L: client.messages.create()
        L-->>A: response (content, stop_reason)
        A->>A: messages.append(assistant)

        alt stop_reason == "tool_use"
            A->>T: run_bash(command)
            T->>T: 检查危险命令
            T->>P: subprocess.run()
            P-->>T: stdout + stderr
            T-->>A: output
            A->>A: results.append(tool_result)
            A->>A: messages.append(results)
        else stop_reason != "tool_use"
            A-->>U: 返回结果
        end
    end

    Note over A,L: 循环直到模型不再调用工具
```

---

## 5. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Looping: 开始代理循环

    Looping --> Calling: 调用 LLM API
    Calling --> Checking: 获取响应

    Checking --> Looping: stop_reason == "tool_use"
    Checking --> Done: stop_reason != "tool_use"

    Looping --> Executing: 遍历工具调用
    Executing --> Looping: 完成所有工具

    Done --> [*]: 返回结果

    note right of Looping
        循环条件：
        stop_reason == "tool_use"
    end note

    note right of Executing
        执行工具：
        - run_bash()
        - 追加 results
    end note
```

---

## 6. 数据结构

### messages 对话历史结构
```python
messages = [
    {"role": "user", "content": "用户输入"},
    {"role": "assistant", "content": [ContentBlock...]},  # LLM 响应
    {"role": "user", "content": [                       # 工具结果
        {"type": "tool_result", "tool_use_id": "...", "content": "输出"}
    ]},
    # ... 循环继续
]
```

### response.content 结构
```python
response.content = [
    ContentBlock(type="text", text="..."),           # 文本内容
    ContentBlock(type="tool_use",                    # 工具调用
        id="toolu_xxx",
        name="bash",
        input={"command": "ls"}
    )
]
```

### tool_result 对象结构
```python
{
    "type": "tool_result",
    "tool_use_id": "toolu_xxx",
    "content": "命令输出内容"
}
```

---

## 7. 关键特性总结

| 特性 | 说明 |
|------|------|
| **循环执行** | while stop_reason == "tool_use" 持续循环 |
| **结果反馈** | 工具执行结果作为下一条消息发送回模型 |
| **上下文累积** | 所有对话历史保存在 messages 列表中 |
| **危险命令检测** | 阻止执行破坏性命令 |
| **超时保护** | 命令执行最多 120 秒 |
| **输出限制** | 输出限制为 50000 字符 |
