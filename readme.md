# color-transitions [![Build Status](https://travis-ci.org/stevemao/color-transitions.svg?branch=master)](https://travis-ci.org/stevemao/color-transitions) [![Coverage Status](https://coveralls.io/repos/github/stevemao/color-transitions/badge.svg?branch=master)](https://coveralls.io/github/stevemao/color-transitions?branch=master)

> Smooth color transitions


**Experimental module**

## Install

```
$ npm install --save color-transitions
```


## Usage

```js
const colorTransitions = require('color-transitions');

colorTransitions('blue', 'red', color => {
	// `color` will be the color value between 'blue' and 'red'
});
```


## API

### colorTransitions(color1, color2, [options], cb)

#### color1, color2

Same as the [color setter](https://github.com/Qix-/color#setters).

#### options

##### duration

Type: `number`<br>
Default: `1000`

The transition duration option specifies the number of seconds or milliseconds a transition animation should take to complete.

##### timing

Type: `string` or `function`<br>
Default: `'linear'`

The transition timing function option is used to describe how the intermediate values of the color being affected by a transition effect are calculated. This in essence lets you establish an acceleration curve, so that the speed of the transition can vary over its duration.

If this is string, the function would be from [eases](https://github.com/mattdesl/eases).

##### threshold

Type: `number`<br>
Default: `60`

Maximum number of callbacks that can occur in one second.

##### iterations

Type: `number` or `boolean`<br>
Default: `1`

How many transitions between two colors. Specify `true` to make it infinite.

#### cb

Type: `function`

Callback function. If return `false`, stop immediately.

##### cb(color, delta, iteration)

###### color

Type: `array`

RGB array

###### delta

Type: `number`

How much time has passed since last callback in milliseconds.

###### iteration

Type: `number`

Which iteration. Counting from 1.

###### done

Type: `boolean`

Is the transition done?


## License

MIT © [Steve Mao](https://github.com/stevemao)
