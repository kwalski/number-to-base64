class String64 {
    // binary to string lookup table
    constructor(radix) {
        //this.charset = radix !== undefined ? radix : defaultCharset;
        if (!radix) {
            this.charset =
                "$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
        } else {
            if (radix.length !== 64) {
                console.log(
                    "Incorrect radix length, using default characterset"
                );
            } else {
                this.charset = radix;
            }
        }
        this.b2s = this.charset.split("");
        this.s2b={};
        for (let i = 0; i < 64; i++) {
            this.s2b[this.charset.charCodeAt(i)] = i;
        }
    }

    // string to binary lookup table
    // 123 == 'z'.charCodeAt(0) + 1

    // number to base64
    toString64(number) {
        //const alphabet = radix !== undefined ? radix : defaultCharset;

        if (number < 0) return `-${this.toString64(-number)}`;

        let lo = number >>> 0;
        let hi = (number / 4294967296) >>> 0;

        let right = "";
        while (hi > 0) {
            right = this.b2s[0x3f & lo] + right;
            lo >>>= 6;
            lo |= (0x3f & hi) << 26;
            hi >>>= 6;
        }

        let left = "";
        do {
            left = this.b2s[0x3f & lo] + left;
            lo >>>= 6;
        } while (lo > 0);
        return left + right;
    }

    // base64 to number
    toNumber(base64) {
        let number = 0;
        const sign = base64.charAt(0) === "-" ? 1 : 0;

        for (let i = sign; i < base64.length; i++) {
            number = number * 64 + this.s2b[base64.charCodeAt(i)];
        }
        return sign ? -number : number;
    }

    timestamp(randomBytes) {
        const d = Date.now();
        const ns = process.hrtime()[1];
        const t = ~~(d / 1000) * 1000000 + ~~(ns / 1000);
        let rand = 0;
        if (randomBytes) {
            for (let i = 0; i < randomBytes; i++) {
                rand = rand * 64 + ~~(Math.random() * 64);
            }
        }
        return this.toString64(t) + (randomBytes > 0 ? toString64(rand) : "");
    }
};
//export default { ntob, bton, timeseries };
module.exports = { String64 };
