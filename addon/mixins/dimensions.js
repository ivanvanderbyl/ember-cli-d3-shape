import Ember from 'ember';
import GlobalResize from 'ember-cli-d3-shape/mixins/global-resize';

const {
  run: {
    debounce,
    next,
    schedule,
  }
} = Ember;

export default Ember.Mixin.create(GlobalResize, {

  prepare: Ember.on('didInsertElement', function() {
    next(this, this.measureDimensions);
  }),

  didMeasureDimensions: Ember.K,

  didResize() {
    debounce(this, this.measureDimensions, 100);
  },

  measureDimensions() {
    if (!this.element) { return; }
    const rect = this.element.getBoundingClientRect();
    this.setProperties({
      width: rect.width,
      height: rect.height,
    });

    this.trigger('didMeasureDimensions');
  },

});
