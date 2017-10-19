//@flow

'use strict'

import { isAddress } from '../../utils/MXStringUtils';

export default class TransferUtils {
    constructor() {}

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

    static hexStr2Number(hexStr: string) : number {
        return parseInt(hexStr, 16);
    }

    static number2HexStr(num : number) : string {
        return '0x' + num.toString(16)
    }

    static log(msg: string) {
        if (__DEV__) {
            console.log('transfer ---> ' + msg);
        }
    }
}