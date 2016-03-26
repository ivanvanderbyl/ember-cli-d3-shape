/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var rename = require('broccoli-stew').rename;
var esTranspiler = require('broccoli-babel-transpiler');
var concat = require('broccoli-concat');
var packageDependencies = require("./package.json")['dependencies'];
var AMDDefineFilter = require('./lib/amd-define-filter');
var fs = require('fs');

function lookupPackage(packageName) {
  var modulePath = require.resolve(packageName);
  var i = modulePath.lastIndexOf('/build');
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

  /**
   * Compiles ES6 sources to ES5 AMD packages for Ember to load.
   *
   * This is used when one of the D3 sources is pegged at the github repo.
   *
   * @param  {String} src         Package src directory
   * @param  {String} packageName Package Name
   *
   * @return {Node}               Broccoli tree
   */
  compileSourceTree: function(src, packageName) {
    var srcTree = new Funnel(src, {
      include: ['src/**/*.js', 'index.js'],
      destDir: '/' + packageName,
      annotation: 'Funnel: D3 Source ['+ packageName + ']'
    });

    return esTranspiler(srcTree, {
      persist: false,

      stage: 0,
      moduleIds: true,
      modules: 'amd',

      comments: true,
      compact: false,
      loose: false,

      moduleRoot: packageName,

      getModuleId: function (name) {
        name = name
          .replace(/\/index$/, '')
          .replace(/\/src/, '');
        return name;
      },

      resolveModuleSource: function (source, filename) {
        if (/\.\//.test(source)) {
          // This is a relative import from within the package
          var newPath = path.resolve("/", filename, "..", source)
            .replace(/\/src/, '')
            .replace(/^\//, '');

          return newPath;
        }else{
          // This is *probably* an import for another package.
          return source;
        }
      }
    }, {
      annotation: 'Transpile D3 source to AMD ['+ packageName+ ']',
    });
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) { trees.push(tree); }

    this.d3Modules.forEach(function(packageName) {
      var importFileBaseName = path.parse(require.resolve(packageName)).name;
      var d3PathToSrc, srcTree;

      if (importFileBaseName === 'index') {
        // Import ES6 source code.
        d3PathToSrc = require.resolve(packageName).replace(/index\.js$/, '');
        srcTree = this.compileSourceTree(path.join(d3PathToSrc), packageName);
          trees.push(concat(srcTree, {
          inputFiles: [
            '**/**/*.js',
          ],
          outputFile: '/' + packageName + '/' + packageName + '.js'
        }));
      }else{
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
      }

    });

    return mergeTrees(trees);
  }
};
