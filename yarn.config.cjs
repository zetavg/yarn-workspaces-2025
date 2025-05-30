/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

const enforceMatchedPeerDependenciesForConfigs =
  require('./.yarn/constraints/enforceMatchedPeerDependenciesForConfigs.cjs').default;
const enforceNonPrivatePackagesHavePackPackageScript =
  require('./.yarn/constraints/enforceNonPrivatePackagesHavePackPackageScript.cjs').default;
const enforcePeerDependenciesOfDependenciesAreListed =
  require('./.yarn/constraints/enforcePeerDependenciesOfDependenciesAreListed.cjs').default;
const enforceDevDependenciesSatisfiesPeerDependencies =
  require('./.yarn/constraints/enforceDevDependenciesSatisfiesPeerDependencies.cjs').default;

const setVersions = require('./.yarn/constraints/setVersions.cjs').default;

module.exports = defineConfig({
  async constraints(ctx) {
    // Only check/set versions if the PACKAGES_VERSION environment variable is set.
    if (process.env.PACKAGES_VERSION) {
      setVersions(ctx, process.env.PACKAGES_VERSION);
      return;
    }

    // Normal constraints.
    enforceMatchedPeerDependenciesForConfigs(ctx);
    enforceNonPrivatePackagesHavePackPackageScript(ctx);
    enforcePeerDependenciesOfDependenciesAreListed(ctx);
    enforceDevDependenciesSatisfiesPeerDependencies(ctx);
  },
});
