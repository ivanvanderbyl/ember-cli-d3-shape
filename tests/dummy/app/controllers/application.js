import Ember from 'ember';

export default Ember.Controller.extend({

  chartValues: [],

  symbols: ['circle', 'diamond', 'cross', 'square', 'star', 'triangle', 'wye'],
  symbolPositions: Ember.computed('symbols.[]', {
    get() {
      let symbols = this.get('symbols');
      let positions = {};
      symbols.forEach((s, i) => {
        positions[s] = i * 50;
      });
      return positions;
    }
  })
});
