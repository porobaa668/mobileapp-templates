# Template Selection

Mobile app with Cloudflare Durable Objects for stateful server-side persistence.

Use when:
- Mobile apps needing server-side state (counters, user data, real-time features)
- Apps with stateful backend operations
- Chat apps, collaborative features
- When you need atomic operations and strong consistency

Avoid when:
- Simple client-only apps (use expo-blank)
- Apps only needing local storage
- Static content apps

Built with:
- React Native + Expo SDK 52
- expo-router for file-based navigation
- StyleSheet.create() for styling (NOT Tailwind)
- Cloudflare Workers + Durable Objects for backend
- Hono for API routes
- TypeScript
