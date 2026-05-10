# S02 Tool Use - 工具分发流程图

本文档描述 `s02_tool_use.py` 的工具分发机制和执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph LLM["LLM API"]
        Req["请求<br/>tools=TOOL_LIST"]
        Resp["响应<br/>tool_use 块"]
    end

    subgraph Dispatch["工具分发 (TOOL_HANDLERS)"]
        Map["{<br/>bash: run_bash<br/>read_file: run_read<br/>write_file: run_write<br/>edit_file: run_edit<br/>}"]
    end

    subgraph Handlers["处理函数"]
        Bash["run_bash()"]
        Read["run_read()"]
        Write["run_write()"]
        Edit["run_edit()"]
    end

    subgraph Files["文件系统"]
        File1["文件读写"]
        File2["文件编辑"]
    end

    Req --> LLM
    LLM --> Resp
    Resp -->|"tool_name"| Map
    Map -->|"bash"| Bash
    Map -->|"read_file"| Read
    Map -->|"write_file"| Write
    Map -->|"edit_file"| Edit

    Read --> File1
    Write --> File1
    Edit --> File2

    style Dispatch fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Map fill:#b3e5fc,stroke:#0277bd,stroke-width:2px
```

---

## 2. 工具分发流程 (Dispatch Pattern)

```mermaid
flowchart TD
    Start([LLM 返回 tool_use]) --> Extract["提取 tool_name 和 input"]
    Extract --> Lookup["TOOL_HANDLERS.get(tool_name)"]

    Lookup --> Check{"处理函数<br/>存在?"}

    Check -->|"是"| CallHandler["handler(**input)"]
    Check -->|"否"| Error["返回: Unknown tool"]

    CallHandler --> Exec["执行处理函数"]
    Exec --> BuildResult["构建 tool_result"]
    Error --> BuildResult

    BuildResult --> Append["results.append()"]
    Append --> Next["下一个工具调用"]
    Next --> Done([完成])

    style Lookup fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style Check fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 3. 工具执行流程

```mermaid
flowchart TD
    subgraph BashTool["bash 工具"]
        B1["kw['command']"] --> B2["run_bash(command)"]
        B2 --> B3["subprocess.run()"]
        B3 --> B4["返回输出"]
    end

    subgraph ReadTool["read_file 工具"]
        R1["kw['path']"] --> R2["kw.get('limit')"]
        R2 --> R3["run_read(path, limit)"]
        R3 --> R4["safe_path()"]
        R4 --> R5["read_text()"]
        R5 --> R6["返回内容"]
    end

    subgraph WriteTool["write_file 工具"]
        W1["kw['path']"] --> W2["kw['content']"]
        W2 --> W3["run_write(path, content)"]
        W3 --> W4["safe_path()"]
        W4 --> W5["mkdir(exist_ok=True)"]
        W5 --> W6["write_text()"]
        W6 --> W7["返回字节数"]
    end

    subgraph EditTool["edit_file 工具"]
        E1["kw['path', 'old_text', 'new_text']"] --> E2["run_edit()"]
        E2 --> E3["read_text()"]
        E3 --> E4["replace(old, new, 1)"]
        E4 --> E5["write_text()"]
        E5 --> E6["返回 Edited 确认"]
    end
```

---

## 4. 代理主循环流程（集成分发）

