# S08 Background Tasks - 执行流程图

本文档描述 `s08_background_tasks.py` 的完整执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph Main["主线程"]
        User["用户输入"]
        Agent["agent_loop()"]
        LLM["LLM API 调用"]
        Drain["drain_notifications()"]
        Check["check_background()"]
    end

    subgraph BG["BackgroundManager"]
        Tasks["tasks 字典"]
        Queue["_notification_queue"]
        Lock["_lock 线程锁"]
    end

    subgraph Thread["后台线程池"]
        T1["Thread 1"]
        T2["Thread 2"]
        T3["Thread N"]
    end

    subgraph Process["子进程"]
        P1["subprocess 1"]
        P2["subprocess 2"]
        P3["subprocess N"]
    end

    User --> Agent
    Agent -->|"background_run"| BG
    BG -->|"创建线程"| Thread
    Thread -->|"执行命令"| Process
    Process -->|"完成"| Thread
    Thread -->|"追加通知"| Queue
    Agent -->|"排空队列"| Drain
    Drain -->|"获取通知"| Queue
    Drain -->|"注入结果"| Agent
    Agent --> LLM
    Agent -->|"查询状态"| Check
    Check -->|"读取"| Tasks
```

---

## 2. 后台任务启动流程 (run 方法)

```mermaid
flowchart TD
    Start([代理调用 background_run]) --> GenID["生成 task_id = uuid4()[:8]"]
    GenID --> InitTask["在 tasks 字典中创建任务记录<br/>status='running', result=None"]
    InitTask --> CreateThread["创建 threading.Thread<br/>target=_execute, daemon=True"]
    CreateThread --> StartThread["thread.start()"]
    StartThread --> ReturnID[/"返回: task_id 已启动"/]
    ReturnID --> End([代理继续执行])

    StartThread -.后台线程开始.-> Exec["_execute() 方法"]

    style Exec fill:#f9f,stroke:#333,stroke-width:2px
```

---

## 3. 后台任务执行流程 (_execute 方法)

```mermaid
flowchart TD
    Exec([后台线程启动]) --> Try["开始 try 块"]
    Try --> RunCmd["subprocess.run(command)"]

    RunCmd -->|"成功"| CaptOutput["捕获 stdout + stderr<br/>限制 50000 字符"]
    CaptOutput --> SetStatus["设置 status='completed'"]

    RunCmd -->|"超时 >300s"| CatchTimeout["except TimeoutExpired"]
    CatchTimeout --> SetTimeout["设置 output='Timeout'<br/>status='timeout'"]

    RunCmd -->|"其他异常"| CatchError["except Exception"]
    CatchError --> SetError["设置 output=error<br/>status='error'"]

    SetStatus --> UpdateTask["更新 tasks[task_id]"]
    SetTimeout --> UpdateTask
    SetError --> UpdateTask

    UpdateTask --> AcquireLock["with self._lock:<br/>获取线程锁"]
    AcquireLock --> AppendQueue["_notification_queue.append()"]
    AppendQueue --> ReleaseLock["释放线程锁"]
    ReleaseLock --> Done([后台线程结束])

    style AcquireLock fill:#ff9,stroke:#333,stroke-width:2px
    style AppendQueue fill:#ff9,stroke:#333,stroke-width:2px
```

---

## 4. 通知队列处理流程

```mermaid
flowchart TB
    subgraph Queue["通知队列生命周期"]
        direction LR
        Empty1["空队列"] -->|"后台线程追加"| Filled["有通知"]
        Filled -->|"主线程排空"| Empty2["空队列"]
    end

    subgraph ThreadSafe["线程安全机制"]
        Lock1["后台线程: acquire()"]
        Append["append(通知)"]
        Lock2["后台线程: release()"]

        Lock3["主线程: acquire()"]
        Copy["list(队列)"]
        Clear["clear()"]
        Lock4["主线程: release()"]
    end

    Filled --> ThreadSafe

    style Lock1 fill:#ff9,stroke:#333
    style Lock3 fill:#ff9,stroke:#333
