import type { Config } from 'jest';

import { jestBaseConfig } from '@yarn-workspaces-2025/jest-config';

const baseConfig = jestBaseConfig({ dirname: __dirname });

const config: Config = {
  ...baseConfig,
};

export default config;
