# CLAUDE.md

Development guide for AI assistants working with this template repository.

## Overview

This repository contains **React Native + Expo mobile app templates** for the mobileapp-production project. Templates are deployed to Cloudflare R2 and consumed by AI agents to scaffold production-ready mobile applications.

## Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo SDK | 54 | Mobile framework |
| React Native | 0.81 | UI framework |
| React | 19.1.0 | Component library |
| expo-router | 5.0 | File-based navigation |
| zustand | 5.0 | State management |
| TypeScript | 5.8 | Type safety |
| Cloudflare Workers | - | Backend API |
| Hono | - | API framework |

## Repository Structure

```
reference/
└── expo-reference/           # Base template
    ├── app/                  # expo-router screens
    ├── components/ui/        # Pre-built UI components
    ├── lib/                  # Utilities
    │   ├── storage.ts        # AsyncStorage wrapper
    │   ├── store.ts          # Zustand state management
    │   └── utils.ts          # Helper functions
    ├── hooks/                # Custom React hooks
    ├── constants/            # App constants
    └── worker/               # Cloudflare Workers backend
        ├── index.ts          # Hono entrypoint (DO NOT MODIFY)
        ├── core-utils.ts     # Core utilities (DO NOT MODIFY)
        └── userRoutes.ts     # Custom API routes

definitions/
├── expo-blank.yaml           # Template configuration
└── expo-blank/
    └── prompts/
        ├── selection.md      # When to use this template
        └── usage.md          # Technical usage guide

tools/                        # Build scripts
```

## Current Template

**expo-blank** - Base template for simple mobile apps with Cloudflare Workers backend.

> More templates (expo-DO, expo-agents) are planned for future releases.

## Critical Rules

### ALWAYS Use

- **React Native components:** `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`
- **StyleSheet.create()** for all styling
- **expo-router** for navigation (`Link`, `useRouter`, `useLocalSearchParams`)
- **Pre-built components** from `@/components/ui`
- **zustand** for state management via `@/lib/store`

### NEVER Use

- HTML elements (`div`, `span`, `button`, `input`, `img`, `h1`, `p`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

## Code Patterns

### Screen Component

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button onPress={() => console.log('pressed')}>
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
```

### Navigation

```tsx
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

// Declarative
<Link href="/settings">
  <Text>Settings</Text>
</Link>

// Programmatic
const router = useRouter();
router.push('/settings');
router.replace('/home');
router.back();

// Dynamic params
const { id } = useLocalSearchParams<{ id: string }>();
```

### State Management

```tsx
import { useAppStore } from '@/lib/store';

// In component
const { theme, setTheme, isLoading, setData, getData } = useAppStore();

// Set data
setData('user', { name: 'John' });

// Get data
const user = getData('user');
```

### API Integration

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

// GET
const response = await fetch(`${API_URL}/api/items`);
const data = await response.json();

// POST
const response = await fetch(`${API_URL}/api/items`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'New Item' }),
});
```

### Adding API Routes (worker/userRoutes.ts)

```tsx
import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/items', (c) => c.json({ success: true, data: [] }));
  
  app.post('/api/items', async (c) => {
    const body = await c.req.json();
    return c.json({ success: true, data: body });
  });
}
```

## DO NOT MODIFY

These files are critical infrastructure:

- `worker/index.ts` - Worker entrypoint
- `worker/core-utils.ts` - Core utilities
- `wrangler.jsonc` - Binding configuration

## Development Workflow

### Generate Templates

```bash
# Generate all templates
python3 tools/generate_templates.py --clean

# Generate specific template
python3 tools/generate_templates.py -t expo-blank
```

### Create Catalog

```bash
python3 generate_template_catalog.py --output template_catalog.json --pretty
```

### Deploy

Templates are automatically deployed via GitHub Actions on push to `main`.

```bash
# Manual deployment
bash deploy_templates.sh
```

## Adding New Templates

1. Create YAML definition:

```yaml
# definitions/my-template.yaml
name: "my-template"
description: "My custom template"
base_reference: "expo-reference"
projectType: app
package_patches:
  name: "my-template"
  dependencies:
    "some-package": "^1.0.0"
```

2. Add overlay files in `definitions/my-template/`:
   - `prompts/selection.md` - When to use this template
   - `prompts/usage.md` - How to use it
   - Any worker/app overrides

3. Generate and test:

```bash
python3 tools/generate_templates.py -t my-template
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `div`, `span` | Use `View`, `Text` |
| Using Tailwind/className | Use `StyleSheet.create()` |
| Editing `build/` directly | Edit source in `reference/` or `definitions/` |
| Modifying `core-utils.ts` | This file is marked DO NOT MODIFY |
| Forgetting `prompts/` | Each template needs `selection.md` and `usage.md` |
| Using React Router | Use expo-router |

## Quality Standards

- No `any` types - use proper TypeScript types
- No HTML elements - only React Native components
- StyleSheet only - no Tailwind CSS or className
- DRY principle - extract shared code to base reference
- Professional comments - explain purpose, not changes
