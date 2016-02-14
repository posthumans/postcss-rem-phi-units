# PostCSS Rem Phi Units

[![Build Status](https://travis-ci.org/posthumans/postcss-rem-phi-units.svg?branch=master)](https://travis-ci.org/posthumans/postcss-rem-phi-units)
[![Coverage Status](https://coveralls.io/repos/github/posthumans/postcss-rem-phi-units/badge.svg?branch=master)](https://coveralls.io/github/posthumans/postcss-rem-phi-units?branch=master)
[![npm](https://img.shields.io/npm/v/postcss-rem-phi-units.svg)]()
[![David](https://img.shields.io/david/posthumans/postcss-rem-phi-units.svg)]()
[![David](https://img.shields.io/david/dev/posthumans/postcss-rem-phi-units.svg)]()

> [PostCSS](https://github.com/postcss/postcss) plugin to add extra units for easy rem and phi based layouts

## Converting `px` to `rem`

This plugin gives you the ability to easily generate `rem` based layouts while being able to think in the easier to wrangle `px` unit. Instead of dealing with post processor functions, variables or manual conversions just write:

```css
width: 160px/rem;
```

...and your output will be:

```css
width: 10rem;
```

This gives you full control over exactly which values get converted into `rem` values, as sometimes `px` units are specifically needed.

**Note:** If you prefer not to use the `/` character in your units you can change your options to use any conversion character you choose.

Alternatively you can just use the `px` unit alone and set the plugin to automatically convert all `px` values to `rem`.

## Using `phi` as a Unit

Additionally, the unit `phi` is introduced to make it easy to utilize the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio) in your designs. For example:

```css
padding: 1phi;
margin: 2phi;
```

...will compile to:

```css
padding: 1.618rem;
margin: 3.236rem;
```

You can also specify whether you want your `phi` unit to compile to `em` or `rem` units:

```css
padding: 1phi/rem;
margin: 2phi/em;
```

...will compile to:

```css
padding: 1.618rem;
margin: 3.236em;
```
## Using `@rules` for Options

Options, including converting all `px` values to `rem`, can be set within your stylesheet via `@rules`:

```css
/* set to true to convert all px values to rem automatically */
@remphiunits convert-all-px false;
/* number of decimal places in rem values */
@remphiunits precision 3;
/* base font size rem values are calculated with */
@remphiunits base-font-size 16;
/* the character used for unit conversion, don't wrap in quotes, e.g. change / to -> */
@remphiunits conversion-character ->;
```

## Installation

```console
$ npm install postcss-rem-phi-units
```

## Usage

### Example Gulpfile

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');

var units = require('postcss-rem-phi-units');

gulp.task('css', function () {
  var processors = [
    units
  ];
  return gulp.src('./src/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./css'));
});
```

### Use with Stylus

Note that postcss-rem-phi-units can work with Stylus, but it must be used via [poststylus](https://github.com/seaneking/poststylus) for example:

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var stylus = require('gulp-stylus');
var poststylus = require('poststylus');

var units = require('postcss-rem-phi-units');

gulp.task('stylus', function () {
  var processors = [
    units
  ];
  gulp.src('style.styl')
    .pipe(stylus({
      use: [
        poststylus(processors)
      ]
    }))
    .pipe(gulp.dest('./'))
});
```

### Options

#### `convert-all-px`

Type: `Boolean`  
Default: false

Set to true to convert all px values to rem automatically.

#### `precision`

Type: `Number`  
Default: 3

Number of decimal places in rem values.

#### `base-font-size`

Type: `Number`  
Default: 16

Base font size rem values are calculated with.

#### `conversion-character`

Default: `/`

the character used for unit conversion, don't wrap in quotes, e.g. change `/` to `->`

[![js-happiness-style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)
