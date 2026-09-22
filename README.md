# OuTuoLu (欧途路) — European Route

An open-source AI travel companion for Europe: route planning, local recommendations and a retrieval-augmented assistant, built as a cross-platform monorepo.

> Status: early stage. The monorepo structure, backend skeleton, web frontend, mobile shell and RAG pipeline are in place; see the roadmap below.

## Monorepo layout

| Path | Stack | Purpose |
|---|---|---|
| `backend/` | Kotlin · Spring Boot | Core API, notification service, AI integration |
| `web/` | React / Next.js | Web app |
| `mobile/` | Flutter | Mobile app |
| `wechat/` | WeChat Mini Program | Distribution in the Chinese market |
| `rag_pipeline/` | Python | Retrieval-Augmented Generation pipeline (see `rag_pipeline/.env.example`) |
| `infra/` | Docker · Nginx · scripts | Infrastructure as code |

Each subdirectory has its own README with setup instructions.

## Quick start (web)

```sh
cd web
npm install
npm run dev
```

Backend and RAG pipeline need a local Supabase/Postgres instance — see `LOCAL_SETUP_GUIDE.md` for the local development setup used for development.

## Roadmap

- **Phase 0 (MVP)** — infrastructure, daily news & route push, C2C community basics, AI companion MVP (GPS + RAG).
- **Phase 1 (growth)** — mobile release, full AI companion, B2C booking/e-commerce module.
- **Phase 2 (scale)** — C2C marketplace features, AI tour guide, internationalization.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first so we can agree on the direction.

## License

MIT — see [LICENSE](LICENSE).
