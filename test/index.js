var test = require('ava');
var postcss = require('postcss');
var fs = require('fs');

postcss(require('../postcss-rem-phi-units.js'))
	.process(fs.readFileSync('in.css'))
	.then(function (result) {
		// Ava tests
		test(function (t) {
			t.same(result.css, fs.readFileSync('expected.css', 'utf8'));
		});
	});


