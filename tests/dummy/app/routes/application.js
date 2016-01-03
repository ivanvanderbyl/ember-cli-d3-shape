import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller) {
    controller.set('chartValues', [1,1]);
    this.updateValues(controller);
  },

  updateValues(controller) {
    Ember.run.later(this, function() {
      let nextValues = [0,0,0,0,0,0].map(() => Math.random() * 100);
      controller.set('chartValues', nextValues);
      this.updateValues(controller);
    }, 2e3);
  }

});
