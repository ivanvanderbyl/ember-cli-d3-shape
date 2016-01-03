import { arc, pie } from  'd3-shape';
import { select } from 'd3-selection';
import { ordinal } from 'd3-scale';
import Ember from 'ember';
// import layout from './template';

const { computed, run: { scheduleOnce } } = Ember;
const COLORS = ["#FF9800", "#15CD72", "#8BC34A", "#C62828", "#FF5722", "#03A9F4", "#00BCD4", "#3F51B5"];

export default Ember.Component.extend({
  tagName: 'g',

  classNames: ['d3-donut'],

  outerRadius: 200,
  innerRadius: 200-32,

  pieFn: function() {
    return pie().padAngle(5/360);
  },

  arcFn: function() {
    return arc()
      .cornerRadius(8)
      .innerRadius(this.get('innerRadius'))
      .outerRadius(this.get('outerRadius'));
  },

  colorScale: computed('values', function() {
    const values = this.get('values');
    return ordinal().range(COLORS).domain(values);
  }),

  didInsertElement() {
    this.plot = select(this.element);
    this.scheduleDraw();
  },

  didReceiveAttrs() {
    this.scheduleDraw();
  },

  scheduleDraw() {
    scheduleOnce('render', this, this.draw);
  },

  draw() {
    const values = this.get('values');
    const arcs = this.pieFn()(values);
    const arc = this.arcFn();
    const colorScale = this.get('colorScale');

    let plot = this.plot;

    let join = plot.selectAll("path").data(values);
      join.enter().append("path").attr('fill', colorScale);
      join.exit().select('path').remove();
    join.data(arcs).attr("d", (d) => {
      return arc(d);
    });
  }
});
