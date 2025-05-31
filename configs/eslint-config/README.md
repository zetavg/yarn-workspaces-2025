# ESLint Config

Shared ESLint configurations.

## Install

```bash
yarn add @yarn-workspaces-2025/eslint-config --dev
```

Then, add the following to your `eslint.config.js` (or `eslint.config.mjs`):

```js
import { defineConfig } from 'eslint/config';
import config from '@yarn-workspaces-2025/eslint-config';

export default defineConfig([config]);
```
