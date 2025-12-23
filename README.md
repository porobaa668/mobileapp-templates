# React Native + Expo Mobile App Templates

Official template repository for **mobileapp-production** - a mobile app generator that creates React Native + Expo applications with Cloudflare Workers backend.

## Stack

- **Expo SDK 54** with React Native 0.81
- **React 19.1.0** with TypeScript
- **expo-router 5.0** for file-based navigation
- **Cloudflare Workers + Hono** for backend API
- **zustand** for state management
- **StyleSheet.create()** for styling (NOT Tailwind CSS)

## Current Template

| Template | Description | Use Case |
|----------|-------------|----------|
| **expo-blank** | Base Expo + Workers | Simple mobile apps, utilities, client-side apps |

> More templates (expo-DO, expo-agents) are planned for future releases.

## Repository Structure

```
reference/
└── expo-reference/           # Base Expo template
    ├── app/                  # expo-router screens
    ├── components/ui/        # Pre-built UI components
    ├── lib/                  # Utilities (storage, store, utils)
    ├── hooks/                # Custom React hooks
    ├── constants/            # App constants
    └── worker/               # Cloudflare Workers backend

definitions/
├── expo-blank.yaml           # Template configuration
└── expo-blank/
    └── prompts/              # AI selection/usage docs
        ├── selection.md      # When to use this template
        └── usage.md          # Technical usage guide

tools/                        # Build scripts
```

## Quick Start

### Generate Templates

```bash
# Generate all templates
python3 tools/generate_templates.py --clean

# Generate catalog
python3 generate_template_catalog.py --output template_catalog.json --pretty
```

### Deploy to R2

```bash
# Full deployment (via GitHub Actions on push to main)
git push origin main

# Manual deployment
bash deploy_templates.sh
```

## Template Architecture

### Frontend (React Native)

```
app/
├── _layout.tsx     # Root layout with providers
├── index.tsx       # Home screen (/)
└── [id].tsx        # Dynamic routes

components/ui/
├── Button.tsx      # Touchable button
├── Card.tsx        # Card container
└── TextInput.tsx   # Styled text input

lib/
├── storage.ts      # AsyncStorage wrapper
├── store.ts        # Zustand state management
└── utils.ts        # Utility functions
```

### Backend (Cloudflare Workers)

```
worker/
├── index.ts        # Hono entrypoint (DO NOT MODIFY)
├── core-utils.ts   # Core utilities (DO NOT MODIFY)
└── userRoutes.ts   # Custom API routes
```

## Critical Rules

### ALWAYS Use

- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`
- `StyleSheet.create()` for all styling
- expo-router for navigation (`Link`, `useRouter`, `useLocalSearchParams`)
- Pre-built components from `@/components/ui`

### NEVER Use

- HTML elements (`div`, `span`, `button`, `input`, `img`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

## Example Component

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

## Deployment

Templates are automatically deployed to Cloudflare R2 via GitHub Actions on push to `main` branch.

**R2 Bucket:** `mobileapp-templates`

**Access URLs:**
- Catalog: `https://<bucket>.r2.dev/template_catalog.json`
- Templates: `https://<bucket>.r2.dev/<template-name>.zip`

## Documentation

- **CLAUDE.md** - Development guide for AI assistants
- **DEPLOYMENT_SETUP.md** - R2 and GitHub Actions configuration
- **definitions/*/prompts/** - Template-specific documentation

## License

MIT
