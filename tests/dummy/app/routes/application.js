import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller) {
    controller.set('chartValues', [1,1,1,1]);
    this.updateValues(controller);
  },

  iteration: 0,

  updateValues(controller) {
    let prevValues = controller.get('chartValues');

    let values = [
      [1, 5,5,5],
      [2, 5,6,4],
      [3, 5,6,1],
      [5,15,6,1],
    ];

    Ember.run.later(this, function() {
      let nextValues = values[++this.iteration];
      if (this.iteration === 3) { this.iteration = 0; }
      controller.set('chartValues', nextValues);
      this.updateValues(controller);
    }, 2e3);
  }

});
