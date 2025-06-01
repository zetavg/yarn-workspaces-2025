import commonjsPlugin from '@babel/plugin-transform-modules-commonjs';

/**
 * Babel configuration for CommonJS output.
 * @type {import('@babel/core').ConfigFunction}
 */
export default function () {
  return {
    plugins: [commonjsPlugin],
  };
}
