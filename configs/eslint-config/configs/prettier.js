import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    extends: [eslintPluginPrettierRecommended],
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
        },
      ],
    },
  },
]);
