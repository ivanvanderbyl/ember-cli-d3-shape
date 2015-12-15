import Ember from 'ember';
import layout from './template';
const { computed } = Ember;
import { line, catmullRom } from "d3-shape";
import { extent } from "d3-array";
import { linear } from "d3-scale/linear";
import { time } from "d3-scale/time";

export default Ember.Component.extend({
  layout: layout,

  values: [],

  xDomain: computed('values.[]', function() {
    const values = this.get('values');
    return extent(values, (d) => new Date(d[0]));
  }),

  yDomain: computed('values.[]', function() {
    const values = this.get('values');
    return extent(values, (d) => d[1]);
  }),

  xRange: computed('plotWidth', function() {
    return [0, this.get('plotWidth')];
  }),

  yRange: computed('plotHeight', function() {
    return [this.get('plotHeight'), 0];
  }),

  xScale: computed('xRange', 'xDomain', function() {
    const { xRange, xDomain } = this.getProperties('xRange', 'xDomain');
    return time().domain(xDomain).range(xRange);
  }),

  yScale: computed('yRange', 'yDomain', function() {
    const { yRange, yDomain } = this.getProperties('yRange', 'yDomain');
    return linear().domain(yDomain).range(yRange);
  }),

  lineFn: computed('xScale', 'yScale', function() {
    const { xScale, yScale } = this.getProperties('xScale', 'yScale');

    return line()
      .x(function(d) { return xScale(d[0]); })
      .y(function(d) { return yScale(d[1]); })
      .curve(catmullRom);
  }),
});
