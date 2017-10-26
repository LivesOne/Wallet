//@flow

'use strict'

import { isAddress } from '../../utils/MXStringUtils';
const BN = require('bn.js');

export default class TransferUtils {
    constructor() {}

    static isValidAmountStr(amount: string) : bool {
        let result = parseFloat(amount);
        console.log(result);
        return !isNaN(result) && result > 0;
    }

    static isValidAmount(amount: number) : bool {
        return !isNaN(amount) && amount > 0;
    }

    static isValidAddress(address: string) : bool {
        return isAddress(address);
    }

    static isSameAddress(left: string, right: string) : bool {
        return this.convertToHexHeader(left.trim()) === this.convertToHexHeader(right.trim());
    }

    static isBlank(str: string) : bool {
        return (!str || /^\s*$/.test(str));
    }

    static getMinerGapRange(params: Object) {
        let {priceMin, priceMax, gasLimit} = params;
        return {min: this.convertHex2Eth(priceMin, gasLimit),
                max: this.convertHex2Eth(priceMax, gasLimit)}
    }

    static convertHex2Eth(gas: string, gasLimitHex: string) {
        const gasLimit = new BN(gasLimitHex.slice(2), 16);
        let g = new BN(gas.slice(2), 16);
        return (parseInt(g.mul(gasLimit).toString()) /  Math.pow(10, 18));
    }

    static convert2BNHex(value: number) : string {
        let v = new BN((value * Math.pow(10, 18)).toString(2), 2);
        return '0x' + v.toString(16);
    }

    // 显示八位小数
    static convertMinnerGap(value: number) {
        return value.toFixed(8);
    }

    static convertToHexHeader(hexStr: string) {
        return '0x' === hexStr.substr(0, 2) ? hexStr : '0x' + hexStr;
    }

    static getSetGasPriceHexStr(setGasPrice: number, gasLimit: string) : string {
        // gasPrice = fee/gasLimit
        // 这里会去掉小数点
        return '0x' + parseInt(setGasPrice *  Math.pow(10, 18) / parseInt(gasLimit, 16)).toString(16);
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