## 🎯 Custom Middleware 心智模型

**核心本质**：在 Agent 执行流程的固定节点插入自定义逻辑的钩子系统。

---

## 📊 两种钩子类型

| 类型 | 执行方式 | 适用场景 |
|-----|---------|---------|
| **Node-style** | 顺序执行，返回 dict 更新状态 | 日志、验证、状态修改 |
| **Wrap-style** | 嵌套执行，可控制是否调用 handler | 重试、缓存、降级、动态配置 |

---

## 🔧 钩子速查

| 钩子 | 触发时机 | 可做的操作 |
|-----|---------|-----------|
| `before_agent` | Agent 启动前（一次） | 初始化、前置检查 |
| `before_model` | 每次 LLM 调用前 | 修改 state、注入消息、短路 |
| `wrap_model_call` | 包裹 LLM 调用 | 重试、动态模型/工具/提示词 |
| `after_model` | LLM 响应后 | 记录、验证、修改响应 |
| `wrap_tool_call` | 包裹工具调用 | 监控、重试、权限控制 |
| `after_agent` | Agent 完成后（一次） | 清理、汇总 |

---

## 💡 关键特性

1. **状态更新**：Node-style 返回 dict，Wrap-style 返回 `Command(update=...)`
2. **短路跳转**：返回 `{"jump_to": "end"}` 提前退出
3. **动态模型/工具**：`request.override(model=..., tools=...)`
4. **执行顺序**：before 正序，after 倒序，wrap 嵌套

---

## ✅ 一句话总结

**Middleware = 在 Agent 执行管道中插入自定义逻辑，可读 state、写 state、短路退出、动态修改模型/工具/提示词。**


## 🎯 生产级 Custom Middleware Vibecoding 提示词

### 通用模板

```
实现 Custom Middleware：[功能描述]

【钩子选择】
- 使用 [before_agent/before_model/after_model/after_agent/wrap_model_call/wrap_tool_call]
- 原因：[说明为什么选这个钩子]

【状态定义】（如需要）
class CustomState(AgentState):
    [字段名]: NotRequired[类型]

【核心逻辑】
- 输入：从 state/runtime/request 获取 [具体数据]
- 处理：[做什么]
- 输出：返回 dict / Command / ExtendedModelResponse / None

【错误处理】
- try/except 包裹，异常时记录日志并返回 None（降级）
- 超时控制：耗时操作设置 timeout=0.5s

【可观测】
- 入口 DEBUG 日志：[关键参数]
- 出口 INFO 日志：耗时、结果摘要
- 从 runtime.context 获取 request_id 透传

【测试验收】
- 单元测试覆盖正常/异常路径
- 执行耗时 P99 < 50ms（纯逻辑）/ < 500ms（含LLM调用）
```

---

### 场景专项提示词

**缓存中间件**：
```
实现 wrap_model_call 缓存中间件：
- before：根据请求内容生成 cache_key，命中则直接返回缓存响应（短路）
- after：未命中时保存响应到缓存，TTL=3600s
- 使用 redis，异常时降级放行
```

**动态模型选择**：
```
实现 wrap_model_call 动态模型中间件：
- 根据 state["messages"] 长度选择模型：<10条用 gpt-4o-mini，否则 gpt-4o
- 使用 request.override(model=selected_model)
- 记录模型选择决策到 state["selected_model"]
```

**动态工具过滤**：
```
实现 wrap_model_call 工具过滤中间件：
- 根据 runtime.context["user_tier"] 过滤可用工具
- basic 用户：只保留 search、calculator
- pro 用户：保留全部工具
- 使用 request.override(tools=filtered_tools)
```

**限流中间件**：
```
实现 before_model 限流中间件：
- 基于 runtime.context["user_id"] 做滑动窗口限流
- 配置：每分钟最多10次，超出返回 {"jump_to": "end"}
- 使用 redis 原子操作，异常时放行（fail-open）
```

**提示词注入中间件**：
```
实现 wrap_model_call 提示词动态注入：
- 从 state 获取 user_language，动态追加系统提示
- 使用 request.system_message.content_blocks 追加新 block
- 返回 request.override(system_message=new_system_message)
```

