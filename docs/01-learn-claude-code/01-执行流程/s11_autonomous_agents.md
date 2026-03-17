# S11 Autonomous Agents - 自主代理流程图

本文档描述 `s11_autonomous_agents.py` 的自主代理机制和任务认领流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph Lead["Lead 代理"]
        LLoop["agent_loop()"]
        Spawn["spawn_teammate()"]
        Idle["idle 工具"]
    end

    subgraph Teammate["自主队友"]
        Work["工作阶段<br/>50 轮工具调用"]
        Idle["空闲阶段<br/>轮询收件箱和任务"]
        Claim["认领任务<br/>scan_unclaimed_tasks()"]
    end

    subgraph TaskBoard["任务看板 (.tasks/)"]
        Tasks["task_*.json"]
        Unclaimed["未认领任务<br/>status=pending<br/>owner=''"]
    end

    subgraph Identity["身份重新注入"]
        IdBlock["<identity> 块<br/>压缩后恢复身份"]
    end

    Lead --> Teammate
    Teammate --> TaskBoard
    Teammate --> Identity

    style Teammate fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style TaskBoard fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 2. 队友生命周期

```mermaid
stateDiagram-v2
    [*] --> Spawning: spawn_teammate 调用
    Spawning --> Working: 创建线程并启动

    Working --> Working: 工具调用循环
    Working --> Idle: stop_reason != tool_use

    Idle --> CheckInbox{"有新消息?"}
    Idle --> CheckTasks{"有未认领任务?"}

    CheckInbox -->|"是"| Working
    CheckTasks -->|"是"| Working
    CheckTasks -->|"否"| Timeout

    CheckInbox -->|"否"| Timeout

    Timeout --> Shutdown: 超时 60 秒
    Shutdown --> [*]: 线程结束

    note right of Idle
        每 5 秒轮询一次
        检查收件箱和未认领任务
    end note

    note right of Timeout
        IDLE_TIMEOUT / POLL_INTERVAL 轮
        最多 12 次轮询
    end note
```

---

## 3. 工作阶段流程

```mermaid
flowchart TD
    Start([工作阶段开始]) --> ForLoop["for _ in range(50)"]

    ForLoop --> ReadInbox["BUS.read_inbox()"]
    ReadInbox --> CheckShutdown{"收到<br/>shutdown_request?"}

    CheckShutdown -->|"是"| ReturnExit
    CheckShutdown -->|"否"| AppendMsg["messages.append(msg)"]

    AppendMsg --> CallLLM["client.messages.create()"]
    CallLLM --> AppendResp["messages.append(response)"]

    AppendResp --> CheckStop{"stop_reason<br/>== tool_use?"}

    CheckStop -->|"否"| Break
    CheckStop -->|"是"| ProcessTools

    ProcessTools --> CheckIdle{"调用了 idle?"}
    CheckIdle -->|"是"| Break
    CheckIdle -->|"否"| ForLoop

    ForLoop -->|"完成"| EnterIdle([进入空闲阶段])

    style CheckIdle fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style Break fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 4. 空闲阶段流程

```mermaid
flowchart TD
    Start([空闲阶段开始]) --> SetStatus["_set_status(name, 'idle')"]
    SetStatus --> InitPolls["polls = 60 / 5"]

    InitPolls --> ForPoll["for _ in range(polls)"]
    ForPoll --> Sleep["time.sleep(5)"]

    Sleep --> ReadInbox["BUS.read_inbox()"]
    ReadInbox --> CheckShutdown{"收到<br/>shutdown_request?"}

    CheckShutdown -->|"是"| ReturnExit
    CheckShutdown --> CheckMsg{"有消息?"}

    CheckMsg -->|"是"| AppendMsg["追加到 messages"]
    CheckMsg --> CheckUnclaimed

    CheckUnclaimed --> ScanUnclaimed["scan_unclaimed_tasks()"]
    ScanUnclaimed --> HasTasks{"有未认领任务?"}

    HasTasks -->|"是"| ClaimTask["claim_task(task_id, name)"]
    HasTasks -->|"否"| CheckPollEnd

    ClaimTask --> BuildPrompt["构建任务提示"]
    BuildPrompt --> CheckIdentity{"len(messages) <= 3?"}

    CheckIdentity -->|"是"| InjectId["注入身份块"]
    CheckIdentity -->|"否"| AppendTask

    InjectId --> AppendTask["追加任务消息"]
    AppendTask --> Resume(["恢复工作"])

    CheckMsg --> CheckPollEnd
    CheckPollEnd --> ForPoll

    ForPoll -->|"完成"| CheckTimeout

    CheckTimeout --> Resume("有工作可做?")

    Resume -->|"是"| SetWorking["_set_status(name, 'working')"]
    SetWorking --> EnterWork([进入工作阶段])

    Resume -->|"否"| SetShutdown["_set_status(name, 'shutdown')"]
    SetShutdown --> ReturnExit([退出线程])

    style ScanUnclaimed fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style ClaimTask fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 5. 任务认领流程

