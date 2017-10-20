//@flow

'use strict'

import { isAddress } from '../../utils/MXStringUtils';
const BN = require('bn.js');

export default class TransferUtils {
    constructor() {}

    static PRICE_LIMIT = '0x186A0';

    static isValidAmount(amount: string) : bool {
        let result = parseFloat(amount);
        console.log(result);
        return !isNaN(result);
    }

    static isValidAddress(address: string) : bool {
        return isAddress(address);
    }

    static isBlank(str: string) : bool {
        return (!str || /^\s*$/.test(str));
    }

    static getMinerGapRange(params: Object) {
        let {priceMin, priceMax} = params;
        return {min: this.convertHex2Eth(priceMin),
                max: this.convertHex2Eth(priceMax)}
    }

    static convertHex2Eth(price: string) {
        const priceLimit = new BN(this.PRICE_LIMIT.slice(2), 16);
        let g = new BN(price.slice(2), 16);
        return (parseInt(g.mul(priceLimit).toString()) /  Math.pow(10, 18));
    }

    static getSetGasPriceHexStr(setGasPrice: number) : string {
        // gasPrice = fee/gasLimit
        // 这里会去掉小数点
        // setGasPrice fixed num = 9
        return '0x' + parseInt(setGasPrice *  Math.pow(10, 18) / parseInt(this.PRICE_LIMIT, 16)).toString(16);
    }

    static log(msg: string) {
        if (__DEV__) {
            console.log('transfer ---> ' + msg);
        }
    }

    static testBN() {
        // 乘法需要去掉 0x
        var a = new BN('23.4', 10);
        var b = new BN('3', 10);
        var res = a.mul(b);
        var div = a.div(b);
        this.log('res = ' + res.toString(10));
        this.log('div = ' + div.toString(10));
        // var res1 = a.mul(b);
        // this.log('res1 = ' + res1.toString(10));
    }

}