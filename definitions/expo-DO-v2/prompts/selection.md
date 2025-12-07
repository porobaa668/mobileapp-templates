# Template Selection

General-purpose multi-entity storage on Cloudflare Workers using one Durable Object (DO) as the storage backend. The DO is wrapped so multiple entities (users, chats, items, etc.) can persist data via simple APIs.

Use when:
- Mobile apps with multiple entities and server-side persistence
- Chat apps, e-commerce, dashboards
- Cost-effective persistence without KV
- General purpose storage for any multi-entity data
- Apps needing atomic operations and indexing

Avoid when:
- Simple client-only apps (use expo-blank)
- Apps only needing local storage
- You need direct DO access or alarms

Note: No direct DO access. DO is storage-only; no alarms or extra DO features.

Built with:
- React Native + Expo SDK 52
- expo-router for file-based navigation
- StyleSheet.create() for styling (NOT Tailwind)
- Cloudflare Workers + single DO for multi-entity persistence
- Hono for API routes
- TypeScript
