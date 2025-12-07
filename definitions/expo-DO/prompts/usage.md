# Usage

## Overview
React Native + Expo mobile app with Cloudflare Workers + Durable Objects for stateful backend.
- Frontend: React Native + expo-router + TypeScript
- Backend: Hono Worker with Durable Objects
- Shared: Types in `shared/types.ts`

## IMPORTANT: Demo Content
**The existing demo pages and mock data are FOR TEMPLATE UNDERSTANDING ONLY.**
- Replace demo screens with actual application screens
- Remove or replace mock data in `shared/mock-data.ts`
- Replace demo API endpoints with actual business logic

## Tech
- React Native, Expo SDK 52, expo-router
- Cloudflare Workers + Durable Objects
- Hono, TypeScript

## Critical Restrictions - Frontend

### ALWAYS use:
- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`
- `StyleSheet.create()` for all styling
- expo-router for navigation (`Link`, `useRouter`, `useLocalSearchParams`)

### NEVER use:
- HTML elements (`div`, `span`, `button`, `input`, `img`, `h1`, `p`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

## Critical Restrictions - Backend
- **DO NOT** modify `worker/index.ts` core structure
- **DO NOT** modify `worker/core-utils.ts`
- **DO NOT** modify `wrangler.jsonc` bindings
- Add routes in `worker/userRoutes.ts`

## Code Organization

### Frontend Structure (React Native)
```
app/
├── _layout.tsx       # Root layout
├── index.tsx         # Home screen
├── demo.tsx          # Demo screen (replace with your screens)
components/
├── ui/               # Pre-built components (Button, Card, TextInput)
lib/
├── api.ts            # API client for calling backend
├── storage.ts        # AsyncStorage wrapper
```

### Backend Structure (Cloudflare Workers)
```
worker/
├── index.ts          # Worker entrypoint (DO NOT MODIFY)
├── core-utils.ts     # DO utilities (DO NOT MODIFY)
├── durableObject.ts  # Durable Object class
├── userRoutes.ts     # Add your routes here
├── types.ts          # Backend types
shared/
├── types.ts          # Shared API/data types
├── mock-data.ts      # Demo data (replace)
```

## API Patterns

### Adding Endpoints
In `worker/userRoutes.ts`:
```typescript
import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Durable Object endpoint
    app.post('/api/counter/increment', async (c) => {
        const stub = c.env.GlobalDurableObject.get(
            c.env.GlobalDurableObject.idFromName("global")
        );
        const count = await stub.increment();
        return c.json({ success: true, data: count });
    });
}
```

### Calling API from React Native
```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

async function incrementCounter() {
  const response = await fetch(`${API_URL}/api/counter/increment`, {
    method: 'POST',
  });
  const data = await response.json();
  return data;
}

// In component
export default function CounterScreen() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = async () => {
    const result = await incrementCounter();
    if (result.success) {
      setCount(result.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Button onPress={handleIncrement}>Increment</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  count: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
});
```

## Bindings
CRITICAL: Only these bindings exist:
- `GlobalDurableObject` (stateful operations)

**YOU CANNOT**:
- Modify `wrangler.jsonc`
- Add new Durable Objects
- Change binding names

## Expo Router Rules

**File-based routing** (create files in `app/` directory):
```
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home screen (/)
├── settings.tsx     # Settings screen (/settings)
└── [id].tsx         # Dynamic route
```

**Navigation:**
```tsx
import { Link, useRouter } from 'expo-router';

<Link href="/settings">
  <Text>Go to Settings</Text>
</Link>

const router = useRouter();
router.push('/settings');
```
