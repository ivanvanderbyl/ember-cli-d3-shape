/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var rename = require('broccoli-stew').rename;
var path = require('path');
// var d3Path = require('d3-path');
// var fs = require('fs');
var esTranspiler = require('broccoli-babel-transpiler');
// var BroccoliRemap = require('broccoli-petal');
const pkg = require('./package.json');
const concat = require('broccoli-concat');

module.exports = {
  name: 'ember-cli-d3',

  // init: function(name) {
    // var assets_path = require('path').join('d3-path', 'build','d3-path.js');
    // this.treePaths['vendor'] = require.resolve('d3-path').replace(assets_path, '');

    // console.log(require('./vendor/fake-module'));
  // },

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.app = app;


    // var d3PathModule = fs.readFileSync(require.resolve('d3-path'));
    // var remap = new BroccoliRemap(this.treeGenerator(require.resolve('d3-path')));
    // console.log(remap.processString(d3PathModule.toString(), "d3-path"));

    // this.app.import('vendor/d3-path/build/d3-path.js', {
    //   // destDir: 'd3-path',
    //   exports: {
    //     'd3-path': [ 'default' ],
    //   }
    // });

    // this.app.import('vendor/shims/d3-path.js', {
    //   exports: {
    //     'd3-path': [ 'path' ]
    //   }
    // });

    app.import('vendor/d3-path/main.js', {
      prepend: false,
      exports: {
        'path': [ 'default' ]
      }
    });

    app.import('vendor/d3-shape/main.js', {
      prepend: false,
      exports: {
        'd3-shape': [
          'default',
          'curve/cardinal',
        ]
      }
    });
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) { trees.push(tree); }

    var d3Modules = [
      'd3-path',
      'd3-shape',
    ];

    d3Modules.forEach(function(moduleName) {
      var d3PathToBuild = path.join('build', moduleName + '.js');
      var d3PathToSrc = require.resolve(moduleName).replace(d3PathToBuild, '');

      let srcTree = new Funnel(path.join(d3PathToSrc), {
        include: ['src/*', 'index.js', 'build/bundle.js'],
        exclude: ['img', 'build'],
      });

      var preProcesedTree = rename(srcTree, function(name) {
        // console.log(name);
        return path.join(moduleName, name);
      });

      // var postprocessedSrcTree = this.app.addonPostprocessTree('js', preProcesedTree);

      var compiledSrcTree = esTranspiler(preProcesedTree, {
        stage: 0,
        moduleIds: true,
        modules: 'amd',
        // code: true,

        // // Transforms /index.js files to use their containing directory name
        // getModuleId: function (name) {
        //   console.log(name);
        //   name = moduleName + '/' + name;
        //   return name.replace(/\/index$/, '');
        // },

        // // Fix relative imports inside /index's
        // resolveModuleSource: function (source, filename) {
        //   console.log(filename);
        //   var match = filename.match(/(.+)\/index\.\S+$/i);

        //   // is this an import inside an /index file?
        //   if (match) {
        //     var path = match[1];
        //     return source
        //       .replace(/^\.\//, path + '/')
        //       .replace(/^\.\.\//, '');
        //   } else {
        //     return source;
        //   }
        // }
      });

      trees.push(concat(compiledSrcTree, {
        inputFiles: [
          '**/**/*.js'
        ],
        outputFile: '/' + moduleName + '/main.js'
      }));
    });

    // console.log(trees);


    // trees.push(rename(new Funnel(this.project.bowerDirectory + '/moment-timezone/builds', {
    //     files: [timezonePath[timezonePath.length - 1]]
    //   }), function(filepath) {
    //     return 'moment-timezone/tz.js';
    //   }));
    // });

    return mergeTrees(trees);
    // this._super.treeForAddon.call(this, mergeTrees(trees));
  }
};


// module.exports = {
//   name: 'ember-cli-d3',

//   included: function(app) {
//     this._super.included.apply(this, arguments);

//     // see: https://github.com/ember-cli/ember-cli/issues/3718
//     if (typeof app.import !== 'function' && app.app) {
//       app = app.app;
//     }

//     this.app = app;
//     // this.momentOptions = this.getConfig();
//     this.importDependencies(app);
//   },

//   importDependencies: function(app) {
//     if (arguments.length < 1) {
//       throw new Error('Application instance must be passed to import');
//     }
//     // console.log(this.project.addonPackages);
//     // console.log(this.project.nodeModulesPath);
//     // console.log(this.project.addons);
//     // console.log(this.addonDiscovery);



//     // var vendor = this.treePaths.vendor;
//     // console.log(this.treePaths);

//     // app.import(vendor + '/d3-path/d3-path.js', {
//     //   default:['d3-path']
//     // });

//     // app.import(vendor + '/d3-path/d3-path.js', {
//     //   prepend: true,
//     //   exports: {
//     //     default: 'd3_path'
//     //   }
//     // });
//   },

//   // treeForVendor: function(vendorTree) {
//   //   var trees = [];

//   //   if (vendorTree) {
//   //     // trees.push(vendorTree);
//   //   }

//   //   var packagePath = ['node_modules', 'd3-path', 'src'].join('/');

//   //   trees.push(new Funnel(packagePath, {
//   //     destDir: 'd3-path',
//   //     // include: [new RegExp(/\.js$/)],
//   //     // exclude: ['min', 'version', 'bundle'].map(function(key) {
//   //     //   return new RegExp(key + '\.js$');
//   //     // })
//   //   }));

//   //   console.log(trees);

//   //   return mergeTrees(trees);
//   // }
// };
