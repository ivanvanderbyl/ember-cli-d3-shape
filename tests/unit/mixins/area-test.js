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
  assert.equal(subject.get('rect.top'), 24, 'rect.top');
  assert.equal(subject.get('rect.bottom'), 488, 'rect.bottom');
  assert.equal(subject.get('rect.left'), 0, 'rect.left');
  assert.equal(subject.get('rect.right'), 1000, 'rect.right');
  assert.equal(subject.get('rect.height'), 478, 'rect.height');
  assert.equal(subject.get('rect.width'), 1000, 'rect.width');
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
  assert.equal(subject.get('rect.top'), 0, 'rect.top');
  assert.equal(subject.get('rect.bottom'), 512, 'rect.bottom');
  assert.equal(subject.get('rect.left'), 24, 'rect.left');
  assert.equal(subject.get('rect.right'), 1024, 'rect.right');
});
