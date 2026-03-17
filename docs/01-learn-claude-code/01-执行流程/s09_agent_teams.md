# S09 Agent Teams - 代理团队流程图

本文档描述 `s09_agent_teams.py` 的持久化队友机制和团队通信流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph Lead["Lead 代理"]
        LLoop["agent_loop()"]
        LInbox["检查收件箱"]
        LTools["spawn_teammate<br/>list_teammates<br/>send_message<br/>broadcast"]
    end

    subgraph Team["队友 (Teammates)"]
        T1["Alice 线程"]
        T2["Bob 线程"]
        T3["Charlie 线程"]
    end

    subgraph MessageBus["MessageBus"]
        Inbox[".team/inbox/<name>.jsonl"]
        Send["send()"]
        Read["read_inbox()"]
        Broadcast["broadcast()"]
    end

    subgraph Config["团队配置"]
        CFG[".team/config.json<br/>team_name, members"]
    end

    Lead --> MessageBus
    MessageBus --> Team
    Config --> Lead

    style Lead fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Team fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 2. 子代理 vs 队友对比

```mermaid
graph LR
    subgraph Subagent["子代理 (s04)"]
        S1["spawn → execute"]
        S2["return summary"]
        S3["destroyed"]
    end

    subgraph Teammate["队友 (s09)"]
        T1["spawn → work"]
        T2["idle → work"]
        T3["... → shutdown"]
        T4["persistent"]
    end

    S1 -.->|临时| T1
    S3 -.->|持久| T4

    style Subagent fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style Teammate fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 3. MessageBus 类结构

```mermaid
classDiagram
    class MessageBus {
        +Path dir
        +__init__(inbox_dir)
        +send(sender, to, content, msg_type, extra) str
        +read_inbox(name) list
        +broadcast(sender, content, teammates) str
    }

    class InboxFile {
        +str name
        +str type
        +str from
        +str content
        +float timestamp
    }

    MessageBus "1" --> "*" InboxFile : manages
```

---

## 4. 消息发送流程 (send)

```mermaid
flowchart TD
    Start([send 调用]) --> ValidateType{"msg_type<br/>合法?"}

    ValidateType -->|"否"| Error1["返回: Invalid type"]
    ValidateType -->|"是"| BuildMsg["构建消息对象"]

    BuildMsg --> AddType["添加 type 字段"]
    AddType --> AddFrom["添加 from 字段"]
    AddFrom --> AddContent["添加 content 字段"]
    AddContent --> AddTime["添加 timestamp"]

    AddTime --> CheckExtra{"有 extra?"}
    CheckExtra -->|"是"| Merge["msg.update(extra)"]
    CheckExtra -->|"否"| Open

    Merge --> Open["打开收件箱文件"]

    Open --> Append["追加 JSON 行"]
    Append --> Close([返回成功])

    style ValidateType fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style Append fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 5. 收件箱读取流程 (read_inbox)

```mermaid
flowchart TD
    Start([read_inbox 调用]) --> CheckPath{"收件箱<br/>存在?"}

    CheckPath -->|"否"| ReturnEmpty([返回空列表])
    CheckPath -->|"是"| ReadAll["read_text()"]

    ReadAll --> Split["splitlines()"]
    Split --> ForLines["遍历每一行"]

    ForLines --> CheckEmpty{"行非空?"}
    CheckEmpty -->|"是"| Parse["json.loads()"]
    CheckEmpty -->|"否"| ForLines

    Parse --> Append["追加到 messages"]
    Append --> ForLines

    ForLines -->|"完成"| Clear["write_text('')<br/>清空文件"]
    Clear --> ReturnMsg([返回消息列表])

    style Parse fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Clear fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 6. 队友生命周期

```mermaid
stateDiagram-v2
    [*] --> Spawning: Lead 调用 spawn_teammate
    Spawning --> Working: 创建线程并启动

    Working --> Idle: 工作完成
    Working --> Shutdown: 收到关闭请求

    Idle --> Working: 收到新消息
    Idle --> Shutdown: 超时未收到消息

    Shutdown --> [*]: 线程结束

    note right of Working
        status: "working"
        执行工具调用
        处理收件箱消息
    end note

    note right of Idle
        status: "idle"
        等待新消息
        可以被重新激活
    end note

    note right of Shutdown
        status: "shutdown"
        线程结束
        config.json 更新
    end note
