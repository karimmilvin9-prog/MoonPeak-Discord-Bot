---
name: Discord privileged intents
description: MoonPeak's Discord bot must treat privileged gateway intents as opt-in.
---

MoonPeak starts without Guild Members Intent and Message Content Intent and enables them only when `MOONPEAK_ENABLE_PRIVILEGED_INTENTS=true`.

**Why:** Discord rejects the gateway login with “Used disallowed intents” if the application has not enabled those intents in the Developer Portal, so defaulting them on makes the bot crash before basic commands and security scheduling can run.

**How to apply:** Enable both intents in the Discord Developer Portal before turning on the environment flag; welcome DMs and mention-based AI depend on them.