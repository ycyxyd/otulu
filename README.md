# OuTuoLu (欧途路) - European Route

## Project Overview
OuTuoLu is an AI-driven cross-platform travel system designed to provide personalized European travel experiences.

## Monorepo Structure
- **/backend**: Kotlin Spring Boot microservices (Core API, Notification, AI Integration).
- **/web**: React/Next.js web application.
- **/wechat**: WeChat Mini Program (Native).
- **/infra**: Infrastructure as Code (Docker, Nginx, Scripts).

## Getting Started
Please refer to the README in each subdirectory for specific setup instructions.

## Phase 0 (MVP) Goals
- Infrastructure Setup (VPS, Cloudflare, Supabase).
- Daily News & Route Push (Atomic Notification).
- C2C Community Basics.
- AI Companion MVP (GPS, RAG).

## 项目分阶段预算与成本控制 
(Phased Budget & Cost Control)阶段目标 (Focus)费用控制策略关键升级点 (未来)Phase 0 (MVP)基础 Web 网站上线、消息推送、C2C 社区核心功能、AI 伴侣基础 RAG。最小化云资源：使用 Cloudflare 免费层服务，VPS 选择成本最低但可运行开源 LLM 的配置 (由 MLOps Agent 推荐)。开源模型优先。部署 Gemini 3 Pro/Ultra 以增强 AI 伴侣能力；增加 Redis 节点。Phase 1 (增长)移动 App 上线、AI 伴侣完整功能、B2C 电商模块上线。随用户量增长，按需弹性扩容 VPS 和数据库 (Supabase)。开始收取 PLUS 会费以补贴运营成本。升级微服务架构至服务网格 (Service Mesh)；启用更专业的 LLM 供应商。Phase 2 (扩展)C2C 交易功能拓展、AI 导游/问价上线、全球化/多语言支持。根据业务收入，将 VPS 迁移至专业云服务商 (AWS/GCP/Azure)，确保高可用性和全球覆盖。引入更复杂的 AI Agents (如市场分析 Agent)。
