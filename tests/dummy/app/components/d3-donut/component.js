import { arc, pie } from  'd3-shape';
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
/* exported transition */
import { transition } from 'd3-transition';
import { interpolate as d3Interpolate } from 'd3-interpolate';
import Ember from 'ember';

const { computed, run: { scheduleOnce } } = Ember;
const COLORS = ["#FF9800", "#03A9F4", "#15CD72", "#8BC34A", "#C62828", "#FF5722", "#00BCD4", "#3F51B5"];

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

  colorScale: computed('values.[]', function() {
    const values = this.get('values');
    return scaleOrdinal().range(COLORS).domain(values);
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

    function arcTween(a) {
      delete a.index;
      let i = d3Interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    let plot = this.plot;

    let join = plot.selectAll("path").data(arcs);
    join.enter().append("path")
      .attr('fill', (d) => colorScale(d.index))
      .attr("d", arc)
      .each((d) => { this._current = d; });
    join.exit().select('path').remove();
    join.transition('test').duration(500).attrTween("d", arcTween);
  }
});
