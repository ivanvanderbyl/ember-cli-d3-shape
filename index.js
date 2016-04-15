/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var rename = require('broccoli-stew').rename;
var packageDependencies = require("./package.json")['dependencies'];
var AMDDefineFilter = require('./lib/amd-define-filter');
var fs = require('fs');

function lookupPackage(packageName) {
  var modulePath = require.resolve(packageName);
  var i = modulePath.lastIndexOf(path.sep + 'build');
  return modulePath.slice(0, i);
}

module.exports = {
  isDevelopingAddon: function(){
    return true;
  },

  name: 'ember-cli-d3-shape',

  d3Modules: [
    // Imported from package.json
  ],

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app = app;

    this.d3Modules = [];

    for (var packageName in packageDependencies) {
      if (packageDependencies.hasOwnProperty(packageName)) {
        if (/^d3\-/.test(packageName)) {
          this.d3Modules.push(packageName);
        }
      }
    }

    this.d3Modules.forEach(function(packageName) {
      app.import(path.join('vendor', packageName, packageName + '.js'));
    });
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) { trees.push(tree); }

    this.d3Modules.forEach(function(packageName) {
      var d3PathToSrc, srcTree;

      // Import existing builds from node d3 packages, which are UMD packaged.
      var packageBuildPath = path.join('build', packageName + '.js');
      d3PathToSrc = lookupPackage(packageName);

      if (!fs.statSync(path.join(d3PathToSrc, packageBuildPath)).isFile()) {
        console.error("[ERROR] D3 Package (" + packageName + ") is not built as expected, cannot continue. Please report this as a bug.");
        return;
      }

      var tree = new Funnel(d3PathToSrc, {
        include: [packageBuildPath],
        destDir: '/' + packageName,
        annotation: 'Funnel: D3 Source ['+ packageName + ']'
      });

      srcTree = new AMDDefineFilter(tree, packageName);
      trees.push(rename(srcTree, function() {
        return '/' + packageName + '/' + packageName + '.js';
      }));
    });

    return mergeTrees(trees);
  }
};
