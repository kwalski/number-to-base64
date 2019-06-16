# string64

~~This is a fork from [kutuluk/number-to-base64](https://github.com/kutuluk/number-to-base64) with the following changes:~~
This lib uses BigInt, and hence prerequisite is Node.js v10+

- It provides a String64 class can be initialized with custom radix
- Default 64 character set changed to use `$` and `_` instead of `+` and `/` to make strings web safe
- Default character set has character sequence in increasing ascii value. i.e, as 65534 < 65535, their encoded strings will also respect the comparison "Ezy" < "Ezz" (for positive values). **This makes default string64 encoding ideal for timeseries keys which must always increase**
- `timestamp()` function does exactly that, ie., generates timestamp as a compact string which is particularly useful when your keys cannot be number/bigint data type.

- currently working for positive numbers only

Extremely fast number to radix64 converting.

[![NPM version](https://img.shields.io/npm/v/string64.svg?style=flat-square)](https://www.npmjs.com/package/string64)[![Build Status](https://img.shields.io/travis/kwalski/number-to-base64/master.svg?style=flat-square)](https://travis-ci.org/kwalski/number-to-base64)

## Features

- Converts all values of javascript safe integers range (from `-9007199254740991` to `9007199254740991`)
- Extremely fast due to bitwise operations
- Does not add extra padding characters for more efficient compression
- ES3 compatible

| Number            | Result     |
| ----------------- | ---------- |
| 0                 | \$         |
| 63                | z          |
| 64                | 0\$        |
| 4095              | zz         |
| 262143            | zzz        |
| 16777215          | zzzz       |
| 68719476735       | zzzzzz     |
| 281474976710655   | zzzzzzzz   |
| 9007199254740991  | Uzzzzzzzz  |
| -9007199254740991 | -Uzzzzzzzz |

## Installation

```sh
npm install string64
```

## API

### `String64(radix)`

Initialize String64 object with optional custom radix.
Default radix is `'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'`

Eg.,

```
const { String64 }= require('string64');

var str64 = new String64();
```

#### `toString64(number)`

Takes a number, discards a fractional part and returns a string.

Eg.,

```
str64.toString64(0) // "$"
```

#### `toNumber(base64Encoded)`

Takes a string and returns a number.

#### `timestamp(randChars: int)`

This is useful for generating time series keys. It encodes current time with microsecond accuracy. Optional randChars is the number of random characters that you wish to suffix to reduce collision possibility.

## Usage

### Browser directly

```html
<script src="https://unpkg.com/string64/dist/string64.min.js"></script>

<script>
  var number = -9007199254740991;
  var base64 = String64().toString64(number);
  var back = String64().toNumber(base64);
  console.log('%s -> "%s" -> %s (%s)', number, base64, back, back === number);
</script>
```

Output

```
-9007199254740991 -> "-Uzzzzzzzz" -> -9007199254740991 (true)
```

### ES6

```javascript
import { String64 } from "string64";

const test = number => {
  var base64 = String64().toString64(number);
  var back = String64().toNumber(base64);
  console.log('%s -> "%s" -> %s (%s)', number, base64, back, back === number);
};

[
  0,
  1,
  -1,
  255,
  65535,
  4294967295,
  4294967296,
  Date.now(),
  9007199254740991
].forEach(number => test(number));
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