```

---

## 7. 完整时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant L as Lead
    participant M as MessageBus
    participant A as Alice (队友)
    participant B as Bob (队友)

    U->>L: spawn_teammate("alice", "coder", "任务描述")

    L->>L: 更新 config.json
    L->>A: 创建线程并启动
    activate A
    A->>A: _teammate_loop() 开始

    loop Alice 工作循环
        A->>M: read_inbox("alice")
        M-->>A: 消息列表（空）

        A->>L: LLM 调用
        L-->>A: response

        alt stop_reason == tool_use
            A->>A: 执行工具
            A->>A: 追加结果
        else stop_reason != tool_use
            A->>A: 进入 idle 状态
            A->>M: read_inbox("alice")
            M-->>A: 收到新消息
            A->>A: 退出 idle
        end
    end

    deactivate A
    A-->>L: 线程结束
    L->>L: 更新 config.json

    Note over A: 队友可以持续工作、进入 idle、或被关闭
```

---

## 8. 数据结构

### .team/config.json 结构
```json
{
  "team_name": "default",
  "members": [
    {
      "name": "alice",
      "role": "coder",
      "status": "idle"
    },
    {
      "name": "bob",
      "role": "reviewer",
      "status": "working"
    }
  ]
}
```

### 收件箱消息结构
```json
{
  "type": "message",
  "from": "lead",
  "content": "消息内容",
  "timestamp": 1678901234.567
}
```

### 消息类型枚举
```python
VALID_MSG_TYPES = {
    "message",
    "broadcast",
    "shutdown_request",      # s10 实现
    "shutdown_response",     # s10 实现
    "plan_approval_response" # s10 实现
}
```

---

## 9. 关键特性总结

|| 特性 | 说明 |
||------|------|
|| **持久化** | 队友状态保存在 config.json |
|| **并行** | 每个队友在独立线程中运行 |
|| **异步通信** | 通过收件箱解耦 |
|| **生命周期** | spawn → working → idle → ... → shutdown |

---

## 10. 核心洞察

> **"Teammates that can talk to each other."**
>
> 可以相互交谈的队友。

---

## 11. 宏观架构理解

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Teams 架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   用户任务: "开发一个用户认证系统"                            │
│                         │                                   │
│                         ▼                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Lead Agent (协调者)                     │   │
│   │  - 拆解任务                                          │   │
│   │  - 分配给队友                                        │   │
│   │  - 汇总结果                                          │   │
│   └──────────────────┬──────────────────────────────────┘   │
│                      │                                      │
│          ┌──────────┼──────────┐                           │
│          ▼          ▼          ▼                           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│   │  Alice   │ │   Bob    │ │  Carol   │                  │
│   │  coder   │ │  tester  │ │ reviewer │                  │
│   │          │ │          │ │          │                  │
│   │ 写代码   │ │ 写测试   │ │ 代码审查 │                  │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘                  │
│        │            │            │                         │
│        └────────────┼────────────┘                         │
│                     ▼                                      │
│   ┌─────────────────────────────────────────────────────┐  │
│   │            Message Bus (JSONL 收件箱)               │  │
│   │                                                     │  │
│   │  alice.jsonl  ←── Bob 发送: "代码已测，请 review"   │  │
│   │  bob.jsonl    ←── Alice 发送: "功能已实现"          │  │
│   │  carol.jsonl  ←── Alice 发送: "请审查 PR #123"      │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 与其他模式对比

|| 模式 | 生命周期 | 通信方式 | 适用场景 |
||------|----------|----------|----------|
|| **Subagent (s04)** | 临时，执行完销毁 | 单向返回结果 | 子任务委托 |
|| **Background Task (s08)** | 后台运行，超时结束 | 通知队列 | 长时间命令 |
|| **Teammate (s09)** | 持久化，反复工作 | 双向消息传递 | 团队协作 |

```
Subagent (s04):     spawn → execute → return → destroyed
                                          (单向，一次)

Background (s08):   spawn → run → timeout/complete
                               ↓
                        notification queue

Teammate (s09):     spawn → work → idle → work → ... → shutdown
                                    ↑________↓
                                    (双向，持续)
```

---

## 12. 通信机制详解

### 核心难点：Agent 间通信

Agent Teams 的核心挑战是如何让多个独立运行的 Agent 之间可靠地通信。

### 解决方案：JSONL 文件收件箱

```
.team/inbox/
├── alice.jsonl   # Alice 的收件箱
├── bob.jsonl     # Bob 的收件箱
└── lead.jsonl    # Lead 的收件箱
```

