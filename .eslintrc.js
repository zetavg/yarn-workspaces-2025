/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@yarn-workspaces-2025'],
  ignorePatterns: ['!.yarn'],
  env: { node: true },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};

module.exports = config;
