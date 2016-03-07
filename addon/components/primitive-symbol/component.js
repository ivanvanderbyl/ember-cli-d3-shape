import Ember from 'ember';
import layout from './template';

import {
  symbol,
  symbolCircle,
  symbolDiamond,
  symbolCross,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} from 'd3-shape';

const {
  computed,
  assert,
  isPresent,
} = Ember;

export default Ember.Component.extend({
  layout,
  tagName: 'path',
  attributeBindings: ['symbolData:d', 'transform', 'stroke', 'fill', 'strokeWidth:stroke-width'],
  classNames: ['symbol'],
  classNameBindings: ['type'],

  /**
   * Symbol size in area
   *
   * @type {Number}
   */
  size: 16,

  /**
   * Symbol to render
   *
   * @type {String}
   */
  type: 'diamond',

  /**
   * Fill color or style
   *
   * @type {String}
   */
  fill: 'black',

  stroke: 'none',

  strokeWidth: 0,

  /**
   * Positioning offset from top
   *
   * @type {Number}
   */
  top: 0,

  /**
   * Positioning offset from left
   *
   * @type {Number}
   */
  left: 0,

  /**
   * Generates the SVG path data for the given symbol
   *
   * @return {String}
   */
  symbolData: computed('size', 'type', {
    get() {
      const {size, type} = this.getProperties('size', 'type');

      const data = {
        'circle': symbolCircle,
        'diamond': symbolDiamond,
        'cross': symbolCross,
        'square': symbolSquare,
        'star': symbolStar,
        'triangle': symbolTriangle,
        'wye': symbolWye,
      }[type];

      assert(`Not a valid symbol type "${type}"`, isPresent(data));

      const fn = symbol();
      fn.type(data);
      fn.size(size * 4);

      return fn();
    }
  }),

  transform: computed('top', 'left', {
    get() {
      const { top, left } = this.getProperties('top', 'left');
      return `translate(${left},${top})`;
    }
  }),
});
