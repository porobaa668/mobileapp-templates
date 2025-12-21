# Usage

## Built with
- Expo SDK 54, expo-router ~5.0, React Native 0.81
- react-native-web ~0.20 for web preview
- Pre-built UI components (Button, Card, TextInput)
- @expo/vector-icons for icons
- react-native-reanimated for animations
- AsyncStorage for local persistence
- zustand for state management
- TypeScript, ESLint

## CRITICAL: Mobile-Only Development

**This is a React Native mobile app. There is NO backend server in this template.**

### NEVER install or use:
- `hono`, `express`, `fastify`, or ANY server framework
- `hono/cors`, `hono/logger`, or any middleware packages
- `cloudflare:workers` or Cloudflare-specific packages
- Any Node.js server packages

### This template is for CLIENT-SIDE mobile apps only:
- Use `fetch()` to call external APIs if needed
- Use AsyncStorage for local data persistence
- Use zustand for state management
- NO server-side code, NO API routes

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
- Server frameworks (hono, express, etc.)
- Backend API route patterns

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
```tsx
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
```

## Local Storage
- Use `@/lib/storage` for AsyncStorage wrapper
```tsx
import { storage } from '@/lib/storage';

// Save data
await storage.set('user', { name: 'John' });

// Get data
const user = await storage.get<{ name: string }>('user');
```

## State Management
- Use zustand for global state (already installed)
```tsx
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## Expo Router Rules

Router hooks (`useRouter`, `useLocalSearchParams`, `Link`) work inside the app directory.

**File-based routing** (create files in `app/` directory):
```
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home screen (/)
├── about.tsx        # About screen (/about)
├── settings/
│   ├── _layout.tsx  # Settings layout
│   └── index.tsx    # Settings screen (/settings)
└── [id].tsx         # Dynamic route (/123, /abc)
```

**Navigation:**
```tsx
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
```

**Dynamic routes:**
```tsx
// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>User ID: {id}</Text>;
}
```

**Common errors:**
- "Cannot find module" -> Check file path in app/ directory
- Navigation not working -> Ensure Link wraps a Text or View component
- Params undefined -> Use correct generic type in useLocalSearchParams
