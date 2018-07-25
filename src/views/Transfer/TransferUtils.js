//@flow

'use strict'

import { isAddress } from '../../utils/MXStringUtils';
import LVTokens from '../../logic/LVTokens';
const BN = require('bn.js');
const ICAP = require('ethereumjs-icap');
var Big = require('big.js');

const EXPORT_ADDRESS_PREFIX = 'iban:';

export default class TransferUtils {
    constructor() {}

    static isValidAmountStr(amountStr: string) : bool {
        let result = amountStr.trim();
        console.log(result);
        let isPositive = !isNaN(result) && parseFloat(result) > 0;
        if (!isPositive) {
            return false;
        } else {
            try {
                let test = new Big(amountStr);
                return true;
            } catch (e){
                return false;
            }
        }
    }

    static isValidAmount(amount: Big) : bool {
        return amount && amount.gt(0);
    }

    static isValidAddress(address: string) : bool {
        return isAddress(address);
    }

    static isAmountOverLimit(amountStr: string) : bool {
        if (amountStr) {
            let arr = amountStr.split('.');
            if (arr && arr.length === 2) {
                let decimalLen = arr[1].length;
                return decimalLen > 18;
            }
        }
        return false;
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

    // value : Big Object 
    static convert2BNHex(value: Object, token: string) : string {
        const decimal = LVTokens.decimals.get('BTC') || 18;
        let r = new BN(value.times(new Big(10).pow(decimal)).toFixed());
        return '0x' + r.toString(16).toLowerCase();
    }

    // 显示八位小数
    static convertMinnerGap(value: number) {
        return value.toFixed(8);
    }

    static convertToHexHeader(hexStr: string) {
        return '0x' === hexStr.substr(0, 2).toLowerCase() ? hexStr.toLowerCase() : '0x' + hexStr.toLowerCase();
    }

    static removeHexHeader(addr: string) {
        return '0x' === addr.substr(0, 2).toLowerCase() ? addr.slice(2).toLowerCase() : addr.toLowerCase();
    }

    static getSetGasPriceHexStr(setGasPrice: number, gasLimit: string) : string {
        // gasPrice = fee/gasLimit
        // 这里会去掉小数点
        return '0x' + parseInt(setGasPrice *  Math.pow(10, 18) / parseInt(gasLimit, 16)).toString(16);
    }

    static log(msg: string) {
        // if (__DEV__) {
        //     console.log('transfer ---> ' + msg);
        // }
        console.log('transfer ---> ' + msg);
    }

    static testBN() {
        var testcase = [
            1.082323,
            0.122343242,
            1000.3423432543432,
            2.9002349324,
            8.009809343400000000000000001,
        ];
        for(var i = 0; i < testcase.length; i++) {
            this.test(testcase[i]);
        }
    }

    static test(value: number) {
        var a = new Big(value);
        var b = new Big(10);
        var div = a.times(b.pow(18))
        var bn = new BN(div.toFixed());
        this.log('origin = ' + div.toFixed());
        this.log('result = ' + bn.toString(16));
    }

}