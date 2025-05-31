import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    plugins: {
      'todo-comments': {
        rules: {
          'expiring-todo-comments':
            eslintPluginUnicorn.configs.all.plugins.unicorn.rules[
              'expiring-todo-comments'
            ],
        },
      },
    },
    rules: {
      'no-warning-comments': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'todo-comments/expiring-todo-comments': [
        'warn',
        { allowWarningComments: false },
      ],
    },
  },
]);
