import * as constants from '../constants/index.js';

export default [
  // https://github.com/babel/babel/issues/12008
  ...constants.DEFAULT_EXTENSIONS.map((ext) => `**/*.test${ext}`),
  '**/__tests__/**',
];
