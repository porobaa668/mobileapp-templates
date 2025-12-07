# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains the **React Native + Expo mobile app template catalog** for the mobileapp-production project. Templates are dynamically generated from base references and overlay configurations to create production-ready mobile applications.

### Key Concepts

**Dynamic Generation Architecture**: Templates are generated through a three-tier system:
1. **Base References** (`reference/`) - Clean starter template (`expo-reference`)
2. **Template Definitions** (`definitions/`) - YAML configs + overlay files that customize base references
3. **Generated Output** (`build/`) - Final templates created by applying overlays to base references

## Directory Structure

```
reference/              # Base reference template
└── expo-reference/     # Base React Native + Expo template with Cloudflare Workers

definitions/            # Template definitions and overlays
├── *.yaml              # Template configuration files
└── <template-name>/    # Overlay files that customize the base reference
    ├── worker/         # Cloudflare Worker code overrides
    ├── shared/         # Shared types and data
    ├── lib/            # Library utilities
    ├── prompts/        # AI selection and usage docs (required)
    └── wrangler.jsonc  # Worker configuration

build/                  # Generated templates (gitignored, regenerate as needed)
tools/                  # Build and verification scripts
zips/                   # Packaged templates for distribution
```

## Template Types

All templates are **React Native + Expo** mobile apps with Cloudflare Workers backend:

| Template | Description | Use Case |
|----------|-------------|----------|
| **expo-blank** | Basic Expo + Workers | Simple mobile apps, client-side apps with basic API |
| **expo-DO** | Expo + Durable Objects | Stateful apps (counters, user data, real-time features) |
| **expo-DO-v2** | Expo + Multi-entity DO | Multi-entity storage (chat apps, e-commerce, dashboards) |
| **expo-agents** | Expo + AI Agents (MCP) | AI chatbots, intelligent assistants, LLM-powered apps |

### Common Patterns Across All Templates

- **React Native + Expo SDK 52** for cross-platform mobile development
- **expo-router ~4.0** for file-based navigation
- **StyleSheet.create()** for styling (NOT Tailwind CSS)
- **Cloudflare Workers + Hono** for backend APIs
- **TypeScript** with strict typing
- Pre-built UI components (Button, Card, TextInput)

### Critical Restrictions

**ALWAYS use:**
- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`
- `StyleSheet.create()` for all styling
- expo-router for navigation (`Link`, `useRouter`, `useLocalSearchParams`)

**NEVER use:**
- HTML elements (`div`, `span`, `button`, `input`, `img`, `h1`, `p`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

## Development Workflows

### Template Generation (Most Common)

```bash
# Generate all templates from definitions
python3 tools/generate_templates.py --clean

# Generate a specific template
python3 tools/generate_templates.py -t expo-agents

# Generate and verify with diffs
python3 tools/generate_templates.py --verify --diffs
```

### Template Catalog and Deployment

```bash
# Generate template catalog from build/ directory
python3 generate_template_catalog.py --output template_catalog.json --pretty

# Package a single template
python3 create_zip.py build/expo-agents zips/expo-agents.zip

# Full deployment pipeline (generate, catalog, zip, upload to R2)
bash deploy_templates.sh
```

## Creating or Modifying Templates

### Template Definition Structure

Each template requires:
1. **YAML Definition** in `definitions/<template-name>.yaml`
2. **Overlay Directory** at `definitions/<template-name>/` with customizations
3. **Required Files** in overlay:
   - `prompts/selection.md` - AI selection description
   - `prompts/usage.md` - Usage instructions
   - `wrangler.jsonc` - Worker config (if different from base)
   - Additional overrides as needed

### YAML Configuration Schema

```yaml
name: "template-name"
description: "Short description for catalog"
base_reference: "expo-reference"
projectType: app
disabled: false

# Deep merge patches applied to package.json (optional)
package_patches:
  name: "template-name"
  dependencies:
    "new-package": "^1.0.0"

# Glob patterns to exclude from final template (optional)
excludes:
  - "app/demo.tsx"
