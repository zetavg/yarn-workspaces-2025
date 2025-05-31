import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

import * as configs from '../configs/index.js';

export default defineConfig([
  {
    extends: [
      js.configs.recommended,
      configs.prettier,
      configs.general,
      configs.noUnusedVars,
      configs.imports,
      configs.importsSort,
      configs.todoComments,
    ],
  },
]);
