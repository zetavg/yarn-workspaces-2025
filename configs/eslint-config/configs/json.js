import json from '@eslint/json';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    plugins: {
      json,
    },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error',
    },
  },
]);
