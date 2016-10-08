'use strict';
const Color = require('color');
const eases = require('eases');

const tick = setImmediate || process.nextTick || setTimeout;

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
		threshold: null
	}, opts);

	if (typeof opts.timing === 'string') {
		opts.timing = eases[opts.timing];

		if (!opts.timing) {
			throw new Error('Unknown timing function');
		}
	}

	color1 = new Color(color1);
	color2 = new Color(color2);

	let elapsed = 0;
	const first = new Date();

	function next(color1, color2, pre) {
		const now = new Date();

		// ignore the first call
		if (pre) {
			const delta = now - pre;

			if (delta) {
				elapsed += delta;
				const {timing, duration} = opts;
				const percent = howMuchTransition(elapsed, duration, timing);
				const color = color1.clone();
				color.mix(color2, percent);
				if (now.getTime() >= first.getTime() + duration) {
					// last call, flush out color2
					cb(color2.rgbArray(), delta);
					return;
				}

				cb(color.rgbArray(), delta);
			}
		}

		tick(() => {
			next(color1, color2, now);
		});
	}

	next(color1, color2);
};
