import moduleExtensionResolverPlugin from 'babel-plugin-module-extension-resolver';

/**
 * Babel configuration for ES Module output.
 * @type {import('@babel/core').ConfigFunction}
 */
export default function () {
  return {
    plugins: [
      [
        moduleExtensionResolverPlugin,
        {
          dstExtension: '.mjs',
        },
      ],
    ],
  };
}
