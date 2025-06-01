import typescriptPreset from '@babel/preset-typescript';

import * as configs from '../configs/index.js';

/**
 * Babel configuration for dual module package builds.
 * @type {import('@babel/core').ConfigFunction}
 */
export default function (api) {
  const env = api.env();

  return {
    presets: [
      ...(() => {
        switch (env) {
          case 'cjs':
            return [configs.cjs];
          case 'esm':
            return [configs.esm];
          default:
            return [];
        }
      })(),
      configs.resolveTsconfigPaths,
      typescriptPreset,
    ],
    sourceMaps: true,
  };
}
