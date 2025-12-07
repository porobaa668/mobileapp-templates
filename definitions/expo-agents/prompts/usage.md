# Usage Instructions

You can start customizing the template by modifying `app/index.tsx`. The app auto-updates as you edit files.

The chat API is powered by Cloudflare Agents (wrapper on Durable Objects) and accessible through `/api/chat/:sessionId/*` routes in `worker/userRoutes.ts`. **Use it!**

The agent system uses Durable Objects for persistent state management and conversation history.

## Built with
- **React Native + Expo SDK 52** for cross-platform mobile development
- **expo-router** for file-based navigation
- **Cloudflare Agents SDK** for stateful agent management with Durable Objects
- **Model Context Protocol (MCP)** client for real server integration
- **OpenAI SDK** for AI model integration via Cloudflare AI Gateway
- **Multi-Model Support** (GPT-4o, Gemini, Claude)
- **StyleSheet.create()** for styling (NOT Tailwind)
- **TypeScript** for type safety

## Critical Restrictions

### ALWAYS use:
- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `FlatList`
- `StyleSheet.create()` for all styling
- expo-router for navigation (`Link`, `useRouter`)

### NEVER use:
- HTML elements (`div`, `span`, `button`, `input`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

## Agent Features
- **Real MCP Integration**: Connects to actual MCP servers
- **Cloudflare MCP Servers**: Direct integration with Cloudflare Bindings
- **Intelligent Tool Usage**: AI automatically detects when to use tools
- **Multi-Model Support**: Switch between GPT-4o, Gemini, Claude
- **Persistent Conversations**: Maintains chat history using Durable Objects
- **Tool Visualization**: Shows which tools were used with results

## Worker Architecture (Backend)
- **`worker/agent.ts`**: Main agent class
- **`worker/userRoutes.ts`**: HTTP routing for agent API
- **`worker/chat.ts`**: OpenAI integration and conversation logic
- **`worker/mcp-client.ts`**: MCP client for real server integration
- **`worker/tools.ts`**: Tool routing and MCP server coordination
- **`worker/config.ts`**: Centralized configuration
- **`worker/types.ts`**: TypeScript interfaces
- **`worker/app-controller.ts`**: Control plane durable object

## Environment Variables
- **CF_AI_BASE_URL**: Cloudflare AI Gateway base URL (required)
- **CF_AI_API_KEY**: API key for AI Gateway access (required)
- **CHAT_AGENT**: Durable Object binding for agent persistence

## Available Bindings
**Only these bindings are available - do not add/remove/modify:**
- `CHAT_AGENT`: Durable object for chat agent
- `APP_CONTROLLER`: Durable object for app controller

**IMPORTANT: Do NOT edit wrangler.jsonc or modify bindings.**

## Calling the Chat API from React Native

```tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch(`${API_URL}/api/chat/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  message: { padding: 12, marginVertical: 4, marginHorizontal: 16, borderRadius: 12, maxWidth: '80%' },
  userMessage: { backgroundColor: '#3b82f6', alignSelf: 'flex-end' },
  assistantMessage: { backgroundColor: '#e2e8f0', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  sendButton: { backgroundColor: '#3b82f6', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '600' },
});
```

## Adding New MCP Servers
1. Add server config to `initializeCloudflareServers()` in `worker/mcp-client.ts`
2. Tools are automatically discovered from MCP server definitions
3. System automatically routes tool calls to appropriate servers

## UI Components
Import from `@/components/ui/*`:
- `Button`, `Card`, `TextInput` (pre-built React Native components)

## Important Notes
- Conversations and persistence are already handled by the template
- To build a ChatGPT clone: just build the frontend using existing APIs
- **Rate Limit Notice**: Display a note that AI requests are limited across all users

---

## Expo Router Rules

**File-based routing** (create files in `app/` directory):
```
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home/Chat screen
├── settings.tsx     # Settings screen
└── [sessionId].tsx  # Dynamic chat sessions
```

**Navigation:**
```tsx
import { Link, useRouter } from 'expo-router';

<Link href="/settings">
  <Text>Settings</Text>
</Link>

const router = useRouter();
router.push('/settings');
```

**Common errors:**
- "Cannot find module" → Check file path in app/ directory
- Navigation not working → Ensure Link wraps a Text or View component
