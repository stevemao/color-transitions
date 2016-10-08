import test from 'ava';
import m from './';

test.cb('linear', t => {
	let lastR = 0;
	let callCount = 0;

	setTimeout(() => {
		t.is(lastR, 255);
		t.true(callCount <= 60, 'maximum call count is 60');
		t.end();
	}, 1500);

	m('blue', 'red', color => {
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
