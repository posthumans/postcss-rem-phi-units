var postcss = require('postcss');

// Make these variables global
var base_font_size;
var precision;
var conversion_character;

// Regex to get the value before a custom unit
var get_value = '(\\d*\\.?\\d+\\ ?)';

// The replace function used later will send the phi value it found as $1
var phiRemReplace = function ($1) {
	// Applying parseFloat to $1 will strip the phi unit from it and just leave a number.
	// That number is then multiplied by phi, and a rem unit is appended
	return (parseFloat($1) * 1.618) + 'rem';
};

var phiEmReplace = function ($1) {
	return (parseFloat($1) * 1.618) + 'em';
};

var pxRemReplace = function ($1) {
	// Applying parseFloat to $1 will strip the phi unit from it and just leave a number.
	// That number is then divided by the base font size to give the correct rem value
	// toFixed() is used so we don't have too many decimal points
	// parseFloat() is applied to the resulting value so any trailing 0 decimals are removed
	// Then a rem unit is appended at the end
	return parseFloat((parseFloat($1) / base_font_size).toFixed(precision)) + 'rem';
};

function escapeRegExp (str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module.exports = postcss.plugin('remphiunits', function remphiunits (options) {
	return function (css) {
		// Set syntax for conversion units from settings, or go to defaults
		options = options || {};
		var convert_all_px = options['convert-all-px'] || false;
		precision = options['precision'] || 3;
		base_font_size = options['base-font-size'] || 16;
		conversion_character = options['conversion-character'] || '/';

		var conversion_character_escaped = escapeRegExp(conversion_character);

		/*
		* Allow the options to be overridden with at rules
		*
		* @example
		* 	@remphiunits convert-all-px true;
		* 	@remphiunits precision 3;
		* 	@remphiunits base-font-size 16;
		* 	@remphiunits conversion-character ->;
		*
		* The above example would convert all uses of the px unit to a rem unit
		*/
		css.walkAtRules('remphiunits', function (rule) {
			rule.params = rule.params.split(' ');

			if (rule.params[0] === 'convert-all-px') {
				convert_all_px = rule.params[1];
			}
			if (rule.params[0] === 'precision') {
				precision = rule.params[1];
			}
			if (rule.params[0] === 'base-font-size') {
				base_font_size = rule.params[1];
			}
			if (rule.params[0] === 'conversion-character') {
				conversion_character = rule.params[1];
				conversion_character_escaped = escapeRegExp(conversion_character);
			}

			rule.remove();
		});

		// Setup conversion unit syntax and regex's we'll use later

		// If convert-all-px option is set to true, make the syntax for px_to_rem 'px' so all px units will be converted
		var px_to_rem, px_to_rem_regex;
		if (convert_all_px) {
			px_to_rem = 'px';
			px_to_rem_regex = new RegExp(get_value + 'px', 'ig');
		} else {
			px_to_rem = 'px' + conversion_character + 'rem';
			px_to_rem_regex = new RegExp(get_value + 'px' + conversion_character_escaped + 'rem', 'ig');
		}

		/* This can't be implemented without a way to pass the current element's font size to the em calculation */
		// var px_to_em = 'px/em';
		// var px_to_em_regex = new RegExp(get_value + 'px\/em', 'ig');

		var phi_default = 'phi';
		var phi_default_regex = new RegExp(get_value + 'phi', 'ig');

		var phi_to_rem = 'phi' + conversion_character + 'rem';
		var phi_to_rem_regex = new RegExp(get_value + 'phi' + conversion_character_escaped + 'rem', 'ig');

		var phi_to_em = 'phi' + conversion_character + 'em';
		var phi_to_em_regex = new RegExp(get_value + 'phi' + conversion_character_escaped + 'em', 'ig');

		// Convert any px_to_rem units in media queries
		css.walkAtRules('media', function (rule) {
			rule.params = rule.params.replace(px_to_rem_regex, pxRemReplace);
		});

		// Convert the rest of the units
		css.walkRules(function (rule) {
			rule.walkDecls(function (decl, i) {
				var value = decl.value;

				/* This can't be implemented without a way to pass the current element's font size to the em calculation */
				// If using the syntax for px to em
				// Note: Have to check for px to em first, as if all regular px values
				// are being replaced it would interfere with px/em units
				// if (value.indexOf( px_to_em ) !== -1) {

				// 	// Run the replacement on this value
				// 	decl.value = value.replace(px_to_em_regex, pxEmReplace);

				// }

				// If using the syntax for px to rem
				if (value.indexOf(px_to_rem) !== -1) {
					// Run the replacement on this value
					decl.value = value.replace(px_to_rem_regex, pxRemReplace);
				}

				// If using any of the phi conversion syntaxes
				if (value.indexOf(phi_default) !== -1) {
					// If using the syntax for phi to em value
					if (value.indexOf(phi_to_em) !== -1) {
						// Run the replacement on this value
						decl.value = value.replace(phi_to_em_regex, phiEmReplace);

					// If using the default syntax or phi to rem syntax
					} else {
						// If using the phi to rem syntax
						if (value.indexOf(phi_to_rem) !== -1) {
							// Run the replacement on this value
							decl.value = value.replace(phi_to_rem_regex, phiRemReplace);

						// Else if using the default syntax
						} else {
							// Run the replacement on this value
							decl.value = value.replace(phi_default_regex, phiRemReplace);
						}
					}
				}
			});
		});
	};
});
