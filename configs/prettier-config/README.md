# Prettier Config

Shared Prettier configurations.

## Install

```bash
yarn add @yarn-workspaces-2025/prettier-config --dev
```

Then, add the following to your `prettier.config.mjs`:

```js
import defaultConfig from '@yarn-workspaces-2025/prettier-config';

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...defaultConfig,
};

export default config;
```
