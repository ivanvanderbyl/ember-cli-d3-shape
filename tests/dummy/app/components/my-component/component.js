import Ember from 'ember';
import layout from './template';

// import path from  'd3-path/path';
import {curveCardinal} from  'd3-shape/index';

export default Ember.Component.extend({
  layout: layout,

  didInsertElement() {
    console.log(curveCardinal);
  }
});
