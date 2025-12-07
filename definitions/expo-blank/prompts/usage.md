# Usage

## Built with
- Expo SDK 52, expo-router ~4.0, React Native 0.76
- Pre-built UI components (Button, Card, TextInput)
- @expo/vector-icons for icons
- react-native-reanimated for animations
- AsyncStorage for local persistence
- Cloudflare Workers backend with Hono (for API routes)
- TypeScript, ESLint

## Critical Restrictions

### ALWAYS use:
- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`, `SafeAreaView`
- `StyleSheet.create()` for all styling
- expo-router for navigation (`Link`, `useRouter`, `useLocalSearchParams`)

### NEVER use:
- HTML elements (`div`, `span`, `button`, `input`, `img`, `h1`, `p`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM or web navigation

## Styling
- Use `StyleSheet.create()` for all styles
- Responsive design with `Dimensions` API when needed
- Icons from `@expo/vector-icons` (Ionicons, MaterialIcons, etc.)
- Error boundaries already configured in layout

## Animation
- Use `react-native-reanimated` for smooth animations
- `expo-haptics` for touch feedback

## Components
- Import from `@/components/ui/*` (Button, Card, TextInput)
- Avoid reinventing basic components

## Example
\`\`\`tsx
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, CardContent } from '@/components/ui';

export default function ExampleScreen() {
  return (
    <View style={styles.container}>
      <Card>
        <CardContent>
          <Text style={styles.title}>Hello</Text>
          <Button onPress={() => console.log('pressed')}>
            Click Me
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
\`\`\`

## Local Storage
- Use `@/lib/storage` for AsyncStorage wrapper
\`\`\`tsx
import { storage } from '@/lib/storage';

// Save data
await storage.set('user', { name: 'John' });

// Get data
const user = await storage.get<{ name: string }>('user');
\`\`\`

---

## Backend API (Cloudflare Workers)

The template includes a Cloudflare Workers backend for API routes.

### Adding API Routes
Add routes in `worker/userRoutes.ts`:
\`\`\`typescript
import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add your routes here
    app.get('/api/items', (c) => c.json({ success: true, data: [] }));
    
    app.post('/api/items', async (c) => {
        const body = await c.req.json();
        return c.json({ success: true, data: body });
    });
}
\`\`\`

### Calling API from React Native
\`\`\`tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

async function fetchItems() {
  const response = await fetch(\`\${API_URL}/api/items\`);
  const data = await response.json();
  return data;
}
\`\`\`

### Important Backend Rules
- **DO NOT** modify `worker/index.ts` or `worker/core-utils.ts`
- **DO NOT** modify CORS settings or error handlers
- Add all custom routes in `worker/userRoutes.ts`

---

## Expo Router Rules

Router hooks (`useRouter`, `useLocalSearchParams`, `Link`) work inside the app directory.

**File-based routing** (create files in `app/` directory):
\`\`\`
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home screen (/)
├── about.tsx        # About screen (/about)
├── settings/
│   ├── _layout.tsx  # Settings layout
│   └── index.tsx    # Settings screen (/settings)
└── [id].tsx         # Dynamic route (/123, /abc)
\`\`\`

**Navigation:**
\`\`\`tsx
import { Link, useRouter } from 'expo-router';

// Declarative
<Link href="/about">
  <Text>Go to About</Text>
</Link>

// Programmatic
const router = useRouter();
router.push('/about');
router.replace('/home');
router.back();
\`\`\`

**Dynamic routes:**
\`\`\`tsx
// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>User ID: {id}</Text>;
}
\`\`\`

**Common errors:**
- "Cannot find module" -> Check file path in app/ directory
- Navigation not working -> Ensure Link wraps a Text or View component
- Params undefined -> Use correct generic type in useLocalSearchParams
