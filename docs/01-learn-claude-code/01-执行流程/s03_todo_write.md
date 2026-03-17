# S03 Todo Write - 待办事项管理流程图

本文档描述 `s03_todo_write.py` 的待办事项管理机制和提醒流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph Agent["代理循环"]
        Loop["agent_loop()"]
        LLM["LLM API 调用"]
        Counter["rounds_since_todo"]
        Check["计数器 >= 3?"]
    end

    subgraph Todo["TodoManager"]
        Items["items 列表"]
        Update["update()"]
        Render["render()"]
        Validate["验证逻辑"]
    end

    subgraph Tools["工具"]
        Bash["bash"]
        Read["read_file"]
        Write["write_file"]
        Edit["edit_file"]
        TodoTool["todo"]
    end

    Loop --> LLM
    LLM --> Tools
    TodoTool --> Update
    Update --> Validate
    Validate --> Items
    Items --> Render

    Loop --> Counter
    Counter --> Check
    Check -->|"是"| Inject["注入提醒"]
    Check -->|"否"| NextLoop["继续循环"]
    Inject --> NextLoop

    style Todo fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Check fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 2. TodoManager 类结构

```mermaid
classDiagram
    class TodoManager {
        +list items
        +__init__() void
        +update(items: list) str
        +render() str
    }

    class TodoItem {
        +str id
        +str text
        +str status
    }

    class Status {
        <<enumeration>>
        pending
        in_progress
        completed
    }

    TodoManager "1" --> "*" TodoItem : contains
    TodoItem --> Status : has
```

---

## 3. 任务更新流程 (update 方法)

```mermaid
flowchart TD
    Start([update 调用]) --> CheckCount{"任务数量<br/>> 20?"}

    CheckCount -->|"是"| Error1["抛出异常:<br/>Max 20 todos"]
    CheckCount -->|"否"| Init["初始化 validated = []"]

    Init --> InitCount["in_progress_count = 0"]
    InitCount --> ForLoop["遍历 items"]

    ForLoop --> ExtractText["提取并验证 text"]
    ExtractText --> CheckText{"text<br/>为空?"}

    CheckText -->|"是"| Error2["抛出异常:<br/>text required"]
    CheckText -->|"否"| ExtractStatus["提取并验证 status"]

    ExtractStatus --> CheckStatus{"status<br/>合法?"}

    CheckStatus -->|"否"| Error3["抛出异常:<br/>invalid status"]
    CheckStatus -->|"是"| CheckProgress{"status<br/>== in_progress?"}

    CheckProgress -->|"是"| IncCount["in_progress_count++"]
    CheckProgress -->|"否"| Append
    IncCount --> Append["validated.append()"]

    Append --> ForLoop
    ForLoop -->|"完成"| CheckProgressCount{"in_progress_count<br/>> 1?"}

    CheckProgressCount -->|"是"| Error4["抛出异常:<br/>Only one task<br/>can be in_progress"]
    CheckProgressCount -->|"否"| UpdateItems["self.items = validated"]

    UpdateItems --> Render["return render()"]
    Render --> Done([返回格式化列表])

    style CheckCount fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style CheckStatus fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style CheckProgressCount fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

---

## 4. 任务渲染流程 (render 方法)

```mermaid
flowchart TD
    Start([render 调用]) --> CheckEmpty{"items<br/>为空?"}

    CheckEmpty -->|"是"| ReturnEmpty["返回: No todos."]
    CheckEmpty -->|"否"| InitLines["lines = []"]

    InitLines --> ForLoop["遍历 items"]
    ForLoop --> GetMarker["获取状态标记"]

    GetMarker --> Map["{<br/>pending: [ ]<br/>in_progress: [>]<br/>completed: [x]<br/>}"]

    Map --> FormatLine["格式化任务行<br/>marker #id: text"]
    FormatLine --> AppendLine["lines.append()"]

    AppendLine --> ForLoop
    ForLoop -->|"完成"| CountDone["统计已完成任务"]

    CountDone --> AppendProgress["添加进度统计"]
    AppendProgress --> Join["用换行符连接"]

    Join --> ReturnList([返回格式化列表])

    style Map fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 5. 提醒机制流程

