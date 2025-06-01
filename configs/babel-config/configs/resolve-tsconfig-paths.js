import moduleResolverPlugin from 'babel-plugin-module-resolver';
import tsconfigPaths from 'tsconfig-paths';

import * as constants from '../constants/index.js';

/**
 * Babel configuration that resolves TypeScript paths based on the `tsconfig.json` file.
 * @type {import('@babel/core').ConfigFunction}
 */
export default function () {
  const tsconfigPathsConfigLoadResult = tsconfigPaths.loadConfig();

  return {
    plugins: [
      [
        moduleResolverPlugin,
        {
          extensions: constants.DEFAULT_EXTENSIONS,
          cwd: tsconfigPathsConfigLoadResult.baseUrl,
          alias: {
            ...Object.fromEntries(
              Object.entries(tsconfigPathsConfigLoadResult.paths).map(
                ([k, v]) => {
                  const key = k.replace(/\/\*$/, '');
                  let value = v[0].replace(/\/\*$/, '');

                  if (!value.startsWith('./')) {
                    value = `./${value}`;
                  }

                  return [key, value];
                },
              ),
            ),
          },
        },
      ],
    ],
  };
}
