const table = [
  0,
  1,
  255,
  65535,
  4294967295,
  4294967296,
  Date.now(),
  9007199254740991
];

const { String64 } = require("../src/string64");
const str64 = new String64();

const alphabet =
  "$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

table.forEach(n => {
  console.log(
    n,
    str64.toString64(n),
    str64.toNumber(str64.toString64(n)),
    n == str64.toNumber(str64.toString64(n))
  );
});
