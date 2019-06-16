(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.string64 = mod.exports;
  }
})(this, function (module) {
  "use strict";

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var String64 = function () {
    // binary to string lookup table
    function String64(radix) {
      _classCallCheck(this, String64);

      //this.charset = radix !== undefined ? radix : defaultCharset;
      if (!radix) {
        this.charset = "$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
      } else {
        if (radix.length !== 64) {
          console.log("Radix length not 64, using default charset");
        } else {
          this.charset = radix;
        }
      }
      this.b2s = this.charset.split("");
      this.s2b = {};
      for (var i = 0; i < 64; i++) {
        this.s2b[this.charset.charCodeAt(i)] = i;
      }
    }

    // string to binary lookup table
    // 123 == 'z'.charCodeAt(0) + 1

    // number to base64


    _createClass(String64, [{
      key: "toString64",
      value: function toString64(number) {
        //const alphabet = radix !== undefined ? radix : defaultCharset;
        // if (number < 0) return `-${this.toString64(-number)}`;
        // let lo = number >>> 0;
        // let hi = (number / 4294967296) >>> 0;
        // let right = "";
        // while (hi > 0) {
        //     right = this.b2s[0x3f & lo] + right;
        //     lo >>>= 6;
        //     lo |= (0x3f & hi) << 26;
        //     hi >>>= 6;
        // }
        // let left = "";
        // do {
        //     left = this.b2s[0x3f & lo] + left;
        //     lo >>>= 6;
        // } while (lo > 0);
        // return left + right;
        var sixtyFour = BigInt(64);
        var n = BigInt(number);
        var result = n == 0 ? this.charset[0] : "";
        while (n > 0) {
          result = this.charset[n % sixtyFour] + result;
          n = n / sixtyFour;
        }
        return result;
      }
    }, {
      key: "toNumber",
      value: function toNumber(base64) {
        var sixtyFour = BigInt(64);
        var l = base64.length;
        var result = BigInt(0);
        for (var i = 0; i < l; i++) {
          result = result * sixtyFour + BigInt(this.charset.indexOf(base64[i]));
        }
        return result;
      }
    }, {
      key: "timestamp",
      value: function timestamp(randomBytes) {
        var _this = this;

        var d = Date.now();
        var ns = process.hrtime()[1];
        var t = ~~(d / 1000) * 1000000 + ~~(ns / 1000);

        return this.toString64(t) + (randomBytes && randomBytes > 0 ? function () {
          var rand = "";
          if (randomBytes) {
            for (var i = 0; i < randomBytes; i++) {
              rand = rand + _this.toString64(Math.random() * 64);
            }
          }
          return rand;
        }() : "");
      }
    }]);

    return String64;
  }();

  //export default { ntob, bton, timeseries };
  module.exports = { String64: String64 };
});
