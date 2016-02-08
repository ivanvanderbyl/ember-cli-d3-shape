/* jshint node: true */
'use strict';
var rewriteAMDFunction = require('../lib/rewrite-amd-definition');
var fs = require('fs');

var out = rewriteAMDFunction(fs.readFileSync("./node_modules/d3-scale/build/d3-scale.js"), 'd3-scale');

console.log(out);
