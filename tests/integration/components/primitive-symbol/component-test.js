import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('primitive-symbol', 'Integration | Component | primitive symbol', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{primitive-symbol}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#primitive-symbol}}
      template block text
    {{/primitive-symbol}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