```

---

## 5. 代理主循环流程 (agent_loop)

```mermaid
flowchart TD
    Start([agent_loop 开始]) --> Drain["BG.drain_notifications()"]
    Drain --> HasNotif{"有通知?"}
    HasNotif -->|"是"| BuildMsg["构建 <background-results> 消息"]
    BuildMsg --> AppendMsg["追加到 messages"]
    AppendMsg --> CallLLM
    HasNotif -->|"否"| CallLLM["调用 LLM API"]

    CallLLM --> Response["获取 response.content"]
    Response --> CheckStop{"stop_reason<br/>=='tool_use'?"}
    CheckStop -->|"否"| Return([返回响应])
    CheckStop -->|"是"| ProcessTools["遍历 tool_use 块"]

    ProcessTools --> GetHandler["获取 TOOL_HANDLERS[name]"]
    GetHandler --> ExecTool["执行工具函数"]
    ExecTool --> IsBG{"是后台任务?"}
    IsBG -->|"是 (background_run)"| BGRun["BG.run()<br/>立即返回 task_id"]
    IsBG -->|"否"| WaitTool["等待工具完成"]
    BGRun --> AddResult
    WaitTool --> AddResult["添加 tool_result"]
    AddResult --> Loop(["继续循环"])

    Loop --> Drain

    style BGRun fill:#9f9,stroke:#333,stroke-width:2px
    style WaitTool fill:#f99,stroke:#333,stroke-width:2px
```

---

## 6. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as 代理主循环
    participant L as LLM API
    participant B as BackgroundManager
    participant T as 后台线程
    participant P as 子进程

    U->>A: 输入请求
    A->>B: background_run(long_cmd)
    B->>B: 生成 task_id
    B->>T: 创建并启动线程
    B-->>A: 立即返回 task_id

    par 后台并行执行
        T->>P: subprocess.run(command)
        Note over T,P: 阻塞等待（最多300秒）
        P-->>T: 返回输出
        T->>B: 获取锁
        T->>B: append(通知到队列)
        T->>B: 释放锁
    and 主线程继续
        A->>L: 发送当前消息
    end

    A->>B: drain_notifications()
    B->>B: 获取锁
    B->>B: 复制并清空队列
    B->>B: 释放锁
    B-->>A: 返回通知列表

    A->>A: 注入 <background-results>
    A->>L: 发送包含后台结果的请求

    Note over A,L: 代理根据后台结果决定后续行动
```

---

## 7. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> running: background_run() 调用

    running --> completed: 命令成功执行
    running --> timeout: 执行超过 300 秒
    running --> error: 抛出异常

    completed --> [*]: 任务完成
    timeout --> [*]: 任务超时
    error --> [*]: 任务失败

    note right of running
        status = "running"
        result = None
    end note

    note right of completed
        status = "completed"
        result = 命令输出
    end note

    note right of timeout
        status = "timeout"
        result = "Timeout (300s)"
    end note

    note right of error
        status = "error"
        result = 异常信息
    end note
```

---

## 8. 并发场景示例

```mermaid
gantt
    title 后台任务与主线程并行执行示例
    dateFormat X
    axisFormat %L

    section 主线程
    启动任务A      :a1, 0, 1
    启动任务B      :a2, 1, 1
    其他工作       :main, 2, 8
    注入结果A      :injA, 8, 1
    注入结果B      :injB, 9, 1
    LLM 调用       :llm, 10, 2

    section 后台线程A
    执行命令A      :bgA, 1, 6
    推送通知A      :notA, 7, 1

    section 后台线程B
    执行命令B      :bgB, 2, 8
    推送通知B      :notB, 10, 1
```

---

## 9. 数据结构

### tasks 字典结构
```python
tasks = {
    "a1b2c3d4": {
        "status": "completed",      # running | completed | timeout | error
        "result": "命令输出内容",    # 最多 50000 字符
        "command": "python script.py" # 原始命令
    },
    "e5f6g7h8": {
        "status": "running",
        "result": None,
        "command": "npm install"
    }
}
```

### 通知对象结构
```python
notification = {
    "task_id": "a1b2c3d4",
    "status": "completed",
    "command": "python script.py",   # 前 80 字符
    "result": "输出内容"              # 前 500 字符
}
```

---

## 10. 关键特性总结

| 特性 | 说明 |
|------|------|
| **非阻塞** | `run()` 立即返回 task_id，不等待命令完成 |
| **并行** | 多个任务可在不同线程中同时执行 |
| **状态跟踪** | `check()` 可查询任务状态 |
| **通知注入** | 完成的任务结果自动注入到对话 |
| **线程安全** | 使用 `threading.Lock` 保护共享队列 |
| **超时保护** | 命令执行最多 300 秒 |
| **守护线程** | 主程序退出时后台线程自动终止 |
