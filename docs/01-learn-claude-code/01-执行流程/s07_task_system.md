# S07 Task System - 任务系统流程图

本文档描述 `s07_task_system.py` 的持久化任务管理机制和执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph TaskFiles["任务文件 (.tasks/)"]
        T1["task_1.json"]
        T2["task_2.json"]
        T3["task_3.json"]
    end

    subgraph TaskManager["TaskManager"]
        Create["create()"]
        Get["get()"]
        Update["update()"]
        ListAll["list_all()"]
        Clear["_clear_dependency()"]
    end

    subgraph Tools["工具接口"]
        TC["task_create"]
        TG["task_get"]
        TU["task_update"]
        TL["task_list"]
    end

    subgraph Deps["依赖关系"]
        Blocked["blockedBy"]
        Blocks["blocks"]
    end

    TaskFiles --> TaskManager
    TaskManager --> Tools
    Tools --> Deps

    style TaskManager fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 2. 任务数据结构

```mermaid
graph TB
    subgraph TaskFile["task_N.json"]
        ID["id: 唯一标识"]
        Subject["subject: 任务标题"]
        Desc["description: 详细描述"]
        Status["status: pending/..."]
        Owner["owner: 负责人"]
        BlockedBy["blockedBy: [...]"]
        Blocks["blocks: [...]"]
    end

    ID --> Subject
    Subject --> Desc
    Desc --> Status
    Status --> Owner
    Owner --> BlockedBy
    BlockedBy --> Blocks

    style Status fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 3. TaskManager 类结构

```mermaid
classDiagram
    class TaskManager {
        +Path dir
        +int _next_id
        +__init__(tasks_dir)
        +_max_id() int
        +_load(task_id) dict
        +_save(task) void
        +create(subject, description) str
        +get(task_id) str
        +update(task_id, status, ...) str
        +_clear_dependency(completed_id) void
        +list_all() str
    }

    class Task {
        +int id
        +str subject
        +str description
        +str status
        +str owner
        +list blockedBy
        +list blocks
    }

    TaskManager "1" --> "*" Task : manages
```

---

## 4. 任务创建流程 (create)

```mermaid
flowchart TD
    Start([create 调用]) --> BuildTask["构建任务字典<br/>id, subject, description"]

    BuildTask --> SetStatus["status = 'pending'"]
    SetStatus --> SetBlocked["blockedBy = []"]
    SetBlocked --> SetBlocks["blocks = []"]
    SetBlocks --> SetOwner["owner = ''"]

    SetOwner --> Save["_save(task)"]
    Save --> IncID["_next_id++"]

    IncID --> ReturnJSON["return json.dumps(task)"]
    ReturnJSON --> Done([返回任务对象])

    style Save fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 5. 任务更新流程 (update)

```mermaid
flowchart TD
    Start([update 调用]) --> Load["_load(task_id)"]
    Load --> CheckStatus{"提供 status?"}

    CheckStatus -->|"是"| ValidateStatus{"status 合法?"}
    CheckStatus -->|"否"| CheckBlocked

    ValidateStatus -->|"不合法"| Error1["抛出 ValueError"]
    ValidateStatus -->|"合法"| SetStatus["task['status'] = status"]

    SetStatus --> CheckCompleted{"status == 'completed'?"}
    CheckCompleted -->|"是"| Clear["_clear_dependency(task_id)"]
    CheckCompleted -->|"否"| CheckBlocked

    Clear --> CheckBlocked
    CheckBlocked -->|"提供 addBlockedBy"| MergeBlocked["合并 blockedBy"]

    MergeBlocked -->|"提供 addBlocks"| MergeBlocks["合并 blocks"]
    MergeBlocks --> SyncBlocks["同步到被阻塞任务"]

    SyncBlocks --> Save["_save(task)"]
    Save --> ReturnJSON["return json.dumps(task)"]
    ReturnJSON --> Done([返回更新后的任务])

    CheckBlocked --> Save
    MergeBlocks --> Save

    style Clear fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style SyncBlocks fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 6. 依赖清理流程 (_clear_dependency)

```mermaid
flowchart TD
    Start([_clear_dependency]) --> Glob["glob('task_*.json')"]

    Glob --> ForLoop["遍历所有任务文件"]
    ForLoop --> LoadTask["json.loads()"]

    LoadTask --> CheckID{"completed_id<br/>in blockedBy?"}

    CheckID -->|"是"| Remove["blockedBy.remove(completed_id)"]
    CheckID -->|"否"| Next

    Remove --> SaveTask["_save(task)"]
    SaveTask --> Next

    Next --> ForLoop
    ForLoop -->|"完成"| Done([完成])

    style CheckID fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style Remove fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 7. 依赖关系解析示例