```mermaid
flowchart TD
    Start([工具调用处理]) --> ExecTools["执行工具"]
    ExecTools --> InitUsed["used_todo = False"]

    InitUsed --> ForLoop["遍历工具调用"]
    ForLoop --> CheckTodo{"工具名称<br/>== todo?"}

    CheckTodo -->|"是"| SetUsed["used_todo = True"]
    CheckTodo -->|"否"| Next

    SetUsed --> Next
    Next --> ForLoop

    ForLoop -->|"完成"| UpdateCounter["rounds_since_todo =<br/>0 if used_todo<br/>else +1"]

    UpdateCounter --> CheckThreshold{"rounds_since_todo<br/>>= 3?"}

    CheckThreshold -->|"是"| Inject["插入提醒消息<br/>results.insert(0)"]
    CheckThreshold -->|"否"| Append

    Inject --> Append["messages.append(results)"]
    Append --> NextLoop([继续循环])

    style CheckThreshold fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style Inject fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 6. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as agent_loop()
    participant L as LLM API
    participant T as TodoManager
    participant H as TOOL_HANDLERS

    U->>A: 输入请求
    A->>A: rounds_since_todo = 0

    loop 代理循环
        A->>L: client.messages.create(tools=TOOLS)
        L-->>A: response (tool_use 块)

        A->>A: messages.append(assistant)

        loop 遍历工具调用
            A->>H: TOOL_HANDLERS.get(tool_name)

            alt todo 工具
                A->>T: TODO.update(items)
                T->>T: 验证任务数据
                T->>T: 更新 items 列表
                T->>T: render() 格式化
                T-->>A: 格式化列表
                A->>A: used_todo = True
            else 其他工具
                A->>H: handler(**input)
                H-->>A: 输出结果
            end

            A->>A: results.append(tool_result)
        end

        A->>A: 更新计数器

        alt rounds_since_todo >= 3
            A->>A: 注入提醒消息
            Note over A: <reminder>Update todos.</reminder>
        end

        A->>A: messages.append(results)

        alt stop_reason == "tool_use"
            Note over A: 继续循环
        else stop_reason != "tool_use"
            A-->>U: 返回结果
        end
    end
```

---

## 7. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Pending: 创建任务
    Pending --> InProgress: 开始执行
    InProgress --> Pending: 暂停/撤销
    InProgress --> Completed: 完成任务
    Completed --> [*]: 任务结束

    note right of Pending
        状态: pending
        标记: [ ]
        同时可存在多个
    end note

    note right of InProgress
        状态: in_progress
        标记: [>]
        同时只能存在一个
    end note

    note right of Completed
        状态: completed
        标记: [x]
        可存在多个
    end note
```

---

## 8. 提醒机制状态图

```mermaid
stateDiagram-v2
    [*] --> Reset: 使用 todo 工具
    Reset --> Counting: rounds_since_todo = 0

    Counting --> Counting: 每轮 +1
    Counting --> Inject: rounds_since_todo >= 3

    Inject --> Reset: 下次使用 todo 重置
    Inject --> Warning: 继续不更新

    Warning --> Inject: 保持 >= 3

    note right of Counting
        计数器递增阶段
        每轮工具调用后 +1
    end note

    note right of Inject
        触发提醒
        注入 <reminder> 消息
    end note
```

---

## 9. 数据结构

### items 列表结构
```python
items = [
    {
        "id": "1",              # 任务 ID
        "text": "任务描述",      # 任务文本
        "status": "pending"     # 状态: pending | in_progress | completed
    },
    # ... 更多任务
]
```

### todo 工具输入结构
```python
{
    "items": [
        {
            "id": "1",
            "text": "完成登录功能",
            "status": "in_progress"
        },
        {
            "id": "2",
            "text": "编写测试用例",
            "status": "pending"
        }
    ]
}
```

### 渲染输出格式
```
[ ] #1: 任务 A
[>] #2: 任务 B  <- 进行中
[x] #3: 任务 C

(1/3 completed)
```

---

## 10. 关键特性总结

| 特性 | 说明 |
|------|------|
| **自我跟踪** | 代理主动跟踪和更新任务进度 |
| **可视化** | 状态标记 [ ] [>] [x] 让进度一目了然 |
| **约束** | 同时只能有一个 in_progress 任务 |
| **提醒** | 超过 3 轮未更新自动注入提醒 |
| **限制** | 最多 20 个待办事项 |
| **验证** | 验证任务数据的合法性 |
