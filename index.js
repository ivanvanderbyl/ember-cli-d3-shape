/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var rename = require('broccoli-stew').rename;
var AMDDefineFilter = require('./lib/amd-define-filter');
var fs = require('fs');

var Lookup = require('lookup-deps');

function lookupPackage(packageName) {
  var modulePath = require.resolve(packageName);
  var i = modulePath.lastIndexOf(path.sep + 'build');
  return modulePath.slice(0, i);
}

module.exports = {
  isDevelopingAddon: function() {
    return false;
  },

  name: 'ember-cli-d3-shape',

  d3Modules: [
    // Imported from package.json
  ],

  /**
   * `import()` taken from ember-cli 2.7
   */
  import: function(asset, options) {
    var app = this.app;
    while (app.app) {
      app = app.app;
    }
    app.import(asset, options);
  },

  included: function(app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;

    while (app.app) {
      app = app.app;
    }

    // Find all dependencies of `d3`
    this.lookupDeps = new Lookup();
    this.d3Modules = this.lookupDeps.depsKeys('d3');

    // This essentially means we'll skip importing this package twice, if it's
    // a dependency of another package.
    if (!app.import) {
      if (this.isDevelopingAddon()) {
        console.log('[ember-cli-d3-shape] skipping included hook for', app.name);
      }
      return;
    }

    var _this = this;
    this.d3Modules.forEach(function(packageName) {
      _this.import(path.join('vendor', packageName, packageName + '.js'));
    });
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) {
      trees.push(tree);
    }

    var d3PackagePath = this.lookupDeps.paths('d3').d3;

    this.d3Modules.forEach(function(packageName) {
      var d3PathToSrc, srcTree;

      // Import existing builds from node d3 packages, which are UMD packaged.
      var packageBuildPath = path.join('build', packageName + '.js');
      d3PathToSrc = path.join(d3PackagePath, 'node_modules', packageName);

      d3PathToSrc = lookupPackage(packageName);

      if (!fs.statSync(path.join(d3PathToSrc, packageBuildPath)).isFile()) {
        console.error('[ERROR] D3 Package (' + packageName + ') is not built as expected, cannot continue. Please report this as a bug.');
        return;
      }

      var tree = new Funnel(d3PathToSrc, {
        include: [packageBuildPath],
        destDir: '/' + packageName,
        annotation: 'Funnel: D3 Source [' + packageName + ']'
      });

      srcTree = new AMDDefineFilter(tree, packageName);
      trees.push(rename(srcTree, function() {
        return '/' + packageName + '/' + packageName + '.js';
      }));
    });

    return mergeTrees(trees);
  }
};
