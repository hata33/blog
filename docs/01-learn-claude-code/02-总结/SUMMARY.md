# Claude Code 自我学习文档摘要

本文档汇总 `docs/self/` 目录中所有章节的核心内容，每条不超过100字。

---

## S01: Agent Loop - 代理主循环
代理通过 `while stop_reason == "tool_use"` 持续循环：调用 LLM API → 检查响应 → 执行工具 → 反馈结果。包含危险命令检测、120秒超时保护、50000字符输出限制等安全机制。

## S02: Tool Use - 工具分发
通过 `TOOL_HANDLERS` 字典将工具名称映射到处理函数，实现解耦的工具调用架构。支持 bash、read_file、write_file、edit_file 等工具，使用 lambda 函数简化分发逻辑。

## S03: Todo Write - 待办事项管理
`TodoManager` 管理任务状态(pending/in_progress/completed)，支持最多20个任务、同时只有1个 in_progress 任务。超过3轮未更新自动注入提醒，使用状态标记 `[ ] [>] [x]` 可视化进度。

## S04: Subagent - 子代理机制
子代理在全新空白上下文中执行（`messages = []`），最多30轮工具调用循环，完成后只返回文本摘要。实现上下文隔离，节省父代理 token 使用，子代理没有 task 工具防止递归。

## S05: Skill Loading - 技能按需加载
两层注入架构：Layer 1 在系统提示词中注入技能名称和描述（~100 tokens/技能）；Layer 2 按需调用 `load_skill` 工具注入完整技能内容。使用 YAML frontmatter 解析技能元数据。

## S06: Context Compact - 上下文压缩
三层压缩机制：Layer 1 微压缩每轮清理旧工具结果（保留最近3个）；Layer 2 自动压缩在 Token 超过50000时触发，保存完整对话到 `.transcripts/` 并用摘要替换；Layer 3 手动调用 compact 工具主动压缩。

## S07: Task System - 持久化任务管理
任务保存在 `.tasks/task_N.json` 文件中，支持依赖关系（blockedBy/blocks 字段）。完成任务自动清理依赖关系，状态在对话压缩后仍可访问，实现持久化状态管理。

## S08: Background Tasks - 后台任务
`BackgroundManager` 使用线程池执行长时间命令，`run()` 立即返回 task_id 非阻塞。支持状态查询、通知队列注入、300秒超时保护，使用线程锁保护共享队列。

## S09: Agent Teams - 代理团队
持久化队友在独立线程中运行，通过 `MessageBus`（JSONL 文件收件箱）异步通信。生命周期：spawning → working → idle → ... → shutdown。配置保存在 `.team/config.json`，支持点对点、广播、双向通信。

## S10: Team Protocols - 团队协议
实现 shutdown_request 和 plan_approval 两种协议。通过 request_id 关联请求-响应，使用追踪器（`shutdown_requests`、`plan_requests`）管理请求状态，线程锁保护共享数据。

## S11: Autonomous Agents - 自主代理
双阶段循环：WORK 阶段执行工具调用（最多50轮）；IDLE 阶段每5秒轮询收件箱和任务看板，自动认领未分配任务（status=pending, owner="", blockedBy=[]）。空闲60秒自动关闭，支持身份重新注入。

## S12: Worktree + Task Isolation - 工作树隔离
双平面架构：控制平面（任务）+ 执行平面（工作树）。任务绑定到 git worktree 实现目录级隔离，生命周期：active → kept → removed。所有操作记录到 `.worktrees/events.jsonl` 可追溯。