**工具调用监控**：
```
实现 wrap_tool_call 监控中间件：
- 打印工具名、参数、耗时
- 记录到 state["tool_call_logs"] 数组
- 异常时记录错误并重新抛出（不吞异常）
```

**早停中间件**：
```
实现 after_model 早停中间件：
- 检测 AI 响应中是否包含 "[DONE]"
- 包含时返回 {"jump_to": "end"} 提前结束
- 同时注入结束标记消息
```

**状态累积中间件**：
```
实现 before_model + after_model 中间件：
- 定义 CustomState { call_count: NotRequired[int], total_tokens: NotRequired[int] }
- before_model: call_count +1
- after_model: 累加 usage_metadata["total_tokens"]
- 两个钩子共享 state 字段
```

---

## 📋 代码模板

```python
# 装饰器版（单钩子）
from langchain.agents.middleware import before_model, AgentState
from langgraph.runtime import Runtime

@before_model
def my_middleware(state: AgentState, runtime: Runtime) -> dict | None:
    try:
        # 逻辑
        return {"key": "value"}
    except Exception as e:
        logger.error(f"Middleware failed: {e}")
        return None  # 降级

# 类版（多钩子/配置）
from langchain.agents.middleware import AgentMiddleware

class MyMiddleware(AgentMiddleware):
    def __init__(self, threshold: int = 10):
        self.threshold = threshold
    
    def before_model(self, state, runtime):
        # 同步版本
        pass
    
    async def abefore_model(self, state, runtime):
        # 异步版本
        pass
```


## 🎯 Harness 理念的 Custom Middleware 提示词

**核心理念**：Middleware 是 Agent 的"控制线束"——统一管理横切关注点，而非分散的业务逻辑。

---

### 通用 Harness 模板

```
实现 Middleware Harness：[名称]

【职责定位】
- 这是一个 [安全/可靠/可观测/成本] 控制线束
- 不包含业务逻辑，只做横切关注点
- 可插拔：可随时启用/禁用

【核心契约】
- 输入：state + runtime
- 输出：修改后的 state / 短路 Command / None
- 异常：静默降级，不中断主流程

【配置项】
- enabled: bool = True（总开关）
- [其他配置]：[类型] = [默认值]

【生命周期】
- before: 前置检查/修改
- around（wrap）: 重试/缓存/超时
- after: 后置记录/清理

【监控埋点】
- 计数器：harness.[name].total / .success / .error
- 耗时：harness.[name].duration_ms
- 日志：结构化 JSON 格式
```

---

### 场景 Harness 提示词

**可靠性 Harness**：
```
实现 ReliableModelHarness（wrap_model_call）：
- 重试策略：指数退避 + jitter
- 降级策略：主模型失败 → 备用模型
- 超时控制：30s 超时
- 断路器：连续5次失败后熔断30s
- 所有配置可调，异常时放行
```

**安全 Harness**：
```
实现 SecurityHarness（before_model + after_model）：
- 输入：PII 脱敏 + SQL 注入检测
- 输出：内容审核 + 敏感词过滤
- 阻断：命中则返回固定拒绝消息并跳转 end
- 审计：所有操作记录到 state["audit_log"]
```

**成本 Harness**：
```
实现 CostControlHarness（before_model + wrap_tool_call）：
- 预算：单次会话预算 $0.01
- 限制：最多10次模型调用 + 20次工具调用
- 预警：超过80%预算时注入提示词通知用户
- 熔断：超预算直接短路
```

**可观测 Harness**：
```
实现 ObservabilityHarness（所有钩子）：
- 自动注入 trace_id 到 state
- 记录每个钩子的入参/出参摘要
- 推送 metrics 到 statsd（计数器、耗时、token数）
- 采样率：生产环境10%，调试环境100%
```

---

### 注册与组合

