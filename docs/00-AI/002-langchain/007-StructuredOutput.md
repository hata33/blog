## 🎯 Structured Output 心智模型

**核心本质**：将 LLM 的非结构化自然语言输出，转换为应用程序可直接使用的类型化数据结构。

```
传统方式：LLM → "用户叫张三，邮箱zhang@example.com" → 正则/JSON解析 → 脆弱
结构化：LLM → Pydantic/TypedDict 验证 → 强类型对象 → 可靠
```

---

## 📊 两种策略

| 策略 | 原理 | 适用模型 | 可靠性 |
|-----|------|---------|-------|
| **ProviderStrategy** | 模型原生API支持（如OpenAI的`response_format`） | GPT-4o、Claude-3、Grok | 最高 |
| **ToolStrategy** | 通过工具调用（tool calling）模拟 | 支持工具调用的任何模型 | 高 |

**自动选择**：直接传`response_format=MyModel`，框架自动选策略。

---

## 🔧 支持的类型

- **Pydantic BaseModel** → 返回验证后的实例
- **Dataclass** → 返回dict
- **TypedDict** → 返回dict  
- **JSON Schema dict** → 返回dict
- **Union类型** → 多选一，模型自动判断

---

## ⚡ 关键特性

### 1. 自动验证与重试
- 类型错误 → 自动重试并反馈错误信息
- 多输出冲突 → 提示选择单一输出
- `handle_errors` 可自定义策略

### 2. 与Tools并存
- 支持同时使用工具 + 结构化输出
- 需模型同时支持两者

### 3. 输出位置
- 最终状态中的 `structured_response` 键

---

## 🎯 场景速查

| 场景 | 推荐方式 | 返回值类型 |
|-----|---------|-----------|
| 信息抽取（联系人、产品） | Pydantic | 实例（自动验证） |
| 分类/情感分析 | Literal枚举 | 类型安全 |
| 多模态输入 | Union类型 | 动态适配 |
| 快速原型 | TypedDict | 轻量+类型提示 |
| 工具调用项目 | ToolStrategy | 显式控制 |

---

## 💡 一句话总结

> **用类型定义替代字符串解析，让AI输出像函数返回值一样可靠。**

## 🎯 ProviderStrategy（原生结构化）

**Prompt**：
```
实现信息抽取 Agent，使用 Pydantic 定义输出 Schema，response_format 直接传入模型类，
框架自动选择 ProviderStrategy。输出存入 structured_response 键。
```

**代码特征**：
```python
class ContactInfo(BaseModel):
    name: str = Field(description="姓名")
    email: str = Field(description="邮箱")

agent = create_agent(model="gpt-4o", response_format=ContactInfo)
result = agent.invoke({"messages": [...]})
data = result["structured_response"]  # ContactInfo实例
```

---

## 🔧 ToolStrategy（工具调用回退）

**Prompt**：
```
实现产品评价分析 Agent，模型不支持原生结构化输出时，显式使用 ToolStrategy
通过工具调用实现结构化，配置自定义错误消息。
```

**代码特征**：
```python
class ProductReview(BaseModel):
    rating: int = Field(ge=1, le=5)
    sentiment: Literal["positive", "negative"]
    key_points: list[str]

agent = create_agent(
    model="gpt-3.5-turbo",
    response_format=ToolStrategy(
        schema=ProductReview,
        tool_message_content="评价已分析完成",
        handle_errors="请提供1-5星评分和情感标签"
    )
)
```

---

## 🔀 Union Schema（多类型输出）

**Prompt**：
```
实现客服工单分类 Agent，输出可能是产品评价或客户投诉，
使用 Union 类型让模型根据内容自动选择最合适的 Schema。
```

**代码特征**：
```python
class ProductReview(BaseModel):
    rating: int
    sentiment: Literal["positive", "negative"]

class CustomerComplaint(BaseModel):
    issue_type: Literal["product", "shipping", "billing"]
    severity: Literal["low", "medium", "high"]

agent = create_agent(
    model="gpt-4o",
    response_format=ToolStrategy(Union[ProductReview, CustomerComplaint])
)
```

---

## 🛡️ 错误处理定制

**Prompt**：
```
实现健壮的结构化输出 Agent，配置 handle_errors 为自定义函数，
区分验证错误和多输出错误，返回不同提示引导模型修正。
```

**代码特征**：
```python
def custom_error_handler(error: Exception) -> str:
    if isinstance(error, StructuredOutputValidationError):
        return "格式错误，请检查字段类型"
    elif isinstance(error, MultipleStructuredOutputsError):
        return "只能返回一个结果，选择最相关的"
    return f"错误: {error}"

agent = create_agent(
    model="gpt-4o",
    response_format=ToolStrategy(
        schema=Union[ContactInfo, EventDetails],
        handle_errors=custom_error_handler
    )
)
```

---

## 📦 不同 Schema 类型

**Prompt**：
```
实现灵活的结构化输出，支持 Pydantic/Dataclass/TypedDict/JSON Schema
四种定义方式，根据项目类型系统选择最合适的。
```

**代码特征**：
```python
# Pydantic（推荐：自动验证）
class Task(BaseModel):
    name: str; priority: int

# Dataclass（轻量）
@dataclass
class Task:
    name: str; priority: int

# TypedDict（类型提示）
class Task(TypedDict):
    name: str; priority: int

# JSON Schema（跨语言）
task_schema = {"type": "object", "properties": {...}}
```

---

## 🧩 与 Tools 并存

**Prompt**：
```
实现增强型 Agent，同时配置业务工具（查数据库）和结构化输出 Schema，
Agent 可先调用工具获取数据，再输出结构化结果。
```

**代码特征**：
```python
@tool
def fetch_user(user_id: str) -> dict:
    """查询用户信息"""
    return {"name": "张三", "email": "zhang@example.com"}

class UserReport(BaseModel):
    user_name: str
    email: str
    summary: str

agent = create_agent(
    model="gpt-4o",
    tools=[fetch_user],
    response_format=UserReport  # 工具后输出结构化
)
```