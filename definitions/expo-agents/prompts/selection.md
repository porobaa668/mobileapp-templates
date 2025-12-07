# Template Selection - Expo AI Agents

Production-ready AI agent chatbot for React Native mobile apps with Cloudflare Agents SDK.

Use when:
- AI chat applications with intelligent tool/function calling
- Agent-based chatbots using Cloudflare MCP servers
- Multi-model AI support (GPT-4o, Gemini 2.0/2.5, Claude Opus 4)
- Real-time streaming chat with AI Agents
- Advanced AI capabilities (image generation, smart assistants)
- Mobile apps that need LLM/AI as core functionality

Avoid when:
- Simple apps without AI functionality
- Apps that don't need LLM capabilities
- Basic CRUD apps (use expo-DO or expo-DO-v2 instead)
- Simple question-answer without tool requirements

**IMPORTANT: Only use if AI/LLM is CORE to your app. For simple storage, use expo-DO or expo-DO-v2.**

Built with:
- React Native + Expo SDK 52
- Cloudflare Agents SDK for stateful agent management
- Official MCP TypeScript SDK
- OpenAI SDK via Cloudflare AI Gateway
- Multi-model support (OpenAI, Anthropic, Google)
- expo-router for navigation
- StyleSheet for styling (NOT Tailwind)
- TypeScript for type safety
