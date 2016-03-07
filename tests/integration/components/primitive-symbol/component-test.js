import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('primitive-symbol', 'Integration | Component | primitive symbol', {
  integration: true
});

test('it renders a diamond', function(assert) {
  this.render(hbs`{{primitive-symbol type="diamond" size="48"}}`);
  assert.equal(this.$("path").attr('d'), 'M0,-12.894839181882503L7.4448388728167965,0L0,12.894839181882503L-7.4448388728167965,0Z');
  assert.ok(Ember.A(this.$("path").attr('class').split(' ')).contains('diamond'), 'has diamond class');
  assert.ok(Ember.A(this.$("path").attr('class').split(' ')).contains('symbol'), 'has symbol class');
});

test('positioning', function(assert) {
  this.render(hbs`{{primitive-symbol type="diamond" size="48" left="24" top="100"}}`);
  assert.equal(this.$("path").attr('transform'), 'translate(24,100)');
});

test('fill, stroke, and stroke-width', function(assert) {
  this.render(hbs`{{primitive-symbol fill="red" stroke="black" strokeWidth="2"}}`);
  assert.equal(this.$("path.symbol").attr('fill'), 'red');
  assert.equal(this.$("path.symbol").attr('stroke'), 'black');
  assert.equal(this.$("path.symbol").attr('stroke-width'), '2');
});
