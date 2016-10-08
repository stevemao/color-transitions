'use strict';
const Color = require('color');
const eases = require('eases');

function howMuchTransition(elapsed, duration, timing) {
	// TODO: not sure why we need `1 -` here.
	// probably related to https://github.com/Qix-/color/issues/46
	return 1 - timing(elapsed / duration);
}

module.exports = (color1, color2, opts, cb) => {
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	opts = Object.assign({
		duration: 1000,
		timing: 'linear',
		threshold: 60,
		iterations: 1
	}, opts);

	let tick;
	let elapsed;
	let first;
	let iterationCount = 0;

	if (opts.threshold) {
		tick = setTimeout;
	} else {
		tick = setImmediate || process.nextTick || setTimeout;
	}

	if (typeof opts.timing === 'string') {
		opts.timing = eases[opts.timing];

		if (!opts.timing) {
			throw new Error('Unknown timing function');
		}
	}

	color1 = new Color(color1);
	color2 = new Color(color2);

	function reset() {
		elapsed = 0;
		first = new Date().getTime();
	}

	function next(color1, color2, lastTime) {
		const currTime = new Date().getTime();
		const idealTimeToCall = 1000 / opts.threshold;
		let timeToCall;

		if (opts.threshold) {
			timeToCall = idealTimeToCall;
		}

		// ignore the first call
		if (lastTime) {
			const delta = currTime - lastTime;

			if (opts.threshold) {
				if (delta > idealTimeToCall * 2) {
					timeToCall = 0;
				} else {
					timeToCall = (idealTimeToCall * 2) - delta;
				}
			}

			// ignore if next is called too quickly
			if (delta) {
				elapsed += delta;
				const {timing, duration} = opts;
				const percent = howMuchTransition(elapsed, duration, timing);
				const color = color1.clone();
				color.mix(color2, percent);
				if (currTime >= first + duration) {
					// last call, flush out color2
					if (iterationCount < opts.iterations || opts.iterations === true) {
						cb(color2.rgbArray(), delta, iterationCount, false);
						next(color2, color1);
					} else {
						cb(color2.rgbArray(), delta, iterationCount, true);
					}

					return;
				}

				if (cb(color.rgbArray(), delta, iterationCount, false) === false) {
					return;
				}
			}
		} else {
			// first call
			iterationCount++;
			reset();
		}

		tick(() => {
			next(color1, color2, currTime);
			// if tick is setImmediate or process.nextTick, we ignore timeToCall
		}, timeToCall);
	}

	next(color1, color2);
};
