import test from 'ava';
import plugin from '../postcss-rem-phi-units';
import postcss from 'postcss';
import { readFileSync } from 'fs';

test('Settingless units', async t => {
	postcss(plugin)
		.process(readFileSync('in.css'))
		.then(result =>
			t.same(result.css, readFileSync('expected.css', 'utf8'))
		);
});
