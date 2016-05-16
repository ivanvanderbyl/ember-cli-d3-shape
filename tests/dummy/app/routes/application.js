import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller) {
    controller.set('chartValues', [1,1]);
    this.updateValues(controller);
  },

  iteration: 0,

  updateValues(controller) {
    let values = [
      [1, 1],
      [1, 5],
      [1, 8],
      [1, 15],
      [1, 2]
    ];

    Ember.run.later(this, function() {
      let nextValues = values[++this.iteration];
      if (this.iteration === values.length - 1) {
        this.iteration = 0;
      }
      controller.set('chartValues', nextValues);
      this.updateValues(controller);
    }, 2e3);
  }

});