```
实现 HarnessRegistry：
- 按执行顺序组织：安全 → 成本 → 可靠性 → 可观测
- 支持动态禁用单个 harness
- 提供 preset：生产/开发/测试/审计模式

# 生产 preset
middleware = [
    SecurityHarness(),
    CostControlHarness(budget=0.01),
    ReliableModelHarness(max_retries=3),
    ObservabilityHarness(sample_rate=0.1),
]
```

---

## 💡 一句话总结

**Harness 理念 = Middleware 是"控制线束"而非"业务逻辑复用层"，每个 harness 专注一个横切维度（安全/可靠/成本/可观测），通过配置组合实现插拔式治理。**

## 🎯 生产级 Custom Middleware Vibecoding 提示词

基于文档约束，按场景分类：

---

### 1. 基础监控中间件

```
实现监控中间件，使用 before_model + after_model 钩子：
- before_model：记录开始时间和消息数量到 state
- after_model：计算耗时，打印日志（包含耗时、token数、trace_id）
- 异常时捕获并记录，不中断执行（return None）
- 支持同步 + 异步版本（类实现）
- 配置参数：log_level 通过 __init__ 传入
```

---

### 2. 重试中间件

```
实现重试中间件，使用 wrap_model_call 钩子：
- max_retries=3，backoff_factor=2.0，jitter=True
- 捕获 (RateLimitError, APIConnectionError) 时重试
- 重试间隔：initial_delay * (backoff_factor ** attempt) + jitter
- 全部失败时 on_failure="continue"（返回错误消息，不抛异常）
- 每次重试打印警告日志（包含 attempt 次数和错误原因）
- 透传 state 中的 trace_id 到日志
```

---

### 3. 动态提示词中间件

```
实现动态提示词中间件，使用 wrap_model_call 钩子：
- 根据 state 中的 user_tier 动态注入系统提示
- premium 用户：注入"提供详细、专业的回答"
- basic 用户：注入"回答简洁，控制在50字内"
- 使用 request.system_message.content_blocks 保留原提示词结构
- 返回 handler(request.override(system_message=new_system_message))
- 支持异步版本
```

---

### 4. 动态模型选择中间件

```
实现动态模型选择中间件，使用 wrap_model_call 钩子：
- 根据 len(state['messages']) 选择模型
- 消息数 < 5：使用 gpt-4o-mini（低成本）
- 消息数 >= 5：使用 gpt-4o（高精度）
- 工具调用数量 > 3：降级为 gpt-4o-mini
- 使用 request.override(model=selected_model)
- 打印日志：选择的模型名称和原因
```

---

### 5. 动态工具筛选中间件

```
实现动态工具筛选中间件，使用 wrap_model_call 钩子：
- 定义 select_relevant_tools(state, runtime) 函数
- 根据 state['user_tier'] 筛选：
  - basic：只保留 ["search", "calculator"]
  - premium：保留所有工具
- 使用 request.override(tools=filtered_tools)
- 打印日志：筛选后的工具名称列表
- 支持从 runtime.context 获取 user_id 查询权限
```

---

### 6. 缓存中间件

```
实现缓存中间件，使用 wrap_model_call 钩子：
- before：根据 request.messages 最后一条生成 cache_key（MD5）
- 命中缓存：直接返回 ModelResponse(content=cached)，短路 handler
- 未命中：调用 handler，after 将结果存入缓存（TTL=3600）
- 使用 request.override(model=...) 时可跳过缓存
- 缓存前缀：f"agent_cache:{runtime.context.get('env','prod')}"
- 使用 Redis 作为后端，连接失败时降级（透传 handler）
```

---

### 7. 限流中间件

```
实现限流中间件，使用 before_model 钩子 + state_schema：
- 定义 CustomState 包含 model_call_count: NotRequired[int]
- before_model：检查 state.get("model_call_count", 0) >= run_limit
- 超限时返回 {"jump_to": "end", "messages": [AIMessage("限流")]}
- after_model：返回 {"model_call_count": state["model_call_count"] + 1}
- 支持 thread_limit（需配合 checkpointer，使用 runtime.context 存储）
- 配置参数：run_limit=10, thread_limit=50 通过 __init__ 传入
```

