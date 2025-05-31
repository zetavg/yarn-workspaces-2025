import globals from 'globals';

import * as configSets from './config-sets/index.js';
import * as configs from './configs/index.js';
import * as presets from './presets/index.js';

const defaultExport = [...presets.default];
defaultExport.globals = globals;
defaultExport.configs = configs;
defaultExport.configSets = configSets;
defaultExport.presets = presets;

export default defaultExport;

export { configs, configSets, globals, presets };
