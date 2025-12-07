# React Native + Expo Mobile App Templates

This repository contains the official template catalog for the **mobileapp-production** project - a mobile app generator that creates React Native + Expo applications with Cloudflare Workers backend.

## Overview

These templates are used by AI agents to scaffold production-ready mobile applications. All templates:

- Use **React Native + Expo SDK 52** for cross-platform mobile development
- Use **expo-router** for file-based navigation
- Use **StyleSheet.create()** for styling (NOT Tailwind CSS)
- Include **Cloudflare Workers + Hono** backend
- Are fully **TypeScript** with strict typing

## Available Templates

| Template | Description | Use Case |
|----------|-------------|----------|
| **expo-blank** | Basic Expo + Workers | Simple mobile apps, utilities, client-side apps |
| **expo-DO** | Expo + Durable Objects | Stateful apps (counters, user data, real-time) |
| **expo-DO-v2** | Expo + Multi-entity DO | Multi-entity storage (chat, e-commerce, dashboards) |
| **expo-agents** | Expo + AI Agents (MCP) | AI chatbots, intelligent assistants, LLM apps |

## Repository Structure

```
reference/
└── expo-reference/        # Base Expo template with Workers backend

definitions/
├── expo-blank.yaml        # Basic template config
├── expo-blank/
│   └── prompts/           # AI selection/usage docs
├── expo-DO.yaml           # Durable Objects config
├── expo-DO/
│   ├── worker/            # DO-specific worker code
│   ├── shared/            # Shared types
│   └── prompts/
├── expo-DO-v2.yaml        # Multi-entity DO config
├── expo-DO-v2/
│   ├── worker/            # Entity-based storage
│   ├── shared/
│   ├── lib/
│   └── prompts/
├── expo-agents.yaml       # AI Agents config
└── expo-agents/
    ├── worker/            # Agent, MCP, chat code
    └── prompts/

build/                     # Generated templates (gitignored)
tools/                     # Build scripts
zips/                      # Packaged templates
```

## Quick Start

### Prerequisites

- Python 3.10+
- Cloudflare Wrangler CLI (for R2 uploads)

### Generate Templates

```bash
# Generate all templates
python3 tools/generate_templates.py --clean

# Generate specific template
python3 tools/generate_templates.py -t expo-agents
```

### Create Catalog

```bash
python3 generate_template_catalog.py --output template_catalog.json --pretty
```

### Deploy to R2

```bash
# Set bucket name
export R2_BUCKET_NAME=mobileapp-templates

# Full deployment
bash deploy_templates.sh
```

## Template Architecture

### Frontend (React Native + Expo)

```
app/
├── _layout.tsx       # Root layout
├── index.tsx         # Home screen
└── [id].tsx          # Dynamic routes

components/
└── ui/               # Pre-built components (Button, Card, TextInput)

lib/
├── storage.ts        # AsyncStorage wrapper
└── utils.ts          # Utility functions
```

### Backend (Cloudflare Workers)

```
worker/
├── index.ts          # Hono entrypoint (DO NOT MODIFY)
├── core-utils.ts     # DO utilities (DO NOT MODIFY)
└── userRoutes.ts     # Custom API routes
```

## Critical Rules

### ALWAYS Use

- React Native components: `View`, `Text`, `ScrollView`, `TouchableOpacity`, `TextInput`, `Image`, `FlatList`
- `StyleSheet.create()` for all styling
- expo-router for navigation

### NEVER Use

- HTML elements (`div`, `span`, `button`, `input`)
- Tailwind CSS or `className` props
- CSS files or web styles
- React Router DOM

### Example Component

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

## Creating New Templates

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

## Integration with mobileapp-production

This template repository is deployed to Cloudflare R2 and consumed by the main `mobileapp-production` app.

The AI system automatically selects templates based on user requirements:
- "Create a todo app" → `expo-DO` or `expo-DO-v2`
- "Build a chat bot" → `expo-agents`
- "Simple calculator" → `expo-blank`

## Documentation

- **CLAUDE.md** - Detailed development guide
- **DEPLOYMENT_SETUP.md** - R2 deployment configuration
- **definitions/*/prompts/** - Template-specific documentation

## License

MIT
