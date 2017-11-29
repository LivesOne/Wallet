// @flow
'use strict'

import Big from 'big.js';

export default class LVBig {

    static getInitBig() {
        return new Big(0);
    }

    // any 支持 string, number, 必须是十进制
    static convert2Big(plain: any) {
        return new Big(plain);
    }

    static toString(big: Big) {
        return big.toString();
    }

    static toFixed(big: Big, num: number) {
        return big.toFixed(num);
    }
  
}