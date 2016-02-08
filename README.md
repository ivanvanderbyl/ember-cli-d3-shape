# ember-cli-d3-primitive

![Sample Donut Chart](/screenshots/donut-dummy-app.png?raw=true "Donut Chart")

This addon provides a version of D3 based on the new v4 code branches at https://github.com/d3. 

Each package is compiled and importable as per the D3 documentation for each package. 
This also means that you don't need to import the entire `d3.js` build into your App if you
only need a function or two. Check out [d3-array](https://github.com/d3/d3-array) for
an extensive library of useful Array functions not natively found in Javascript.

Example usage:

```js
import { line } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { extent } from 'd3-array';
```

Or check out the [Donut chart implementation](/tests/dummy/app/components/d3-donut/component.js) in the dummy app.

### Included D3 modules:

- [d3-array](https://github.com/d3/d3-array)
- [d3-axis](https://github.com/d3/d3-axis)
- [d3-collection](https://github.com/d3/d3-collection)
- [d3-color](https://github.com/d3/d3-color)
- [d3-dispatch](https://github.com/d3/d3-dispatch)
- [d3-dsv](https://github.com/d3/d3-dsv)
- [d3-ease](https://github.com/d3/d3-ease)
- [d3-format](https://github.com/d3/d3-format)
- [d3-interpolate](https://github.com/d3/d3-interpolate)
- [d3-path](https://github.com/d3/d3-path)
- [d3-polygon](https://github.com/d3/d3-polygon)
- [d3-quadtree](https://github.com/d3/d3-quadtree)
- [d3-queue](https://github.com/d3/d3-queue)
- [d3-random](https://github.com/d3/d3-random)
- [d3-request](https://github.com/d3/d3-request)
- [d3-scale](https://github.com/d3/d3-scale)
- [d3-selection](https://github.com/d3/d3-selection)
- [d3-shape](https://github.com/d3/d3-shape)
- [d3-time](https://github.com/d3/d3-time)
- [d3-time-format](https://github.com/d3/d3-time-format)
- [d3-timer](https://github.com/d3/d3-timer)
- [d3-transition](https://github.com/d3/d3-transition)
- [d3-voronoi](https://github.com/d3/d3-voronoi)

_This addon will be updated when new releases are cut of these packages. 
Currently none of these are 1.0 stable, so some of your code might break by 
upgrading. It is recommended that you have solid tests in place._

[![Build Status](https://travis-ci.org/ivanvanderbyl/ember-cli-d3-primitive.svg)](https://travis-ci.org/ivanvanderbyl/ember-cli-d3-primitive)

## Installation & Usage

Install this like any other Ember Addon:

```bash
ember install ember-cli-d3-primitive
```

Then import what you need from each module:

```js
import { curveCardinalOpen } from  'd3-shape';
import { select } from 'd3-selection';

export default Ember.Component.extend({
  didInsertElement() {
    this.chart = select(this.element.querySelector('svg'));
  }
});
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
