import { ignores, presets } from '@yarn-workspaces-2025/babel-config';

/** @type {import('@babel/core').ConfigFunction} */
export default function (api) {
  const env = api.env();

  return {
    presets: [presets.package],
    ignore: [
      // Only ignore test files in build process, not in development.
      ...(env ? ignores.testFiles : []),
    ],
  };
}
