'use strict';
const Color = require('color');
const tick = setImmediate || process.nextTick || setTimeout;

function howMuchTransition(elapse, duration, timing) {
	return 1 - elapse / duration;
}

module.exports = (color1, color2, opts, cb) => {
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	opts = Object.assign({
		duration: 10,
		timing: 'linear',
		threshold: null
	}, opts);

	color1 = new Color(color1);
	color2 = new Color(color2);

	let elapse = 0;
	const first = new Date();

	function next(color1, color2, pre) {
		const now = new Date();

		// ignore the first call
		if (pre) {
			const delta = now - pre;

			if (delta) {
				elapse += delta;
				const {timing, duration} = opts;
				const percent = howMuchTransition(elapse, duration, timing);
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