import Ember from 'ember';
import AreaMixin from 'ember-cli-d3-shape/mixins/area';
import { module, test } from 'qunit';

module('Unit | Mixin | area');

// Replace this with your real tests.
test('computes the margin attributes from w/h and margin', function(assert) {
  let AreaObject = Ember.Object.extend(AreaMixin, {
    width: 1024,
    height: 512,

    margin: {
      top: 24,
      right: 24,
      bottom: 10,
      left: 0,
    }
  });

  let subject = AreaObject.create();
  assert.equal(subject.get('area.top'), 24, 'area.top');
  assert.equal(subject.get('area.bottom'), 488, 'area.bottom');
  assert.equal(subject.get('area.left'), 0, 'area.left');
  assert.equal(subject.get('area.right'), 1000, 'area.right');
  assert.equal(subject.get('area.height'), 478, 'area.height');
  assert.equal(subject.get('area.width'), 1000, 'area.width');
});

test('uses zero for undefined values', function(assert) {
let AreaObject = Ember.Object.extend(AreaMixin, {
    width: 1024,
    height: 512,

    margin: {
      bottom: 24,
      left: 24,
    }
  });

  let subject = AreaObject.create();
  assert.equal(subject.get('area.top'), 0, 'area.top');
  assert.equal(subject.get('area.bottom'), 512, 'area.bottom');
  assert.equal(subject.get('area.left'), 24, 'area.left');
  assert.equal(subject.get('area.right'), 1024, 'area.right');
});
