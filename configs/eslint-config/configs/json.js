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
    ignores: [
      '**/tsconfig.json', // tsconfig files may contain comments, which ESLint can't parse
    ],
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error',
    },
  },
]);
