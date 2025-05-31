import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    rules: {
      curly: ['warn', 'multi-line', 'consistent'],
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'no-debugger': 'warn',
    },
    languageOptions: {
      globals: {
        ...globals['shared-node-browser'],
        process: 'readonly',
      },
    },
  },
]);
