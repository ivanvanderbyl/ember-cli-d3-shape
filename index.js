/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var esTranspiler = require('broccoli-babel-transpiler');
const concat = require('broccoli-concat');
var packageDependencies = require("./package.json")['dependencies'];
var Filter = require('broccoli-filter');

function UMDToAMDRewriteFilter(inputNode, packageName, options) {
  options = options || {};
  Filter.call(this, inputNode, {
    annotation: options.annotation
  });
  this.packageName = packageName;
}

UMDToAMDRewriteFilter.prototype = Object.create(Filter.prototype);
UMDToAMDRewriteFilter.prototype.constructor = UMDToAMDRewriteFilter;

function createAMDHeader() {
  return "  // ember-cli-d3-primitive: Insert a fake AMD definition so that Ember's loader.js loads this UMD build.\n" +
         "  define.amd = true";
}

UMDToAMDRewriteFilter.prototype.processString = function(content) {
  var lines = content.split(/\n/);
  var header = createAMDHeader();
  lines.splice(1, 0, header);
  return lines.join("\n");
};

module.exports = {
  isDevelopingAddon: function(){
    return true;
  },

  name: 'd3',

  d3Modules: [
    // Imported from package.json
    // 'd3-transition', // Disabled until this is ported from d3 properly
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
      let importFileBaseName = path.parse(require.resolve(packageName)).name;
      var d3PathToSrc, srcTree;

      if (importFileBaseName === 'index') {
        d3PathToSrc = require.resolve(packageName).replace(/index\.js$/, '');
        srcTree = this.compileSourceTree(path.join(d3PathToSrc), packageName);
      }else{
        var packageBuildPath = path.join('build', packageName + '.js');
        d3PathToSrc = require.resolve(packageName).replace(packageBuildPath, '');
        var tree = new Funnel(d3PathToSrc, {
          include: [packageBuildPath],
          destDir: '/' + packageName,
          annotation: 'Funnel: D3 Source ['+ packageName + ']'
        });

        srcTree = new UMDToAMDRewriteFilter(tree, packageName);
      }

      trees.push(concat(srcTree, {
        inputFiles: [
          '**/**/*.js',
        ],
        outputFile: '/' + packageName + '/' + packageName + '.js'
      }));
    });

    return mergeTrees(trees);
  }
};