```mermaid
graph TB
    subgraph Tasks["任务依赖图"]
        T1["Task 1<br/>completed"]
        T2["Task 2<br/>blockedBy: [1]"]
        T3["Task 3<br/>blockedBy: [2]"]
    end

    T1 -.->|"解锁"| T2
    T2 -.->|"阻塞"| T3

    subgraph Process["解析过程"]
        P1["Task 1 完成"]
        P2["从 Task 2 的<br/>blockedBy 移除 1"]
        P3["Task 2 解锁"]
    end

    T1 --> P1
    P1 --> P2
    P2 --> P3
    P3 -.->|"解锁"| T3

    style T1 fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style T2 fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style T3 fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 8. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as 代理
    participant T as TaskManager
    participant F as 文件系统
    participant D as 依赖系统

    U->>A: 创建任务

    A->>T: create(subject, description)
    T->>T: 生成 ID
    T->>T: 初始化任务对象
    T->>F: 保存 task_{id}.json
    F-->>T: 保存成功
    T-->>A: 返回任务对象

    A->>A: 显示任务创建成功

    Note over A,D: 工作进行中...

    U->>A: 更新任务状态为 completed

    A->>T: update(task_id, status="completed")
    T->>F: 加载 task_{id}.json
    F-->>T: 返回任务数据

    T->>T: 更新状态为 completed
    T->>T: _clear_dependency(task_id)

    T->>F: 遍历所有任务文件
    F-->>T: 返回任务列表

    loop 遍历所有任务
        T->>T: 检查 blockedBy
        alt completed_id 在 blockedBy 中
            T->>T: 移除 completed_id
            T->>F: 保存更新后的任务
        end
    end

    T->>F: 保存原任务
    F-->>T: 保存成功
    T-->>A: 返回更新后的任务

    Note over D: 依赖关系已更新
    Note over D: 被阻塞的任务可能解锁
```

---

## 9. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Pending: 创建任务
    Pending --> InProgress: 开始执行
    InProgress --> Pending: 暂停
    InProgress --> Completed: 完成

    Pending --> Blocked: 被 blockedBy 阻塞
    Blocked --> Pending: 依赖完成

    Completed --> [*]: 任务结束

    note right of Pending
        状态: pending
        标记: [ ]
        可以被其他任务依赖
    end note

    note right of InProgress
        状态: in_progress
        标记: [>]
        同时只能有一个
    end note

    note right of Completed
        状态: completed
        标记: [x]
        自动清理依赖关系
    end note

    note right of Blocked
        状态: pending
        但 blockedBy 非空
        需要等待依赖完成
    end note
```

---

## 10. 数据结构示例

### task_1.json (已完成的任务)
```json
{
  "id": 1,
  "subject": "实现登录功能",
  "description": "添加用户认证接口",
  "status": "completed",
  "owner": "",
  "blockedBy": [],
  "blocks": [2, 3]
}
```

### task_2.json (被阻塞的任务)
```json
{
  "id": 2,
  "subject": "实现注册功能",
  "description": "添加用户注册接口",
  "status": "pending",
  "owner": "",
  "blockedBy": [1],
  "blocks": [3]
}
```

### task_3.json (最终任务)
```json
{
  "id": 3,
  "subject": "编写用户文档",
  "description": "为登录和注册功能编写文档",
  "status": "pending",
  "owner": "",
  "blockedBy": [1, 2],
  "blocks": []
}
```

---

## 11. 关键特性总结

| 特性 | 说明 |
|------|------|
| **持久化存储** | 任务保存在 .tasks/ 目录的 JSON 文件中 |
| **依赖关系图** | 通过 blockedBy/blocks 字段管理任务依赖 |
| **状态管理** | pending → in_progress → completed |
| **上下文无关** | 任务状态独立于对话历史，压缩后仍可访问 |
| **自动解析** | 完成任务自动清理依赖关系 |
| **双向同步** | 添加 blocks 时自动更新被阻塞任务的 blockedBy |

---

## 12. 核心洞察

> **"State that survives compression -- because it's outside the conversation."**
>
> 持久化状态在压缩后仍然保留——因为它在对话之外。
