import Ember from 'ember';
const { computed } = Ember;

function computeMargin({top, right, bottom, left}) {
  top = top || 0;
  right = right || 0;
  bottom = bottom || 0;
  left = left || 0;
  return {top, right, bottom, left};
}

export default Ember.Mixin.create({

  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  /**
   * Computed dimensions for the actual plot.
   *
   * @return {Object}
   */
  area: computed('width', 'height', 'margin', {
    get() {
      let height = this.get('height'),
        width = this.get('width'),
        margin = computeMargin(this.get('margin'));

      return {
        top: margin.top,
        left: margin.left,
        bottom: height - margin.top,
        right: width - margin.right,
        height: height - margin.top - margin.bottom,
        width: width - margin.left - margin.right,
        outerWidth: width,
        outerHeight: height,
      };
    },
  }),
});
