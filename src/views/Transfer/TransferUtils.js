//@flow

'use strict'

import { isAddress } from '../../utils/MXStringUtils';
const BN = require('bn.js');
const ICAP = require('ethereumjs-icap')

const EXPORT_ADDRESS_PREFIX = 'iban:';

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

    // 如果含有iban地址，转换成十六进制地址，否则返回原值
    static getAddrFromIbanIfNeeded(data: string) {
        if (data && data.trim().slice(0, 5) === EXPORT_ADDRESS_PREFIX) {
            return this.convertIban2Addr(data);
        } else {
            return data;
        }
    }

    static convertAddr2Iban(addr: string) {
        let addrHex = this.convertToHexHeader(addr);
        return EXPORT_ADDRESS_PREFIX + ICAP.encode(addrHex);
    }

    static convertIban2Addr(addrStr: string) {
        let hasPrefix = EXPORT_ADDRESS_PREFIX === addrStr.substr(0, 5);
        let iban = hasPrefix ? addrStr.slice(5, 40) : addrStr.slice(0, 35);
        return ICAP.toAddress(iban);
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

    static removeHexHeader(addr: string) {
        return '0x' === addr.substr(0, 2) ? addr.slice(2) : addr;
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