import markdown from '@eslint/markdown';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import * as configSets from '../config-sets/index.js';
import * as configs from '../configs/index.js';

export default defineConfig([
  { ignores: ['dist', 'node_modules'] },
  tseslint.configs.recommended,
  vitest.configs.recommended,
  configs.json,
  markdown.configs.recommended,
  {
    name: 'Configs Applied to All JS/TS Files',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [configSets.default],
  },
  {
    name: 'Configs for React Files',
    files: ['**/*.[j,t]sx'],
    extends: [configs.react],
  },
  {
    name: 'Configs for CommonJS Files',
    files: ['**/*.cjs'],
    extends: [configs.commonjs],
  },
]);
