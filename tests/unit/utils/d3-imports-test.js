import { module, test } from 'qunit';

import { extent } from 'd3-array';
import { path } from 'd3-path';

module('Unit | Utility | Test D3 imports');

test('d3-array', function(assert) {
  let data = [1, 2, 4, 18, 100];
  assert.deepEqual(extent(data), [1, 100], 'extent');
});

test('d3-path', function(assert) {
  assert.equal(typeof path, 'function', 'path import is a function');
});
