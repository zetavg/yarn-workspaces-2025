# TypeScript Config

This package provides some shared TypeScript configurations for all workspaces in the monorepo.

## Install

```bash
yarn add @yarn-workspaces-2025/tsconfig --dev && yarn constraints --fix && yarn
```

Then, add the following to your `tsconfig.json`:

```json5
{
  "extends": "@yarn-workspaces-2025/tsconfig",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"] // Optional path mappings
    }
  },
  "include": [
    "**/*.ts"
  ]
}
```
