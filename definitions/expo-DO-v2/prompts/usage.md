# Usage

## Overview
React Native + Expo mobile app with Cloudflare Workers. Storage via a single Durable Object (DO) powered library to support multiple entities on a single DO.
- Frontend: React Native + expo-router + TypeScript
- Backend: Hono Worker; persistence through one DO (no direct DO access)
- Shared: Types in `shared/types.ts`

## IMPORTANT: Demo Content
**The existing demo screens, mock data, and API endpoints are FOR TEMPLATE UNDERSTANDING ONLY.**
- Replace demo screens with actual application screens
- Remove or replace mock data in `shared/mock-data.ts` with real data structures
- Remove or replace demo API endpoints and implement actual business logic
- The demo items examples show DO patterns - replace with real functionality

## Tech
- React Native, Expo SDK 52, expo-router
- Cloudflare Workers + DO multi-entity storage
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
- **DO NOT** modify `worker/core-utils.ts` - it's a library for DO operations
- **DO NOT** modify `wrangler.jsonc` bindings
- Add routes in `worker/user-routes.ts`
- Define entities in `worker/entities.ts`

## Code Organization

### Frontend Structure (React Native)
```
app/
├── _layout.tsx       # Root layout
├── index.tsx         # Home screen
├── demo.tsx          # Demo screen (replace)
components/
├── ui/               # Pre-built components
lib/
├── api-client.ts     # API client for calling backend
├── storage.ts        # AsyncStorage wrapper
```

### Backend Structure (Cloudflare Workers)
```
worker/
├── index.ts          # Worker entrypoint (DO NOT MODIFY)
├── core-utils.ts     # DO utilities (DO NOT MODIFY)
├── entities.ts       # Define your entities here
├── user-routes.ts    # Add your routes here
shared/
├── types.ts          # Shared API/data types
├── mock-data.ts      # Demo data (replace)
```

## Entity Pattern

### Defining Entities
In `worker/entities.ts`:
```typescript
import { IndexedEntity } from "./core-utils";
import type { User, Item } from "@shared/types";
import { MOCK_USERS, MOCK_ITEMS } from "@shared/mock-data";

export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}

export class ItemEntity extends IndexedEntity<Item> {
  static readonly entityName = "item";
  static readonly indexName = "items";
  static readonly initialState: Item = { id: "", title: "", completed: false };
  static seedData = MOCK_ITEMS;
}
```

### Adding API Routes
In `worker/user-routes.ts`:
```typescript
import { ok, bad } from './core-utils';
import { UserEntity, ItemEntity } from './entities';

app.get('/api/users', async (c) => {
  const users = await UserEntity.list(c.env);
  return ok(c, users);
});

app.post('/api/users', async (c) => {
  const { name } = await c.req.json();
  if (!name?.trim()) return bad(c, 'name required');
  const user = await UserEntity.create(c.env, { 
    id: crypto.randomUUID(), 
    name: name.trim() 
  });
  return ok(c, user);
});

app.get('/api/items', async (c) => {
  const items = await ItemEntity.list(c.env);
  return ok(c, items);
});
```

### Calling API from React Native
```tsx
import { api, apiPost } from '@/lib/api-client';
import { User, Item } from '@/shared/types';

// Fetch users
const users = await api<User[]>('/api/users');

// Create user
const newUser = await apiPost<User>('/api/users', { name: 'John' });

// In component
export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api<User[]>('/api/users').then(setUsers);
  }, []);

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 16 },
});
```

## Bindings
CRITICAL: Only `GlobalDurableObject` is available and is managed by the core-utils library.

**YOU CANNOT**:
- Modify `wrangler.jsonc`
- Add new Durable Objects or KV namespaces
- Change binding names
- Access DO directly (use Entity helpers)

## Storage Patterns
- Use Entities/Index utilities from `core-utils.ts`
- Avoid raw DO calls
- Atomic operations via provided helpers

## Expo Router Rules

**File-based routing:**
```
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home (/)
├── users.tsx        # Users list (/users)
├── user/[id].tsx    # User detail (/user/123)
```

**Navigation:**
```tsx
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

// Link
<Link href="/users"><Text>View Users</Text></Link>

// Programmatic
const router = useRouter();
router.push('/users');

// Dynamic params
const { id } = useLocalSearchParams<{ id: string }>();
```