### 消息格式

```json
{
  "type": "message",           # 消息类型
  "from": "alice",             # 发送者
  "to": "bob",                 # 接收者
  "content": "代码完成了，请测试",
  "timestamp": 1773727965.123
}
```

### Drain 模式读取（关键设计）

```python
def read_inbox(name):
    """
    读取并清空收件箱（Drain 模式）
    
    关键点：
    1. 读取所有消息
    2. 清空文件
    3. 返回消息列表
    
    这样确保消息不会被重复处理
    """
    messages = [json.loads(l) for l in file.readlines()]
    file.truncate(0)  # 清空文件
    return messages
```

### 为什么用 JSONL 文件？

|| 方案 | 优点 | 缺点 |
||------|------|------|
|| **内存队列** | 快速 | 进程重启丢失 |
|| **数据库** | 可靠 | 复杂，需要额外依赖 |
|| **JSONL 文件** | 简单、持久化、可调试 | 并发写入需注意 |

JSONL 的优势：
1. **可持久化** - 进程重启不丢失消息
2. **可调试** - 可以直接查看文件内容
3. **简单** - 无需额外依赖
4. **追加写入** - 天然支持消息队列

---

## 13. 核心价值

### 单 Agent vs Agent Teams

```
单 Agent 模式:
┌─────────────────────────────────────┐
│            一个大脑                  │
│  ┌─────────────────────────────┐    │
│  │ 处理所有任务                 │    │
│  │ - 需求分析                  │    │
│  │ - 编码                      │    │
│  │ - 测试                      │    │
│  │ - 部署                      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
问题：容易出错、效率低、难以并行

Agent Teams 模式:
┌─────────────────────────────────────┐
│           多个专业大脑               │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │  Alice  │ │   Bob   │ │ Carol  │ │
│  │  专注   │ │  专注   │ │ 专注   │ │
│  │  编码   │ │  测试   │ │ 审查   │ │
│  └─────────┘ └─────────┘ └────────┘ │
│       ↓           ↓          ↓      │
│      ─────────────────────────      │
│               消息总线              │
└─────────────────────────────────────┘
优势：专业分工、并行执行、互相协作
```

### 本质

> **用架构解决复杂度**
>
> 将大任务拆分，让专业 Agent 并行处理，通过消息总线协调。

---

## 14. 实践建议

### 何时使用 Agent Teams

1. **任务可拆分** - 大任务可以分解为独立子任务
2. **需要并行** - 多个子任务可以同时进行
3. **专业分工** - 不同子任务需要不同专业技能
4. **需要协作** - Agent 之间需要通信协调

### 示例场景

|| 场景 | 队友角色 | 协作方式 |
||------|----------|----------|
|| 软件开发 | coder, tester, reviewer | coder→tester→reviewer |
|| 数据分析 | collector, analyzer, visualizer | collector→analyzer→visualizer |
|| 内容创作 | researcher, writer, editor | researcher→writer→editor |
|| 客服系统 | triage, specialist, followup | triage→specialist→followup |

---

## 15. 消息流转完整流程

### 15.1 文件流转机制

```
.team/inbox/ 目录结构：

alice.jsonl  ←─── 其他人发送给 Alice 的消息
bob.jsonl    ←─── 其他人发送给 Bob 的消息
carol.jsonl  ←─── 其他人发送给 Carol 的消息
lead.jsonl   ←─── 其他人发送给 Lead 的消息

消息写入：追加模式 (append)
消息读取：Drain 模式 (读取后清空)
```

