# S05 Skill Loading - 技能按需加载流程图

本文档描述 `s05_skill_loading.py` 的技能按需加载机制和执行流程。

---

## 1. 系统架构概览

```mermaid
graph TB
    subgraph SystemPrompt["系统提示词 (Layer 1)"]
        SP["技能列表<br/>- pdf: ...<br/>- code-review: ..."]
    end

    subgraph SkillFiles["技能文件系统"]
        PDF["skills/pdf/SKILL.md"]
        Review["skills/code-review/SKILL.md"]
        Front["YAML frontmatter<br/>name, description, tags"]
        Body["技能正文<br/>详细步骤"]
    end

    subgraph Loader["SkillLoader"]
        LoadAll["_load_all()"]
        Parse["_parse_frontmatter()"]
        Desc["get_descriptions()"]
        Content["get_content()"]
    end

    subgraph Agent["代理执行"]
        LLM["LLM API"]
        Tool["load_skill 工具"]
    end

    SkillFiles --> Loader
    Loader --> SystemPrompt
    Loader --> Agent
    Agent --> LLM
    LLM -->|"调用 load_skill"| Tool
    Tool --> Content

    style Loader fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Tool fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 2. 两层注入架构

```mermaid
graph LR
    subgraph Layer1["Layer 1: 廉价注入"]
        A["系统提示词<br/>~100 tokens/技能"]
        B["技能名称和描述"]
        C["启动时注入"]
    end

    subgraph Layer2["Layer 2: 按需注入"]
        D["tool_result<br/>完整技能内容"]
        E["调用 load_skill 时"]
        F["动态注入"]
    end

    A -->|"添加到系统提示词"| LLM
    E --> F
    F --> D
    D --> LLM

    style Layer1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Layer2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## 3. 技能文件结构

```mermaid
graph TB
    subgraph SkillFile["SKILL.md 文件结构"]
        Delim1["---"]
        Meta["YAML frontmatter<br/>name: pdf<br/>description: ...<br/>tags: file-processing"]
        Delim2["---"]
        Content["技能正文<br/># PDF 处理<br/>## 步骤 1: ...<br/>## 步骤 2: ..."]
    end

    Delim1 --> Meta
    Meta --> Delim2
    Delim2 --> Content

    style Meta fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style Content fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 4. SkillLoader 类结构

```mermaid
classDiagram
    class SkillLoader {
        +Path skills_dir
        +dict skills
        +__init__(skills_dir)
        +_load_all() void
        +_parse_frontmatter(text) tuple
        +get_descriptions() str
        +get_content(name) str
    }

    class SkillData {
        +str name
        +dict meta
        +str body
        +str path
    }

    SkillLoader "1" --> "*" SkillData : contains
```

---

## 5. 技能加载流程 (_load_all)

```mermaid
flowchart TD
    Start([_load_all 调用]) --> CheckDir{"skills_dir<br/>存在?"}

    CheckDir -->|"否"| Return([直接返回])
    CheckDir -->|"是"| Glob["rglob('SKILL.md')"]

    Glob --> Sort["sorted() 排序"]
    Sort --> ForLoop["遍历所有 SKILL.md"]

    ForLoop --> ReadFile["f.read_text()"]
    ReadFile --> Parse["_parse_frontmatter()"]
    Parse --> GetName["meta.get('name')<br/>或 f.parent.name"]

    GetName --> Store["self.skills[name] =<br/>{meta, body, path}"]
    Store --> ForLoop

    ForLoop -->|"完成"| Done([完成])

    style Parse fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 6. Frontmatter 解析流程 (_parse_frontmatter)

```mermaid
flowchart TD
    Start([_parse_frontmatter]) --> Match["正则匹配<br/>r'^---\n(.*?)\n---\n(.*)'"]

    Match --> CheckMatch{"匹配成功?"}

    CheckMatch -->|"否"| ReturnEmpty["return {}, text"]
    CheckMatch -->|"是"| Extract["提取分组"]

    Extract --> InitMeta["meta = {}"]
    InitMeta --> ForLines["遍历元数据行"]

    ForLines --> CheckColon{"包含 ':' ?"}
    CheckColon -->|"是"| Split["split(':', 1)"]
    Split --> StoreMeta["meta[key] = val"]
    StoreMeta --> ForLines

    ForLines -->|"完成"| ReturnMeta["return meta, body"]

    ReturnMeta --> Done([返回元数据和正文])
    ReturnEmpty --> Done

    style Match fill:#e1f5fe,stroke:#01579b,stroke-width:2px
```

