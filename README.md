# Code Grapher

A code analysis and visualization tool that analyzes TypeScript/JavaScript code to extract function dependencies and relationships. Built as a monorepo using Yarn workspaces, TypeScript, and ESLint.

## Project Structure

- `apps/code-grapher/`: CLI tool that analyzes TypeScript/JavaScript files to extract function dependencies and call graphs
- `apps/code-grapher-viz/`: React web application for visualizing code analysis results with interactive graphs
- `packages/`: Utility libraries (`sum`, `plus-two`) used for testing and examples
- `configs/`: Shared configuration packages for TypeScript, ESLint, Babel, and Prettier

## Usage

### Code Analysis CLI

The `code-grapher` tool analyzes TypeScript/JavaScript files and outputs function dependency information as JSON:

```bash
cd apps/code-grapher
yarn main path/to/your/file.ts
```

Example with the included sample:
```bash
cd apps/code-grapher  
yarn main examples/single-file/index.ts
```

This will output a JSON structure containing:
- Function definitions with unique IDs
- Parameter information
- Function call relationships
- Module structure

### Visualization Web App

The `code-grapher-viz` app provides an interactive web interface to visualize the analysis results:

```bash
cd apps/code-grapher-viz
yarn dev
```

This starts a development server where you can load and visualize code analysis JSON files.

### Shared Configurations

To eliminate the need to maintain multiple copies of the same configurations, define the same dependencies across different packages, and still allow for package-specific overrides, we package the shared configurations into extendable packages to be installed and used by the packages needing them.

Note that for executables such as `tsc`, `eslint`, and `vitest` to be accessible from each workspace that uses the shared TypeScript, ESLint, and testing configurations, those workspaces should explicitly install such tools rather than relying on the shared configurations' dependencies. Therefore, the shared configurations will only list such dependencies as `"peerDependencies"`. The consistencies of those config-packages-defined `"peerDependencies"` can be automatically updated by running [`yarn constraints --fix`](https://yarnpkg.com/cli/constraints).

The `@yarn-workspaces-2025/eslint-config` package is installed at the root of the monorepo to lint top-level configuration files (such as `yarn.config.cjs`) and to force hoisting of the ESLint configs and plugins used in `@yarn-workspaces-2025/eslint-config`, ensuring their accessibility and not to be installed nested in the `eslint-config` package - where ESLint would not be able to find them.

### Using Uncompiled Source Code of Packages During Development

Normally, when we install and import a package from another package in the monorepo, due to the entry point defined in the `package.json` of the imported package, what we are importing is the compiled code (e.g., `dist/`), but not the source code (e.g., `src/`). This means that we need to recompile the imported package every time we make a change to it, which is not very convenient for development. Also, the "Go to Definition" feature of IDEs might not be as convenient as will be taking us to the compiled definitions instead of the definitions in the source code.

As a workaround, we can leverage TypeScript's `paths` compiler option in the `tsconfig.json` of the importing package to map the import path to the source code of the imported package. This way, we can switch to importing the source code instead of the compiled code during development without changing the import paths in the source code of the importing package. This is especially useful when we are working on both the importing and imported packages at the same time.

See the `tsconfig.json` files of `packages/plus-two` and `apps/code-grapher` for examples.

> [!NOTE]
> Defining the `paths` compiler option will not change how import paths are emitted, while this is the desired behavior for building the package for distribution, but you will need to make sure you have also handled the mappings while using other tools such as Jest, `ts-node` or Babel.
>
> For Vitest, it will be done automatically by using the test configuration provided by the monorepo setup.
>
> As for `ts-node`, it can be done by using the `tsconfig-paths` package, see the `tsconfig.json` file in `apps/code-grapher` for an example.

## Development

### Building the Project

```bash
yarn build
```

### Running Tests

```bash
yarn test
```

### Linting

```bash
yarn lint
```

### Type Checking

```bash
yarn typecheck
```