### 15.2 完整时序图：从任务开始到结束

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant L as Lead
    participant A as Alice (coder)
    participant B as Bob (tester)
    participant C as Carol (reviewer)
    participant MB as MessageBus<br/>(JSONL文件)

    %% ===== 阶段1: 创建团队 =====
    rect rgb(230, 245, 255)
        Note over U,MB: 阶段1: 创建团队
        U->>L: "开发登录功能"
        L->>L: 拆解任务
        L->>A: spawn_teammate("alice", "coder", "实现登录")
        activate A
        L->>B: spawn_teammate("bob", "tester", "测试登录")
        activate B
        L->>C: spawn_teammate("carol", "reviewer", "审查代码")
        activate C
    end

    %% ===== 阶段2: 并行工作 =====
    rect rgb(255, 245, 230)
        Note over A,C: 阶段2: 并行工作与轮询等待

        loop Alice 工作循环
            A->>A: 编写登录代码
            A->>A: 调用 LLM 分析需求
            A->>A: 执行 write_file 工具
        end

        loop Bob 轮询等待
            B->>MB: read_inbox("bob")
            MB-->>B: [空]
            Note right of B: 空闲等待 1 秒
            B->>MB: read_inbox("bob")
        end

        loop Carol 轮询等待
            C->>MB: read_inbox("carol")
            MB-->>C: [空]
            Note right of C: 空闲等待 1 秒
        end
    end

    %% ===== 阶段3: 消息传递 =====
    rect rgb(245, 255, 230)
        Note over A,MB: 阶段3: 消息传递链

        A->>A: 代码完成，准备通知 Bob
        A->>MB: send_message("bob", "登录功能已实现")
        Note right of MB: 写入 bob.jsonl

        B->>MB: read_inbox("bob")
        MB-->>B: [{"from":"alice","content":"登录功能已实现"}]
        Note right of MB: 读取并清空 bob.jsonl

        B->>B: 调用 LLM 分析消息
        B->>B: 执行测试

        B->>MB: send_message("carol", "测试通过，请审查")
        Note right of MB: 写入 carol.jsonl

        C->>MB: read_inbox("carol")
        MB-->>C: [{"from":"bob","content":"测试通过"}]

        C->>C: 执行代码审查
    end

    %% ===== 阶段4: 结果汇总 =====
    rect rgb(255, 240, 245)
        Note over C,L: 阶段4: 结果汇总

        C->>MB: send_message("lead", "审查通过，可以部署")
        Note right of MB: 写入 lead.jsonl

        L->>MB: read_inbox("lead")
        MB-->>L: [{"from":"carol","content":"审查通过"}]

        L->>U: 任务完成：登录功能已就绪
    end

    %% ===== 阶段5: 进入轮询等待 =====
    rect rgb(240, 240, 240)
        Note over A,C: 阶段5: 所有 Agent 进入 idle 轮询

        loop Alice idle 轮询
            A->>MB: read_inbox("alice")
            MB-->>A: [空]
            Note right of A: sleep(1) 继续轮询
        end

        loop Bob idle 轮询
            B->>MB: read_inbox("bob")
            MB-->>B: [空]
            Note right of B: sleep(1) 继续轮询
        end

        loop Carol idle 轮询
            C->>MB: read_inbox("carol")
            MB-->>C: [空]
            Note right of C: sleep(1) 继续轮询
        end
    end

    deactivate A
    deactivate B
    deactivate C
```

### 15.3 轮询机制详解

```mermaid
sequenceDiagram
    autonumber
    participant Agent as 队友线程
    participant Inbox as 收件箱(.jsonl)
    participant LLM as LLM API

    loop 每轮循环 (最多50轮)
        Agent->>Inbox: read_inbox(name)
        Inbox-->>Agent: 消息列表

        alt 收件箱为空
            Note right of Agent: 无新消息
            Agent->>Agent: time.sleep(1)
            Note right of Agent: 等待1秒后继续下一轮
        else 收件箱有消息
            Note right of Agent: 有新消息，进入工作状态
            Agent->>Agent: status = "working"
            Agent->>Agent: 注入消息到对话历史

            Agent->>LLM: chat.completions.create()
            LLM-->>Agent: 响应 + 工具调用

            alt 有工具调用
                Agent->>Agent: 执行工具 (如 send_message)
                Agent->>Agent: 继续下一轮处理结果
            else 无工具调用
                Note right of Agent: 任务处理完毕
                Agent->>Agent: status = "idle"
                Agent->>Agent: time.sleep(2)
                Note right of Agent: 等待2秒后继续轮询
            end
        end
    end

    Note over Agent: 达到50轮或收到shutdown，线程结束
