import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    plugins: {
      import: {
        ...importPlugin.flatConfigs.recommended.plugins.import,
        rules: {
          ...importPlugin.flatConfigs.recommended.plugins.import.rules,
          /** Borrowing this rule from [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/6d15a02d48de7ecfc38d0683a8487b2f937d83a0/rules/prefer-node-protocol.js) since the [new import/enforce-node-protocol-usage rule](https://github.com/import-js/eslint-plugin-import/pull/3024) isn't published yet. */
          'enforce-node-protocol-usage':
            eslintPluginUnicorn.configs.all.plugins.unicorn.rules[
              'prefer-node-protocol'
            ],
        },
      },
    },
    rules: {
      'unicorn/prefer-node-protocol': 'off', // With this config, we are using the `import/enforce-node-protocol-usage` rule instead.
      ...importPlugin.flatConfigs.recommended.rules,
      'import/enforce-node-protocol-usage': 'warn',
      'import/no-unresolved': 'off', // This sometimes cannot resolve paths correctly, providing false alerts.
    },
  },
]);
