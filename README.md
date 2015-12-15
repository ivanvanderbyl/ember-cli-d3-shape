# ember-cli-d3-primitive

This addon provides a version of D3 based on the new v4 code branches at https://github.com/d3. 

It's all ES2015 code, so you can import only what you need. Only need a line? `import { line } from 'd3-shape'`.

### Included D3 modules:

- [d3-shape](https://github.com/d3/d3-shape)
- [d3-array](https://github.com/d3/d3-array)
- [d3-path](https://github.com/d3/d3-path)
- [d3-selection](https://github.com/d3/d3-selection)
- [d3-scale](https://github.com/d3/d3-scale)
- [d3-scale](https://github.com/d3/d3-scale)
- [d3-color](https://github.com/d3/d3-color)
- [d3-time](https://github.com/d3/d3-time)
- [d3-interpolate](https://github.com/d3/d3-interpolate)
- [d3-format](https://github.com/d3/d3-format)
- [d3-time-format](https://github.com/d3/d3-time-format)

_This addon will be updated when new releases are cut of these packages._

## Installation & Usage

Install this like any other Ember Addon:

```bash
ember install ember-cli-d3-primitive
```

Then import what you need from each module:

```js
import { cardinal, cardinalClosed } from  'd3-shape';
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
