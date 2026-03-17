# S12 Worktree + Task Isolation - 工作树任务隔离流程图

本文档描述 `s12_worktree_task_isolation.py` 的目录级隔离和任务绑定机制。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph ControlPlane["控制平面 (任务)"]
        Task["TaskManager<br/>.tasks/task_*.json"]
        Bind["bind_worktree()"]
    end

    subgraph ExecutionPlane["执行平面 (工作树)"]
        Work["WorktreeManager<br/>.worktrees/index.json"]
        Git["git worktree"]
        lanes["独立工作目录<br/>.worktrees/{name}/"]
    end

    subgraph Events["事件系统"]
        EventBus["EventBus<br/>.worktrees/events.jsonl"]
    end

    subgraph Repo["Git 仓库"]
        Root["REPO_ROOT"]
        Branch["wt/{name} 分支"]
    end

    Task --> Bind
    Bind --> Work
    Work --> lanes
    lanes --> Git
    Git --> Repo

    Work --> Events

    style ControlPlane fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style ExecutionPlane fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 2. 双平面架构

```mermaid
graph LR
    subgraph Tasks["任务 (.tasks/)"]
        T1["task_1.json<br/>status: pending"]
        T2["task_2.json<br/>status: in_progress"]
        T3["task_3.json<br/>worktree: auth"]
    end

    subgraph Worktrees["工作树 (.worktrees/)"]
        W1["auth-refactor/<br/>task_id: 1"]
        W2["api-update/<br/>task_id: 2"]
        W3["auth/<br/>task_id: 3"]
    end

    Tasks -->|"绑定"| Worktrees

    style Tasks fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Worktrees fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 3. WorktreeManager 类结构

```mermaid
classDiagram
    class WorktreeManager {
        +Path repo_root
        +TaskManager tasks
        +EventBus events
        +Path dir
        +Path index_path
        +bool git_available
        +__init__(repo_root, tasks, events)
        +create(name, task_id, base_ref) str
        +list_all() str
        +status(name) str
        +run(name, command) str
        +remove(name, force, complete_task) str
        +keep(name) str
        +_run_git(args) str
        _load_index() dict
        _save_index(data) void
        _find(name) dict|None
    }

    class TaskManager {
        +create(subject, description) str
        +get(task_id) str
        +update(task_id, status, owner) str
        bind_worktree(task_id, worktree, owner) str
    }

    class EventBus {
        +emit(event, task, worktree, error) void
        +list_recent(limit) str
    }

    WorktreeManager --> TaskManager: 使用
    WorktreeManager --> EventBus: 使用
```

---

## 4. 工作树创建流程 (create)

```mermaid
flowchart TD
    Start([create 调用]) --> ValidateName{"名称合法?"}

    ValidateName -->|"否"| Error1["抛出 ValueError"]
    ValidateName -->|"是"| CheckExist{"已存在?"}

    CheckExist -->|"是"| Error2["抛出 ValueError"]
    CheckExist -->|"否"| CheckTask{"有 task_id?"}

    CheckTask -->|"是"| CheckTaskExist{"任务存在?"}
    CheckTask -->|"否"| Continue

    CheckTaskExist -->|"否"| Error3["抛出 ValueError"]
    CheckTaskExist -->|"是"| EmitBefore["emit(worktree.create.before)"]

    EmitBefore --> RunGit["_run_git(['worktree', 'add'])"]

    RunGit --> CheckGit{"执行成功?"}

    CheckGit -->|"否"| Error4["抛出 RuntimeError"]
    CheckGit -->|"是"| CreateEntry["创建工作树条目"]

    CreateEntry --> UpdateIdx["更新 index.json"]
    UpdateIdx --> CheckBind{"有 task_id?"}

    CheckBind -->|"是"| BindTask["tasks.bind_worktree()"]
    CheckBind -->|"否"| EmitAfter

    BindTask --> EmitAfter
    EmitAfter --> EmitAfter2["emit(worktree.create.after)"]

    EmitAfter2 --> ReturnEntry([返回工作树条目])

    style ValidateName fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style CheckTaskExist fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style RunGit fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 5. 工作树执行流程 (run)

