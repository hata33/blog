Tool 是"前台服务员"（需要与用户交互），Middleware 是"后台设备"（默默运行，用户无感知）。只有需要让用户看到进度/状态的逻辑才走 Tool + streaming。
Tool 需要前端可见的原因：
耗时操作（用户需要知道在干什么）
进度反馈（搜索、文件处理、API 调用）
交互确认（HITL 需要用户审批）

## 🎯 Middleware 心智模型

**核心本质**：Agent 执行流程的拦截器/装饰器，在关键节点插入自定义逻辑。

```
模型调用链：开始 → before_model → 模型调用 → after_model → 工具执行 → 完成
                ↑              ↑              ↑
           中间件钩子       中间件钩子      中间件钩子
```

---

## 📊 钩子位置

| 钩子 | 触发时机 | 典型用途 |
|-----|---------|---------|
| `@before_model` | 调用LLM前 | 裁剪消息、注入系统提示、动态上下文 |
| `@after_model` | LLM响应后 | 验证输出、过滤内容、修改响应 |
| `wrap_model_call` | 包裹整个模型调用 | 重试、降级、日志、限流 |
| `wrap_tool_call` | 包裹工具调用 | 权限检查、参数验证、结果缓存 |

---

## 🔧 内置中间件速查

| 中间件 | 功能 |
|-------|------|
| `SummarizationMiddleware` | 超长对话自动摘要 |
| `HumanInTheLoopMiddleware` | 工具执行前人工审批 |
| `ModelRetryMiddleware` | 模型调用失败重试 |
| `ModelFallbackMiddleware` | 主模型失败切换备用 |
| `ToolRetryMiddleware` | 工具调用失败重试 |
| `ModelCallLimitMiddleware` | 单次运行限制调用次数 |
| `PIIDetectionMiddleware` | 检测并脱敏敏感信息 |
| `LLMToolSelectorMiddleware` | 动态筛选可用工具 |
| `TodoListMiddleware` | 管理任务队列 |
| `ToolEmitterMiddleware` | 工具调用事件广播 |

---

## ⚡ 核心特性

1. **有序执行**：按传入顺序依次执行
2. **状态共享**：通过 `state` 在中间件间传递数据
3. **短路机制**：中间件可跳过后续执行，直接返回
4. **错误隔离**：单个中间件失败不影响整体

---

## 🎯 场景速查

| 场景 | 推荐中间件 | 关键配置 |
|-----|-----------|---------|
| 长对话管理 | `SummarizationMiddleware` | `trigger=4000`, `keep=20` |
| 人工审批 | `HumanInTheLoopMiddleware` | `interrupt_on={"tool_name": True}` |
| 高可用 | `ModelFallbackMiddleware` | `fallbacks=[备用模型]` |
| 成本控制 | `ModelCallLimitMiddleware` | `max_calls=5` |
| 合规脱敏 | `PIIDetectionMiddleware` | 自动检测手机/身份证 |
| 调试日志 | 自定义 | `@before_model` 打印状态 |

---

## 📝 提示词模板

**通用结构**：
```
实现 [功能描述] 中间件，在 [钩子位置] 插入逻辑，
通过 state 共享数据，支持 [短路/错误处理] 特性。
```

**摘要中间件**：
```
实现对话摘要中间件，当消息超过4000 token时自动触发，
保留最近20条消息，前文用摘要替换。配置在 create_agent 的 middleware 参数。
```

**限流中间件**：
```
实现模型调用限流中间件，单次 agent 运行最多调用5次 LLM，
超限时抛出友好错误提示。使用 ModelCallLimitMiddleware 配置。
```

**人工审批**：
```
实现工具审批中间件，对敏感工具执行前中断，
等待用户确认后继续。使用 HumanInTheLoopMiddleware 配合 checkpointer。
```

**自定义中间件**：
```
实现日志中间件，@before_model 记录请求消息，
@after_model 记录响应 token 数和耗时，
通过 state 累积本次会话的调用统计。
```


## 🎯 Middleware 代码约束

### 顺序依赖
```python
# 中间件按传入顺序执行
middleware=[A, B, C]  # 执行顺序: A→B→C

# 错误：依赖后续中间件的状态
@before_model
def wrong(state, runtime):
    return {"data": state["pending"]}  # pending 由后续中间件产生

# 正确：只依赖前置或初始状态
@before_model  
def correct(state, runtime):
    return {"timestamp": time.now()}  # 独立计算
```

---

### 状态变异
```python
# 规则：返回字典自动合并，返回 None 不修改

@before_model
def legal(state, runtime):
    return {"counter": state.get("counter", 0) + 1}  # ✅ 返回变更

@before_model
def illegal(state, runtime):
    state["counter"] += 1  # ❌ 直接变异 state
    return None
```

---

### 短路执行
```python
# 返回 Command(resume=...) 跳过后续中间件

@before_model
def short_circuit(state, runtime):
    if state.get("skip_model"):
        return Command(resume="skipped", goto="end")  # ✅ 短路
    
    return None  # 继续执行后续
```

---

## 🔧 技术边界

| 约束 | 限制 | 说明 |
|-----|------|------|
| **中间件数量** | ≤20 | 过多影响性能 |
| **单次执行时长** | ≤30s | 超时中断 |
| **state 大小** | ≤1MB | 超过触发压缩 |
| **嵌套中间件** | ≤5层 | 避免深度递归 |
| **异步支持** | 需 `async` 版本 | 同步中间件不兼容异步 |

---

## ✅ 验收标准

```markdown
- [ ] 所有中间件无直接 state 变异，仅返回字典
- [ ] 中间件顺序与业务依赖匹配
- [ ] 短路分支已测试（跳过执行场景）
- [ ] 错误处理覆盖：单个中间件异常不中断整体
- [ ] 性能：中间件总耗时 < 模型调用的 10%
- [ ] 幂等性：重试场景下状态一致
```

---

## 📋 Vibecoding 检查清单

```python
# 快速检查模板
class MyMiddleware:
    def before_model(self, state, runtime):
        # ✅ 检查点1：不修改原 state
        # ✅ 检查点2：返回 dict 或 None  
        # ✅ 检查点3：短路使用 Command
        return {"key": "value"}  # 或 None

# 注册时
agent = create_agent(
    middleware=[
        # ✅ 检查点4：顺序正确
        # ✅ 检查点5：依赖在前
    ]
)
```
## 🎯 Middleware 生产级 Vibecoding 提示词

```
实现 [功能] 中间件，满足：

【正确性】
- 返回 dict 合并到 state，返回 None 不修改
- 不直接变异 state 参数
- 短路使用 Command(resume=..., goto=...)

【可靠性】
- 异常捕获后记录日志，返回 None（降级不阻断）
- 关键操作设置超时（默认 500ms）
- 幂等性：相同输入多次执行结果一致

【可观测】
- 入口打印 DEBUG 日志（包含关键参数）
- 出口打印耗时日志
- 通过 runtime.context 获取 request_id 透传

【配置化】
- 所有阈值参数通过 __init__ 注入
- 支持环境变量覆盖默认值

【线程安全】
- 无共享可变状态
- 使用 Redis/原子操作处理计数

【验收】
- 单元测试覆盖异常路径
- 性能：P99 < 配置阈值
- 并发：无竞态条件
```