const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This app lives nested inside the myhouse repo, which has its own
// unrelated node_modules (the ATELIER web app) higher up the tree. Without
// this, Metro's hierarchical lookup can resolve a bare import like "react"
// against that ancestor's copy instead of this project's own, causing two
// React instances to load at once.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