```

### 15.4 消息写入与读取流程

```mermaid
flowchart TB
    subgraph 发送方["发送方 (Alice)"]
        A1["send_message(to='bob', content='...')"]
        A2["构建消息对象<br/>{type, from, content, timestamp}"]
        A3["打开 bob.jsonl<br/>追加写入 JSON 行"]
    end

    subgraph 文件["JSONL 文件"]
        F1["bob.jsonl"]
        F2["{\"from\":\"alice\",<br/>\"content\":\"...\",<br/>\"timestamp\":...}"]
    end

    subgraph 接收方["接收方 (Bob)"]
        B1["read_inbox('bob')"]
        B2["读取所有行<br/>解析 JSON"]
        B3["清空文件 (Drain)"]
        B4["返回消息列表"]
        B5["注入到对话历史"]
    end

    A1 --> A2 --> A3
    A3 --> F1
    F1 --> F2
    F2 --> B1
    B1 --> B2 --> B3 --> B4 --> B5

    style 发送方 fill:#e3f2fd,stroke:#1565c0
    style 文件 fill:#fff3e0,stroke:#ef6c00
    style 接收方 fill:#e8f5e9,stroke:#2e7d32
```

### 15.5 单个 Agent 状态转换

```mermaid
stateDiagram-v2
    [*] --> Working: spawn_teammate()

    Working --> Working: 执行工具调用
    Working --> Idle: 无工具调用<br/>消息处理完毕

    Idle --> Working: read_inbox() 有新消息
    Idle --> Idle: read_inbox() 为空<br/>sleep(1) 继续

    Working --> Shutdown: 达到50轮上限
    Idle --> Shutdown: 收到 shutdown 消息
    Shutdown --> [*]: 线程结束

    note right of Working
        状态: "working"
        行为: 调用LLM、执行工具、发送消息
    end note

    note right of Idle
        状态: "idle"
        行为: 每秒轮询收件箱
              等待新消息
    end note

    note right of Shutdown
        状态: "shutdown"
        行为: 线程终止
              config.json 更新
    end note
```

### 15.6 时间线视图

```
时间 →
──────────────────────────────────────────────────────────────────────────────

T0   用户输入任务
     │
T1   Lead 拆解任务，spawn 三个队友
     │
     ├──► Alice 线程启动 ──► [工作: 编码] ──► [完成] ──► send_message(bob) ──► [idle/轮询]
     │                                                        │
T2   │                                                        ▼ 写入
     │                                              bob.jsonl: [{from:alice, ...}]
     │                                                        │
     ├──► Bob 线程启动 ──► [idle/轮询] ──► [idle/轮询] ──► [读取消息] ──► [工作: 测试]
     │                                                        │
T3   │                                                        ▼
     │                                                    [完成] ──► send_message(carol)
     │                                                                  │
T4   │                                                                  ▼ 写入
     │                                                        carol.jsonl: [{from:bob, ...}]
     │                                                                  │
     ├──► Carol 线程启动 ──► [idle/轮询] ──► [idle/轮询] ──► [读取消息] ──► [工作: 审查]
     │                                                                  │
T5   │                                                                  ▼
     │                                                    [完成] ──► send_message(lead)
     │                                                                  │
T6   │                                                                  ▼
     │                                                        lead.jsonl: [{from:carol, ...}]
     │                                                                  │
     └──► Lead 读取消息 ◄───────────────────────────────────────────────┘
              │
T7           ▼
        汇总结果，通知用户

T8   所有 Agent 进入 idle 轮询状态，等待新任务...
     Alice: [check]→空→sleep→[check]→空→sleep→...
     Bob:   [check]→空→sleep→[check]→空→sleep→...
     Carol: [check]→空→sleep→[check]→空→sleep→...
```

### 15.7 关键参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| 最大循环轮数 | 50 | 防止无限循环，每个 Agent 最多执行 50 轮 |
| 空闲轮询间隔 | 1秒 | 收件箱为空时，等待 1 秒后继续检查 |
| 忙碌后间隔 | 2秒 | 处理完消息无工具调用时，等待 2 秒后继续 |
| 最大 Token | 8000 | LLM 响应的最大 token 数 |

### 15.8 Drain 模式保证

```python
# read_inbox 的原子性操作

def read_inbox(name):
    """
    Drain 模式：读取后立即清空

    保证：
    1. 消息只被处理一次
    2. 不会丢失消息（先读后清）
    3. 线程安全（单线程处理单个收件箱）
    """
    # Step 1: 读取所有消息
    messages = []
    with open(inbox_file, "r") as f:
        for line in f:
            messages.append(json.loads(line))

    # Step 2: 清空文件
    with open(inbox_file, "w") as f:
        pass  # truncate to 0

    # Step 3: 返回消息
    return messages
```

**要点：**
- 同一时刻只有一个线程读取特定收件箱（每个 Agent 只读取自己的收件箱）
- 读取和清空是连续操作，不会被中断
- 消息不会重复处理，也不会丢失
