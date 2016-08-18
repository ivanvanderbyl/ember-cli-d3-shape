/* globals describe, it */
'use strict';

var addonIndex = require('../index');
var expect = require('chai').expect;
var d3DepsForPackage = require('../lib/d3-deps-for-package');

describe('index', function() {
  it('exists', function() {
    expect(addonIndex).to.exist;
  });

  it('returns all d3 dependencies if only is not provided', function() {
    var modules = addonIndex.getD3Modules({});
    expect(modules).to.not.be.empty;
  });

  it('returns all d3 dependencies if only is empty', function() {
    var modules = addonIndex.getD3Modules({ only: [] });
    expect(modules).to.not.be.empty;
  });

  it('returns select d3 dependencies if only option provided', function() {
    var modules = addonIndex.getD3Modules({ only: ['d3-shape'] });
    expect(modules.length).to.equal(d3DepsForPackage('d3-shape').length + 1);
  });
});