---

## 7. 技能调用时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as 代理
    participant L as LLM API
    participant S as SkillLoader
    participant F as 文件系统

    Note over S: 初始化阶段
    S->>F: 扫描 skills/ 目录
    F-->>S: 所有 SKILL.md 文件
    S->>S: _load_all() 加载所有技能
    S->>S: _parse_frontmatter() 解析元数据
    S->>A: get_descriptions() 返回技能列表

    Note over A: 技能列表注入系统提示词
    A->>A: SYSTEM = f"Skills:\n{descriptions}"

    Note over A: 运行阶段
    U->>A: 输入请求
    A->>L: client.messages.create(tools=TOOLS)

    alt LLM 需要特定技能
        L-->>A: tool_use: load_skill("pdf")
        A->>S: get_content("pdf")
        S->>S: 从 skills 字典获取
        S-->>A: 返回完整技能正文
        A->>A: 注入到 tool_result
        A->>L: 继续对话（含技能内容）
    end

    L-->>A: 最终响应
    A-->>U: 返回结果
```

---

## 8. 数据结构

### skills 字典结构
```python
skills = {
    "pdf": {
        "meta": {
            "name": "pdf",
            "description": "Process PDF files...",
            "tags": "file-processing"
        },
        "body": "# PDF 处理\n\n## 步骤 1:...",
        "path": "skills/pdf/SKILL.md"
    },
    "code-review": {
        # ... 类似结构
    }
}
```

### SKILL.md 文件格式
```markdown
---
name: pdf
description: Process PDF files and extract content
tags: file-processing
---

# PDF 处理技能

## 步骤 1: 检查 PDF 是否存在
...

## 步骤 2: 提取文本内容
...
```

### get_descriptions 返回格式
```
  - pdf: Process PDF files and extract content [file-processing]
  - code-review: Review code for best practices [code-quality]
```

### get_content 返回格式
```xml
<skill name="pdf">
# PDF 处理技能

## 步骤 1: 检查 PDF 是否存在
...

## 步骤 2: 提取文本内容
...
</skill>
```

---

## 9. 状态转换图

```mermaid
stateDiagram-v2
    [*] --> Loading: __init__ 调用
    Loading --> Loaded: _load_all 完成

    Loaded --> Idle: 等待请求

    Idle --> Describing: get_descriptions 调用
    Idle --> Retrieving: get_content 调用

    Describing --> Idle: 返回描述
    Retrieving --> Idle: 返回技能内容

    Retrieving --> Error: 技能不存在
    Error --> Idle: 返回错误消息

    note right of Loaded
        所有技能已加载
        元数据和正文已解析
    end note

    note right of Describing
        Layer 1: 廉价操作
        只返回描述信息
    end note

    note right of Retrieving
        Layer 2: 按需加载
        返回完整技能正文
    end note
```

---

## 10. 四大关键特性

| 特性 | 说明 | 优势 |
|------|------|------|
| **延迟加载** | 技能内容不在启动时加载 | 减少 token 消耗 |
| **模块化设计** | 每个技能是独立的文件 | 动态添加、删除、修改 |
| **两层注入** | Layer 1: 元数据 / Layer 2: 完整内容 | 避免系统提示词膨胀 |
| **可扩展性** | 支持大量技能 | 技能可以包含详细步骤 |

---

## 11. 关键特性总结

| 特性 | 说明 |
|------|------|
| **YAML frontmatter** | 技能元数据（name, description, tags） |
| **正则解析** | 使用正则表达式解析 frontmatter |
| **安全获取** | 使用 dict.get() 提供默认值 |
| **XML 包装** | 返回的技能内容用 XML 标签包裹 |

---

## 12. 核心洞察

> **"Don't put everything in the system prompt. Load on demand."**
>
> 不要把所有内容放在系统提示词中。按需加载。