```

### Generation Process Flow

1. Copy base reference (`expo-reference/`) to `build/<template-name>/`
2. Apply overlay files from `definitions/<template-name>/` (overwriting base files)
3. Apply `package_patches` if specified (deep merge into package.json)
4. Remove files matching `excludes` patterns

## Worker Architecture

### Base Worker Structure (expo-reference)

```
worker/
├── index.ts          # Worker entrypoint (Hono server) - DO NOT MODIFY
├── core-utils.ts     # DO utilities - DO NOT MODIFY
└── userRoutes.ts     # Add your custom routes here
```

### Template-Specific Workers

**expo-DO** (Durable Objects):
- `worker/durableObject.ts` - DO class definition
- `worker/userRoutes.ts` - API routes using DO
- `worker/types.ts` - Backend types

**expo-DO-v2** (Multi-entity storage):
- `worker/entities.ts` - Entity definitions (User, Item, etc.)
- `worker/user-routes.ts` - API routes with entity helpers
- `worker/core-utils.ts` - IndexedEntity utilities

**expo-agents** (AI Agents):
- `worker/agent.ts` - Main agent class
- `worker/chat.ts` - OpenAI integration
- `worker/mcp-client.ts` - MCP server integration
- `worker/tools.ts` - Tool routing and coordination
- `worker/config.ts` - Centralized configuration
- `worker/app-controller.ts` - Control plane DO

### Important: DO NOT MODIFY

These files are critical infrastructure and should never be modified:
- `worker/index.ts` - Worker entrypoint
- `worker/core-utils.ts` - DO/Entity utilities
- `wrangler.jsonc` - Binding configuration

## Frontend Architecture

### File-based Routing (expo-router)

```
app/
├── _layout.tsx      # Root layout
├── index.tsx        # Home screen (/)
├── settings.tsx     # Settings screen (/settings)
└── [id].tsx         # Dynamic route (/123)
```

### Navigation Patterns

```tsx
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

// Declarative navigation
<Link href="/settings">
  <Text>Settings</Text>
</Link>

// Programmatic navigation
const router = useRouter();
router.push('/settings');
router.replace('/home');
router.back();

// Dynamic params
const { id } = useLocalSearchParams<{ id: string }>();
```

### Styling Pattern

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
```

### Pre-built Components

Import from `@/components/ui/*`:
- `Button` - Touchable button with variants
- `Card`, `CardHeader`, `CardContent` - Card container
- `TextInput` - Styled text input

## API Integration Pattern

### Calling Backend from React Native

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

// GET request
const response = await fetch(`${API_URL}/api/items`);
const data = await response.json();

// POST request
const response = await fetch(`${API_URL}/api/items`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'New Item' }),
});
```

### Adding API Routes (worker/userRoutes.ts)

```typescript
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

## Deployment

### R2 Deployment

```bash
# Set environment variable
export R2_BUCKET_NAME=mobileapp-templates

# Full deployment (generate + catalog + zip + upload)
bash deploy_templates.sh
```

### GitHub Actions

Automated deployment via GitHub Actions:
- Triggered on push to main branch
- Generates all templates
- Creates catalog and zips
- Uploads to R2

See `DEPLOYMENT_SETUP.md` for secrets configuration.

## Code Quality Standards

- **No `any` types** - Always use proper TypeScript types
- **No HTML elements** - Only React Native components
- **StyleSheet only** - No Tailwind CSS or className
- **Strict DRY** - Extract shared code to base reference
- **Professional comments** - Explain purpose, not changes

## Common Pitfalls

1. **Using HTML elements** - Use `View`, `Text`, `TouchableOpacity` instead
2. **Using Tailwind/className** - Use `StyleSheet.create()` instead
3. **Editing build/ directly** - Changes are lost on regeneration
4. **Modifying core-utils.ts** - This file is marked DO NOT MODIFY
5. **Forgetting prompts/** - Each template needs `selection.md` and `usage.md`
