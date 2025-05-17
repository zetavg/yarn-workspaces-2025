# ESLint Config

This package provides some shared ESLint configurations for all workspaces in the monorepo.

## Install

```bash
yarn add @yarn-workspaces-2025/eslint-config --dev && yarn constraints --fix && yarn
```

Then, add the following to your `.eslintrc.js`:

```js
/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@yarn-workspaces-2025'],
};

module.exports = config;
```
