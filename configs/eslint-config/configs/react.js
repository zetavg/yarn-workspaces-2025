import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig([
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