---

### 8. 内容审核中间件

```
实现内容审核中间件，使用 after_model 钩子：
- 检查 state["messages"][-1].content 是否包含敏感词
- 敏感词列表通过 __init__ 注入
- 命中时：返回 {"messages": [AIMessage("无法回答此问题")], "jump_to": "end"}
- 同时记录审核日志（包含原始内容 hash、命中规则）
- 支持 before_model 审核用户输入（双向审核）
- 审核失败时不抛异常，友好提示
```

---

### 9. 状态追踪中间件（类实现）

```
实现状态追踪中间件，类继承 AgentMiddleware[CustomState]：
- 定义 CustomState 包含：call_count, total_tokens, start_time
- before_model：记录 start_time 到 state
- after_model：从 response.usage_metadata 提取 token 数
- 累加 total_tokens，call_count +1
- after_agent：打印汇总日志（总调用次数、总 token 数、总耗时）
- 支持异步版本（abefore_model, aafter_model）
- 使用 Command(update=...) 更新 wrap_model_call 中的状态
```

---

### 10. 短路守卫中间件

```
实现短路守卫中间件，使用 before_agent 钩子：
- 检查 runtime.context 中的必要参数（user_id, api_key）
- 缺失时：返回 {"jump_to": "end", "messages": [AIMessage("认证失败")]}
- 检查 state["messages"] 第一条是否包含违禁词
- 包含时：直接短路，不进入 Agent 循环
- 打印安全日志（包含 user_id、拒绝原因）
- can_jump_to=["end"] 配置
```

---

## ✅ 验收标准

```markdown
- [ ] 钩子返回值正确：Node-style 返回 dict 或 None，Wrap-style 返回 ExtendedModelResponse/Command
- [ ] 状态更新：使用 Command(update=...) 而非直接变异
- [ ] 异常处理：所有 middleware 异常被捕获，不中断 Agent
- [ ] 异步支持：类实现同时提供同步和异步方法
- [ ] 日志：包含 trace_id、耗时、关键参数
- [ ] 配置化：阈值、开关通过 __init__ 注入
- [ ] 短路跳转：声明 can_jump_to 并正确使用
- [ ] 顺序感知：before 正序、after 倒序、wrap 嵌套
```

# 实现 Custom Middleware 
实现 Custom Middleware，满足：

【钩子选择】
- 顺序逻辑（日志/验证/状态修改）→ node-style：before_model / after_model
- 控制流（重试/降级/缓存/动态配置）→ wrap-style：wrap_model_call / wrap_tool_call
- 单次前置/后置 → before_agent / after_agent

【状态更新】
- node-style：返回 dict，自动合并到 state
- wrap-style：返回 ExtendedModelResponse(command=Command(update={...}))
- 自定义 state 字段使用 NotRequired 类型标注

【错误处理】
- 所有钩子内部 try/except 包裹
- 异常时记录日志，返回 None（不阻断）
- 需要阻断的场景使用 raise 或 jump_to

【短路跳转】
- 返回 {"jump_to": "end"} 提前终止
- 需在装饰器声明 can_jump_to=["end"]

【动态配置】
- 通过 wrap_model_call 使用 request.override(
    model=新模型,
    tools=筛选后的工具,
    system_message=新系统消息
  )

【执行顺序】
- before_* 按注册顺序执行
- after_* 按注册逆序执行
- wrap_* 嵌套：先注册的包裹后注册的
- 关键中间件（限流/鉴权）放在列表最前

【测试要求】
- 独立单元测试覆盖正常+异常路径
- 验证 state 更新正确性
- 验证短路跳转行为
- 集成前 mock handler 测试 wrap 钩子

【优先内置】
- 重试 → ModelRetryMiddleware / ToolRetryMiddleware
- 限流 → ModelCallLimitMiddleware / ToolCallLimitMiddleware
- 摘要 → SummarizationMiddleware
- 审批 → HumanInTheLoopMiddleware
- PII → PIIMiddleware
- 仅当内置不满足需求时实现自定义