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

    static log(msg: string) {
        if (__DEV__) {
            console.log('transfer ---> ' + msg);
        }
    }
}