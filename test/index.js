import test from 'ava';
import plugin from '../postcss-rem-phi-units';
import postcss from 'postcss';
import { readFileSync } from 'fs';

function testCSS (testName) {
	test(testName, async t => {
		postcss(plugin)
			.process(readFileSync(`${testName}/in.css`))
			.then(result =>
				t.same(result.css, readFileSync(testName + '/out.css', 'utf8'))
			);
	});
}

testCSS('defaults');
testCSS('convert-all-px');
testCSS('precision');
testCSS('base-font-size');
testCSS('conversion-character');
