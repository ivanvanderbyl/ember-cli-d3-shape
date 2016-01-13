import Ember from 'ember';
import layout from './template';
import { select } from 'd3-selection';

const { computed } = Ember;

export default Ember.Component.extend({
  layout: layout,

  values: [1, 1, 2, 3, 5, 8, 13, 21],

  width: 400,
  height: 400,

  outerRadius: computed('height', {
    get() {
      return this.get('height') / 2 - 24;
    }
  }),

  innerRadius: computed('height', {
    get() {
      return this.get('outerRadius') - 32;
    }
  }),

  didInsertElement() {
    this.chart = select(this.element.querySelector('svg'));
    this.setupPlot();
  },

  setupPlot() {
    this.chart.select('g')
      .attr('transform', `translate(${ this.get('width') / 2 }, ${ this.get('height') / 2 })`);
  },
});
