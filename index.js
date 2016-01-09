/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var esTranspiler = require('broccoli-babel-transpiler');
const concat = require('broccoli-concat');

module.exports = {
  isDevelopingAddon: function(){
    return true;
  },

  name: 'd3',

  d3Modules: [
    'd3-path',
    'd3-shape',
    'd3-selection',
    'd3-array',
    'd3-scale',
    'd3-interpolate',
    'd3-color',
    'd3-format',
    'd3-time-format',
    'd3-time',
    'd3-ease',
    'd3-collection',
    // 'd3-transition', // Disabled until this is ported from d3 properly
  ],

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app = app;

    this.d3Modules.forEach(function(packageName) {
      app.import(path.join('vendor', packageName, packageName + '.js'));
    });
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) { trees.push(tree); }

    this.d3Modules.forEach(function(packageName) {
      let importFileBaseName = path.parse(require.resolve(packageName)).name;
      var d3PathToSrc;
      if (importFileBaseName === 'index') {
        d3PathToSrc = require.resolve(packageName).replace(/index\.js$/, '');
      }else{
        var packageBuildPath = path.join('build', packageName + '.js');
        d3PathToSrc = require.resolve(packageName).replace(packageBuildPath, '');
      }

      let srcTree = new Funnel(path.join(d3PathToSrc), {
        include: ['src/**/*.js', 'index.js'],
        destDir: '/' + packageName,
        annotation: 'Funnel: D3 Source ['+ packageName + ']'
      });

      var compiledSrcTree = esTranspiler(srcTree, {
        persist: false,

        stage: 0,
        moduleIds: true,
        modules: 'amd',

        comments: true,
        compact: false,
        loose: false,

        moduleRoot: packageName,

        // blacklist: [
        //   'useStrict'
        // ],

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

      trees.push(concat(compiledSrcTree, {
        inputFiles: [
          '**/**/*.js'
        ],
        outputFile: '/' + packageName + '/' + packageName + '.js'
      }));
    });

    return mergeTrees(trees);
  }
};
