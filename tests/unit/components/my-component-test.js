import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('my-component', 'Unit | Component | my component', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

const values = [
  [1450156824278+1e3, 10],
  [1450156824278+2e3, 12],
  [1450156824278+3e3, 19],
  [1450156824278+4e3, 20],
  [1450156824278+5e3, 12],
  [1450156824278+6e3, 6],
  [1450156824278+7e3, 1],
];

test('scales', function(assert) {

  // Creates the component instance
  let component = this.subject();

  component.set('values', values);

  assert.deepEqual(component.get('xDomain', [1450156824278+1e3, 1450156824278+7e3]));

  // Renders the component to the page
  // this.render();
  // assert.equal(this.$().text().trim(), '');
});
