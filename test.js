import test from 'ava';
import m from './';

test.cb('linear', t => {
	let lastR = 0;
	setTimeout(() => {
		t.is(lastR, 255);
		t.end();
	}, 1500);

	m('blue', 'red', color => {
		t.true(color[0] + color[2] === 255 || color[0] + color[2] === 256 || color[0] + color[2] === 254);
		t.true(color[0] > 0);
		t.true(color[2] < 255);
		const currentR = color[0];
		t.true(lastR <= currentR);
		lastR = currentR;
	});
});
