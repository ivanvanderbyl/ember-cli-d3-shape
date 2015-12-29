import Ember from 'ember';
import layout from './template';
import { arc, pie } from  'd3-shape';
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
      return this.get('outerRadius') / 2;
    }
  }),

  pieFn: function() {
    return pie().padAngle(5/360);
  },

  arcFn: function() {
    return arc()
      .innerRadius(this.get('innerRadius'))
      .outerRadius(this.get('outerRadius'));
  },

  didInsertElement() {
    this.chart = select(this.element.querySelector('svg'));
    this.draw();
  },

  draw() {
    const values = this.get('values');
    const arcs = this.pieFn()(values);
    const arc = this.arcFn();

    let plot = this.chart.append("g")
      .attr("transform", "translate(" + this.get('width') / 2 + "," + this.get('height') / 2 + ")");

    let roundPath = plot.append("g")
      .attr("class", "paths--round")
      .selectAll("path")
        .data(values)
      .enter().append("path");

    roundPath.data(arcs).attr("d", arc.cornerRadius(5));
  }
});
