import Ember from 'ember';
import layout from './template';
import { select } from 'd3-selection';
import Area from 'ember-cli-d3-shape/mixins/area';
import Dimensions from 'ember-cli-d3-shape/mixins/dimensions';

const { computed } = Ember;

export default Ember.Component.extend(Area, Dimensions, {
  layout,

  classNames: ['my-visualisation'],

  values: [1, 2, 3, 4],

  margin: {
    top: 100, left: 100, right: 100, bottom: 100
  },

  outerRadius: computed('area.width', {
    get() {
      return this.get('area.width') / 2 - 24;
    }
  }),

  innerRadius: computed('outerRadius', {
    get() {
      return this.get('outerRadius') - 32;
    }
  }),

  didInsertElement() {
    this.plot = select(this.element.querySelector('svg'));
  },

  didMeasureDimensions() {
    this.setupPlot();
  },

  setupPlot() {
    if (!this.element) {
      return;
    }

    this.plot.select('g')
      .attr('transform', `translate(${ this.get('width') / 2 }, ${ this.get('height') / 2 })`);
  }
});