```mermaid
flowchart TD
    Start([run 调用]) --> CheckDanger{"危险命令?"}

    CheckDanger -->|"是"| Error1["返回: Dangerous command blocked"]
    CheckDanger -->|"否"| FindWT["_find(name)"]

    FindWT --> CheckFound{"工作树存在?"}

    CheckFound -->|"否"| Error2["返回: Unknown worktree"]
    CheckFound -->|"是"| CheckPath{"路径存在?"}

    CheckPath -->|"否"| Error3["返回: Worktree path missing"]
    CheckPath -->|"是"| RunCmd

    RunCmd["subprocess.run()"] --> CheckTimeout{"超时?"}

    CheckTimeout -->|"是"| Error4["返回: Timeout (300s)"]
    CheckTimeout -->|"否"| ReturnOutput([返回命令输出])

    style CheckDanger fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style CheckPath fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

---

## 6. 工作树移除流程 (remove)

```mermaid
flowchart TD
    Start([remove 调用]) --> Find["_find(name)"]

    Find --> CheckFound{"工作树存在?"}
    CheckFound -->|"否"| Error1["返回: Unknown worktree"]

    CheckFound -->|"是"| EmitBefore["emit(worktree.remove.before)"]

    EmitBefore --> BuildArgs["构建 git 参数"]
    BuildArgs --> RunGit["_run_git(['worktree', 'remove'])"]

    RunGit --> CheckComplete{"complete_task<br/>== True?"}

    CheckComplete -->|"是"| LoadTask["加载任务"]
    CheckComplete -->|"否"| UpdateIdx

    LoadTask --> UpdateTaskStatus["tasks.update(status='completed')"]
    UpdateTaskStatus --> Unbind["tasks.unbind_worktree()"]

    Unbind --> EmitComplete["emit(task.completed)"]
    EmitComplete --> UpdateIdx

    UpdateIdx --> SetStatus["item['status'] = 'removed'"]
    SetStatus --> EmitAfter["emit(worktree.remove.after)"]

    EmitAfter --> ReturnSuccess([返回成功消息])

    style RunGit fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style EmitComplete fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 7. 事件流

```mermaid
sequenceDiagram
    participant T as TaskManager
    participant W as WorktreeManager
    participant E as EventBus
    participant G as Git
    participant F as 文件系统

    Note over W,E: 工作树创建
    W->>E: emit(worktree.create.before)
    W->>G: git worktree add
    G-->>W: 创建成功
    W->>T: bind_worktree()
    T-->>F: 保存任务绑定
    W->>W: 更新 index.json
    W->>E: emit(worktree.create.after)

    Note over W,E: 工作树移除
    W->>E: emit(worktree.remove.before)
    W->>G: git worktree remove
    G-->>W: 移除成功
    W->>T: update(status='completed')
    W->>E: emit(task.completed)
    W->>W: 更新状态为 removed
    W->>E: emit(worktree.remove.after)
```

---

## 8. 工作树生命周期

```mermaid
stateDiagram-v2
    [*] --> Active: create()
    Active --> Kept: keep()
    Active --> Removed: remove()

    Kept --> Active: 重新激活
    Kept --> Removed: remove()

    Removed --> [*]: 删除

    note right of Active
        status: "active"
        可以执行命令
        可以绑定任务
    end note

    note right of Kept
        status: "kept"
        保留用于参考
        不执行命令
    end note

    note right of Removed
        status: "removed"
        工作树已删除
        记录保留
    end note
```

---

## 9. 数据结构

### .worktrees/index.json 结构
```json
{
  "worktrees": [
    {
      "name": "auth-refactor",
      "path": "/path/to/.worktrees/auth-refactor",
      "branch": "wt/auth-refactor",
      "task_id": 1,
      "status": "active",
      "created_at": 1678901234.567
    }
  ]
}
```

### task_N.json (带工作树绑定)
```json
{
  "id": 1,
  "subject": "实现登录功能",
  "description": "添加用户认证",
  "status": "in_progress",
  "owner": "alice",
  "worktree": "auth-refactor",
  "blockedBy": [],
  "blocks": [],
  "created_at": 1678901234.567,
  "updated_at": 1678901234.567
}
```

### 事件日志结构
```json
{
  "event": "worktree.create.after",
  "ts": 1678901234.567,
  "task": {"id": 1},
  "worktree": {
    "name": "auth-refactor",
    "path": "/path/to/.worktrees/auth-refactor",
    "branch": "wt/auth-refactor",
    "status": "active"
  }
}
```

---

## 10. 关键特性总结

| 特性 | 说明 |
|------|------|
| **目录级隔离** | 每个工作树有独立的工作目录 |
| **任务绑定** | 任务可以绑定到工作树 |
| **生命周期管理** | active → kept → removed |
| **事件追踪** | 所有操作都记录事件日志 |
| **Git 集成** | 使用 git worktree 管理工作树 |

---

## 11. 核心洞察

> **"Isolate by directory, coordinate by task ID."**
>
> 通过目录隔离，通过任务 ID 协调。
