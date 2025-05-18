import { defineCommand, runMain } from 'citty';
import path from 'node:path';

import { analyze } from './analyze.js';

const main = defineCommand({
  meta: {
    name: 'analyze-js-graph',
    description: 'Analyze function and variable relations in JS/TS',
  },
  args: {
    entry: {
      type: 'positional',
      required: true,
      description: 'Entry file to analyze',
    },
  },
  run({ args }) {
    const fullPath = path.resolve(args.entry);
    const result = analyze(fullPath);
    console.log(JSON.stringify(result, null, 2));
  },
});

runMain(main);
