import test from 'ava';
import m from './';

test.cb('linear', t => {
	let lastR = 0;
	let callCount = 0;

	m('blue', 'red', (color, delta, iteration, done) => {
		// console.log(color);
		callCount++;
		const currentR = color[0];

		t.is(iteration, 1);
		t.true(color[0] + color[2] === 255 || color[0] + color[2] === 256 || color[0] + color[2] === 254, 'the total value should be approx. 255');
		t.true(color[0] > 0, 'red value should be greater than 0');
		t.true(color[2] < 255, 'blue value should be less than 255');
		t.true(lastR <= currentR, 'last red value should be less than current red value');
		lastR = currentR;

		if (done) {
			t.is(lastR, 255);
			t.true(callCount <= 60 && callCount > 0, 'maximum call count is 60');
			t.end();
		}
	});
});

test.cb('expo-out', t => {
	let lastR = 0;
	let callCount = 0;

	setTimeout(() => {
		t.is(lastR, 255);
		t.true(callCount <= 60, 'maximum call count is 60');
		t.end();
	}, 1500);

	m('blue', 'red', {timing: 'expoOut'}, color => {
		// console.log(color);
		callCount++;
		const currentR = color[0];

		t.true(color[0] + color[2] === 255 || color[0] + color[2] === 256 || color[0] + color[2] === 254, 'the total value should be approx. 255');
		t.true(color[0] > 0, 'red value should be greater than 0');
		t.true(color[2] < 255, 'blue value should be less than 255');
		t.true(lastR <= currentR, 'last red value should be less than current red value');
		lastR = currentR;
	});
});

test.cb('stop half way', t => {
	let lastR = 0;
	let callCount = 0;

	setTimeout(() => {
		t.true(lastR > 120 && lastR < 140);
		t.is(callCount, 30);
		t.end();
	}, 1000);

	m('blue', 'red', color => {
		// console.log(color);
		callCount++;

		if (callCount === 30) {
			lastR = color[0];
			return false;
		}
	});
});

test.cb('two iterations', t => {
	let callCount = 0;

	m('blue', 'red', {
		iterations: 2
	}, (color, delta, iteration, done) => {
		// console.log(color);
		callCount++;

		if (done) {
			t.deepEqual(color, [0, 0, 255]);
			t.true(callCount <= 120 && callCount > 60, 'maximum call count is 120');
			t.end();
		}
	});
});