```mermaid
flowchart TD
    Start([agent_loop 开始]) --> CallLLM["client.messages.create()"]
    CallLLM --> AppendResp["messages.append(assistant)"]
    AppendResp --> CheckStop{"stop_reason<br/>== 'tool_use'?"}

    CheckStop -->|"否"| Return([返回])
    CheckStop -->|"是"| InitResults["results = []"]

    InitResults --> ForLoop["遍历 response.content"]
    ForLoop --> IsTool{"block.type<br/>== 'tool_use'?"}

    IsTool -->|"否"| ForLoop
    IsTool -->|"是"| GetHandler["TOOL_HANDLERS.get(name)"]

    GetHandler --> HasHandler{"handler<br/>存在?"}

    HasHandler -->|"是"| ExecFunc["handler(**input)"]
    HasHandler -->|"否"| Unknown["Unknown tool: {name}"]

    ExecFunc --> PrintOut["打印输出<br/>(前200字符)"]
    Unknown --> PrintOut

    PrintOut --> AppendResult["results.append(<br/>tool_result)"]
    AppendResult --> ForLoop

    ForLoop -->|"完成"| AppendResults["messages.append(results)"]
    AppendResults --> Loop(["继续循环"])

    Loop --> CallLLM

    style GetHandler fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style HasHandler fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 5. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as agent_loop()
    participant L as LLM API
    participant D as TOOL_HANDLERS
    participant H as 处理函数
    participant F as 文件系统

    U->>A: 输入请求
    A->>A: messages.append(user_msg)

    loop 代理循环
        A->>L: client.messages.create(tools=TOOLS)
        L-->>A: response (tool_use 块)

        A->>A: messages.append(assistant)

        loop 遍历工具调用
            A->>D: TOOL_HANDLERS.get(tool_name)
            D-->>A: handler 函数

            alt handler 存在
                A->>H: handler(**input)
                alt 文件操作
                    H->>F: safe_path() + 读写操作
                    F-->>H: 文件内容/确认
                end
                H-->>A: 输出结果
            else handler 不存在
                A-->>A: "Unknown tool: {name}"
            end

            A->>A: results.append(tool_result)
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

## 6. 数据结构

### TOOL_HANDLERS 分发映射
```python
TOOL_HANDLERS = {
    "bash":       lambda **kw: run_bash(kw["command"]),
    "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
    "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
    "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"], kw["new_text"]),
}
```

### TOOLS 工具定义
```python
TOOLS = [
    {
        "name": "bash",
        "description": "Run a shell command.",
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string"}},
            "required": ["command"]
        }
    },
    # ... 其他工具
]
```

### tool_use 块结构
```python
ContentBlock(
    type="tool_use",
    id="toolu_xxx",
    name="read_file",           # 工具名称
    input={"path": "file.txt"}  # 输入参数
)
```

### tool_result 对象结构
```python
{
    "type": "tool_result",
    "tool_use_id": "toolu_xxx",
    "content": "文件内容或错误消息"
}
```

---

## 7. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Dispatching: LLM 返回 tool_use

    Dispatching --> Lookup: 查找处理函数
    Lookup --> Executing: handler 存在
    Lookup --> Error: handler 不存在

    Executing --> Success: 执行成功
    Executing --> Failure: 执行失败

    Success --> Building: 构建 tool_result
    Error --> Building: 返回错误消息
    Failure --> Building: 返回异常信息

    Building --> Next: 下一个工具调用

    Next --> Dispatching: 还有工具调用
    Next --> Done: 所有工具完成

    Done --> [*]: 返回结果

    note right of Dispatching
        分发阶段：
        通过 TOOL_HANDLERS
        字典路由
    end note

    note right of Executing
        执行阶段：
        调用实际处理函数
        可能涉及文件操作
    end note
```

---

## 8. Lambda 函数语法说明

```mermaid
graph LR
    subgraph Syntax["Lambda 函数语法"]
        A["lambda **kw: fn(kw['arg'])"]
    end

    subgraph Breakdown["解析"]
        B1["lambda"] --> B2["**kw"]
        B2 --> B3[":"]
        B3 --> B4["fn(kw['arg'])"]
    end

    subgraph Example["示例"]
        E1["lambda **kw: run_read(kw['path'],<br/>kw.get('limit'))"]
    end

    A --> Breakdown
    Breakdown --> Example

    style Syntax fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

### Lambda 各部分说明
| 部分 | 说明 | 示例 |
|------|------|------|
| `lambda` | 匿名函数关键字 | 定义一个无名函数 |
| `**kw` | 接收任意关键字参数 | 将参数打包成字典 |
| `:` | 分隔符 | 分隔参数和函数体 |
| `fn(kw['arg'])` | 函数体 | 调用实际处理函数 |

---

## 9. 关键特性总结

| 特性 | 说明 |
|------|------|
| **解耦架构** | 工具定义与处理逻辑通过字典映射分离 |
| **可扩展性** | 添加新工具只需在字典中添加条目 |
| **类型安全** | 通过 input_schema 定义参数结构 |
| **错误处理** | 未知工具返回友好的错误消息 |
| **Lambda 匿名函数** | 使用 lambda 函数简化分发逻辑 |
| **安全路径检查** | 所有文件操作都经过 safe_path 验证 |
