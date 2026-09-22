# MoonPeak Discord Bot

MoonPeak is a branded Discord community bot for crypto education, scam reporting, moderation workflows, and recurring security reminders.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/moonpeak-bot run dev` — run the Discord bot
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string for the shared API service
- Required secret: `DISCORD_TOKEN`
- Optional secret: `OPENAI_API_KEY` when built-in Replit AI Integrations are unavailable
- Optional env: `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `MOONPEAK_AI_MODEL`
- Optional env: `MOONPEAK_ENABLE_PRIVILEGED_INTENTS=true` after enabling Guild Members Intent and Message Content Intent in Discord Developer Portal

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/moonpeak-bot/src/commands/` — slash-command definitions, registration, and handlers
- `artifacts/moonpeak-bot/src/events/` — member-join welcome DM behavior
- `artifacts/moonpeak-bot/src/embeds/` — MoonPeak-branded embed builders and button rows
- `artifacts/moonpeak-bot/src/security/` — recurring security warning scheduler
- `artifacts/moonpeak-bot/src/moderation/` — scam reports and staff-only actions
- `artifacts/moonpeak-bot/src/ai/` — Replit AI Integrations OpenAI assistant boundary
- `artifacts/moonpeak-bot/src/config/` — environment configuration and persisted admin settings

## Architecture decisions

- Slash commands fall back to the bot user ID for registration, so `DISCORD_CLIENT_ID` is optional; `DISCORD_GUILD_ID` can be added for faster guild-scoped command updates.
- Privileged Discord intents are opt-in because Discord rejects login when they are not enabled in the Developer Portal.
- Admin configuration persists warning/report channel IDs and the interval in `data/moonpeak-config.json`; `/config` is the source of truth after initial setup.
- The AI assistant prefers Replit AI Integrations and falls back to `OPENAI_API_KEY` when that connection is unavailable.

## Product

The bot currently provides:

- MoonPeak-branded `/help`, `/rules`, `/security`, `/beginner`, `/glossary`, `/faq`, `/support`, `/about`, `/links`, `/videos`, `/news`, `/pro`, `/server`, and `/roles` embeds.
- `/report` with a private staff queue and authorized review, dismiss, and ban actions.
- Admin-only `/embed` publishing and `/config` controls for security warnings and report routing.
- A recurring rotating security warning scheduler with a ten-minute default interval.
- Welcome DMs with security guidance when privileged intents are enabled.
- Mention-based beginner-friendly crypto and Discord-security answers when privileged intents are enabled.

## User preferences

- MoonPeak should never promise profits or guaranteed trading success.
- The repeated security message must remain clear: never answer random DMs; report suspicious messages to verified MoonPeak staff.

## Gotchas

- Enable Guild Members Intent and Message Content Intent in Discord Developer Portal before setting `MOONPEAK_ENABLE_PRIVILEGED_INTENTS=true`.
- Configure `/config warning-channel`, `/config report-channel`, and `/config warning-interval` in Discord after inviting the bot.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
