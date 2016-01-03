import Ember from 'ember';
import layout from './template';
// import { arc, pie } from  'd3-shape';
import { select } from 'd3-selection';
// import { ordinal } from 'd3-scale';

const { computed } = Ember;

// const COLORS = ["#FF9800", "#15CD72", "#8BC34A", "#C62828", "#FF5722", "#03A9F4", "#00BCD4", "#3F51B5"];

// function d3_ease_cubicInOut(t) {
//   if (t <= 0) {return 0;}
//   if (t >= 1) {return 1;}
//   var t2 = t * t, t3 = t2 * t;
//   return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
// }

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

  // pieFn: function() {
  //   return pie().padAngle(5/360);
  // },

  // arcFn: function() {
  //   return arc()
  //     .cornerRadius(8)
  //     .innerRadius(this.get('innerRadius'))
  //     .outerRadius(this.get('outerRadius'));
  // },

  // colorScale: computed('values', function() {
  //   const values = this.get('values');
  //   return ordinal().range(COLORS).domain(values);
  // }),

  didInsertElement() {
    this.chart = select(this.element.querySelector('svg'));
    this.setupPlot();
  //   this.scheduleDraw();
  },

  // didReceiveAttrs() {
  //   this.scheduleDraw();
  // },

  setupPlot() {
    this.chart.select('g')
      .attr('transform', `translate(${ this.get('width') / 2 }, ${ this.get('height') / 2 })`);
  },

  // scheduleDraw() {
  //   schedule('afterRender', this, this.draw);
  // },

  // draw() {
  //   const values = this.get('values');
  //   const arcs = this.pieFn()(values);
  //   const arc = this.arcFn();
  //   const colorScale = this.get('colorScale');

  //   let plot = this.chart.select('g');
  //   let roundPath = plot.select("g.paths--round");
  //   let join = roundPath.selectAll("path").data(values);
  //     join.enter().append("path").attr('fill', (d) => colorScale(d) );
  //     join.exit().select('path').remove();
  //   join.data(arcs).attr("d", (d) => {
  //     return arc(d);
  //   });
  // }
});
