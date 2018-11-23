
# string64
This is a fork from [kutuluk/number-to-base64](https://github.com/kutuluk/number-to-base64) with the following changes:

- Default character set changed to use `$` and `_` instead of `+` and `/` to make strings web safe
- Default character set has character sequence in increasing ascii value. i.e, as 65534 < 65535, their encoded strings will also respect the comparison "Ezy" < "Ezz" (for positive values). **This makes default string64 encoding ideal for timeseries keys which must always increase**
- Added `setRadix64` function to override your own 64 char set

Extremely fast number to radix64 converting.

[![NPM version](https://img.shields.io/npm/v/string64.svg?style=flat-square)](https://www.npmjs.com/package/string64)[![Build Status](https://img.shields.io/travis/kwalski/number-to-base64/master.svg?style=flat-square)](https://travis-ci.org/kwalski/number-to-base64)

## Features

- Converts all values of javascript safe integers range (from `-9007199254740991` to `9007199254740991`)
- Extremely fast due to bitwise operations
- Does not add extra padding characters for more efficient compression
- ES3 compatible

Number           | Result
-----------------|------------
0                | $
63               | z
64               | 0$
4095             | zz
262143           | zzz
16777215         | zzzz
68719476735      | zzzzzz
281474976710655  | zzzzzzzz
9007199254740991 | Uzzzzzzzz
-9007199254740991| -Uzzzzzzzz

## Installation

```sh
npm install string64
```

## API

### `setRadix64(string)`
Takes a 64 character string containing the characters you would like to use, default is:
`'$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'`


#### `ntob(number)`
Takes a number, discards a fractional part and returns a string.

#### `bton(base64)`
Takes a string and returns a number.


## Usage

### Browser directly
```html
<script src="https://unpkg.com/string64/dist/string64.min.js"></script>

<script>
  var number = -9007199254740991;
  var base64 = numberToBase64.ntob(number);
  var back = numberToBase64.bton(base64);
  console.log('%s -> "%s" -> %s (%s)', number, base64, back, back === number);
</script>
```

Output
```
-9007199254740991 -> "-Uzzzzzzzz" -> -9007199254740991 (true)
```

### ES6
```javascript
import { ntob, bton } from 'string64';

const test = (number) => {
  const base64 = ntob(number);
  const back = bton(base64);
  console.log('%s -> "%s" -> %s (%s)', number, base64, back, back === number);
};

[0, 1, -1, 255, 65535, 4294967295, 4294967296, Date.now(), 9007199254740991].forEach(number =>
  test(number)
);
```

Output
```
0 -> "$" -> 0 (true)
1 -> "0" -> 1 (true)
-1 -> "-0" -> -1 (true)
255 -> "2z" -> 255 (true)
65535 -> "Ezz" -> 65535 (true)
4294967295 -> "2zzzzz" -> 4294967295 (true)
4294967296 -> "3$$$$$" -> 4294967296 (true)
9007199254740991 -> "Uzzzzzzzz" -> 9007199254740991 (true)
```

## Benchmarking

```
Converting 1 -> "0" -> 1
----------------------------------------------------------------
string64 x 45,087,908 ops/sec ±3.14% (85 runs sampled)
radix-64 x 12,880,377 ops/sec ±0.51% (87 runs sampled)
radixer x 22,479,004 ops/sec ±0.50% (90 runs sampled)

Converting -1 -> "-0" -> -1
----------------------------------------------------------------
string64 x 20,561,116 ops/sec ±0.82% (90 runs sampled)
radix-64 - error
radixer - error

Converting 255 -> "2z" -> 255
----------------------------------------------------------------
string64 x 18,177,702 ops/sec ±0.55% (92 runs sampled)
radix-64 x 3,450,801 ops/sec ±0.67% (97 runs sampled)
radixer x 7,315,322 ops/sec ±0.45% (96 runs sampled)

Converting 65535 -> "Ezz" -> 65535
----------------------------------------------------------------
string64 x 11,327,810 ops/sec ±0.45% (90 runs sampled)
radix-64 x 2,779,044 ops/sec ±1.83% (86 runs sampled)
radixer x 5,150,674 ops/sec ±0.50% (95 runs sampled)

Converting 4294967295 -> "2zzzzz" -> 4294967295
----------------------------------------------------------------
string64 x 6,828,913 ops/sec ±0.90% (92 runs sampled)
radix-64 x 1,941,045 ops/sec ±0.97% (90 runs sampled)
radixer x 2,761,589 ops/sec ±1.90% (89 runs sampled)

Converting 4294967296 -> "3$$$$$" -> 4294967296
----------------------------------------------------------------
string64 x 6,593,466 ops/sec ±0.63% (92 runs sampled)
radix-64 x 1,960,594 ops/sec ±1.00% (94 runs sampled)
radixer x 2,859,399 ops/sec ±0.70% (95 runs sampled)

Converting 1542968713928 -> "LS$5XA7" -> 1542968713928
----------------------------------------------------------------
string64 x 5,890,463 ops/sec ±0.72% (93 runs sampled)
radix-64 x 1,790,768 ops/sec ±0.75% (94 runs sampled)
radixer x 2,561,236 ops/sec ±0.70% (94 runs sampled)

Converting 9007199254740991 -> "Uzzzzzzzz" -> 9007199254740991
----------------------------------------------------------------
string64 x 4,685,536 ops/sec ±1.55% (91 runs sampled)
radix-64 x 1,463,960 ops/sec ±1.57% (86 runs sampled)
radixer x 2,004,879 ops/sec ±0.72% (95 runs sampled)

Converting -9007199254740991 -> "-Uzzzzzzzz" -> -9007199254740991
----------------------------------------------------------------
string64 x 4,473,233 ops/sec ±0.74% (89 runs sampled)
radix-64 - error
radixer - error
```
