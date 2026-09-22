---
name: AI provider fallback
description: MoonPeak's assistant supports both Replit AI Integrations and a direct OpenAI key.
---

MoonPeak prefers the Replit AI Integrations endpoint when it is available and falls back to the project secret `OPENAI_API_KEY` when it is not.

**Why:** The built-in provider may be unavailable on the user's current plan, but the assistant should remain usable without changing the Discord feature surface.

**How to apply:** Keep provider selection in environment configuration, never expose secret values, and use a direct-OpenAI-compatible model default when no integration base URL is present.