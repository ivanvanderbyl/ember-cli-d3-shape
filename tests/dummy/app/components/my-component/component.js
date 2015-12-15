import Ember from 'ember';
import layout from './template';

// import path from  'd3-path/path';
import {cardinal, cardinalClosed} from  'd3-shape';
import { line } from 'd3-shape';
// import {basisClosed} from 'ember-cli-d3/d3-shape/index';

export default Ember.Component.extend({
  layout: layout,

  didInsertElement() {
    console.log(line);
  }
});