```mermaid
flowchart TD
    Start([scan_unclaimed_tasks]) --> CreateDir["TASKS_DIR.mkdir()"]
    CreateDir --> ForFiles["遍历 task_*.json"]

    ForFiles --> Load["json.loads()"]
    Load --> Check1{"status<br/>== pending?"}

    Check1 -->|"否"| ForFiles
    Check1 --> Check2{"owner<br/>== ''?"}

    Check2 -->|"否"| ForFiles
    Check2 --> Check3{"blockedBy<br/>== []?"}

    Check3 -->|"否"| ForFiles
    Check3 --> Append["追加到 unclaimed"]

    Append --> ForFiles
    ForFiles -->|"完成"| Return([返回列表])

    style Check1 fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style Check2 fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style Check3 fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

---

## 6. 身份重新注入机制

```mermaid
graph TB
    subgraph Before["压缩前"]
        B1["messages 长列表<br/>包含完整对话"]
    end

    subgraph Compression["上下文压缩"]
        C1["auto_compact()"]
        C2["只保留摘要"]
    end

    subgraph After["压缩后"]
        A1["messages 短列表"]
        A2["需要身份信息"]
    end

    subgraph Reinject["身份重新注入"]
        R1["检测: len(messages) <= 3"]
        R2["插入: make_identity_block()"]
        R3["添加: messages.insert(0)"]
    end

    Before --> Compression
    Compression --> After
    After --> Reinject
    R1 --> R2
    R2 --> R3

    style Compression fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style Reinject fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 7. 完整时序图

```mermaid
sequenceDiagram
    participant L as Lead
    participant T as 队友线程
    participant B as MessageBus
    participant TB as TaskBoard
    participant I as Identity

    L->>T: spawn_teammate("coder", "处理任务")
    activate T

    T->>T: 工作阶段 (50 轮)
    loop 工具调用
        T->>B: read_inbox()
        B-->>T: 无消息
        T->>T: 执行工具
    end

    T->>T: 进入空闲阶段

    loop 空闲轮询 (最多 12 次)
        T->>B: read_inbox()
        B-->>T: 无消息

        T->>TB: scan_unclaimed_tasks()
        TB-->>T: 发现未认领任务

        T->>TB: claim_task(task_id)
        TB-->>T: 认领成功

        Note over T,I: len(messages) <= 3
        T->>I: make_identity_block()
        I-->>T: 身份块

        T->>T: 注入身份和任务
        T->>T: 返回工作阶段
    end

    deactivate T
    T-->>L: 线程结束

    Note over T: 队友可以自动寻找和认领任务
```

---

## 8. 数据结构

### make_identity_block 返回
```python
{
    "role": "user",
    "content": "<identity>You are 'coder', role: backend, team: my-team. Continue your work.</identity>"
}
```

### 未认领任务条件
```python
# 任务必须同时满足：
1. task.get("status") == "pending"
2. not task.get("owner")  # owner 为空
3. not task.get("blockedBy")  # 无阻塞依赖
```

### 认领后的任务状态
```json
{
  "id": 5,
  "status": "in_progress",
  "owner": "coder"
}
```

---

## 9. 关键特性总结

| 特性 | 说明 |
|------|------|
| **自主性** | 队友主动寻找和认领任务 |
| **空闲轮询** | 没有工作时进入空闲状态，定期检查 |
| **身份持久化** | 即使上下文压缩也能恢复身份 |
| **超时关闭** | 空闲超时后自动关闭 |
| **并行执行** | 多个队友可以同时工作 |

---

## 10. 核心洞察

> **"The agent finds work itself."**
>
> 代理自己寻找工作。
