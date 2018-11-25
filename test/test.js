/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */

const expect = require('chai').expect;
const {String64} = require('../dist/string64.min.js');

const alphabet = '$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.split('');
const custRadix = '@!23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxy%+';

const str64 = new String64();
const custStr64 = new String64(custRadix);

const modulo = (number) => {
  if (number < 0) return `-${modulo(-number)}`;

  let base64 = '';
  number = Math.floor(number);

  do {
    const mod = number % 64;
    number = Math.floor(number / 64);
    base64 = alphabet[mod] + base64;
  } while (number > 0);

  return base64;
};

const test = (number, log) => {
  let float = number + Math.random();
  if (Math.floor(float) !== number) float = number;

  const fast = str64.toString64(float);
  const slow = modulo(float);
  const back = str64.toNumber(fast);
  if (log) console.log('%s -> "%s" -> %s', float, fast, back);

  if (fast !== slow) return NaN;
  return back;
};
//1542981184618462200
//9007199254740991
const table = [0, 1, 255, 65535, 4294967295, 4294967296, Date.now(), 9007199254740991];

describe('Tests', () => {
  it('Positive', () => {
    table.forEach(value => expect(test(value, true)).to.equal(value));
  });

  it('Negative', () => {
    table.forEach(value => expect(new String64().toString64(-value)).to.be.a('string'));
    table.forEach(value => expect(str64.toNumber(str64.toString64(-value))).to.equal(-value));
  });

//  it('Fuzzing', () => {
//    for (let i = 0; i <= 1000000; i += 1) {
//      const t = Math.floor(Math.random() * 9007199254740991);
//      expect(test(t)).to.equal(t);
//    }
//  }).timeout(0);

  it('radix',() => {
      expect(custStr64.toString64(0)).to.not.equal(str64.toString64(0)); // allowed to fail if the output chars are similar
      table.forEach(value => expect(custStr64.toNumber(custStr64.toString64(value))).to.equal(value));
  });
    
  it('timeseries',()=>{
      const ts = str64.timeseries();
      const dt = Date.now(); 
      expect((dt-(Math.round(str64.toNumber(ts)/1000)))).to.be.below(1000);
      expect((dt-(Math.round(str64.toNumber(ts)/1000)))).to.be.above(-1000);
  })
  /*
  it('Paranoid', () => {
    for (let i = 0; i <= 9007199254740991; i += 1) {
      if (i % 1000000000000000) console.log(i);
      expect(test(i)).to.equal(i);
    }
  }).timeout(0);
  */
});
