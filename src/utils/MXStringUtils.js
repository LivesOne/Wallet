// @flow
import { Platform } from 'react-native';
import Big from 'big.js';
var sha3 = require('crypto-js/sha3');

/**
* Convert the number like 20000 into '20,000' this form of the amount of the string.
* The fraction digits will be retained if precision is not set, eg: 2000.050 -> '2,000.050'
*/

const MAX_BALANCE_LENGTH_LIMIT = 13;
const FRAGMENT_LENGTH = 2;

export function convertAmountToCurrencyString(amount: number, thousandsSeparator: ?string, precision: ?number, keepZero: boolean = false): string {
    const amounts = amount || 0;
    const sep = thousandsSeparator || ',';
    const arr = (precision !== null ? amounts.toFixed(precision || 0) : (amounts + '')).split('.');

    let result = '';
    let num = (arr[0] || 0).toString();
    let decimal = (arr[1] || 0).toString();

    while (num.length > 3) {
        result = sep + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }

    result = num + result;

    if (arr.length === 2) {
        if (keepZero === false) {
            const val = parseFloat('0.' + decimal).toString();
            const dec = val.split('.')[1] || '';
            result = (val == '0') ? result : result + '.' + dec;
        } else {
            result = result + '.' + decimal;
        }
    }

    return result;
}

export function beautifyBalanceShow(balance: Big, unit: string) {
    const original = balance.toString();
    let result = '';
    console.log('origin = ' + original);
    const arr = original.split('.');
    let totalLength = 0;
    let hasShrink = false;
    for (var i = 0; i < arr.length; i++) {
        totalLength += arr[i].length;
    }
    if (totalLength <= MAX_BALANCE_LENGTH_LIMIT) {
        result = original;
    } else {
        if (arr.length > 1) {
            const num = arr[0];
            const decimal = arr[1];
            if (num.length < MAX_BALANCE_LENGTH_LIMIT) {
                if (num.length === MAX_BALANCE_LENGTH_LIMIT - 1) {
                    result =  num;
                } else {
                    hasShrink = true;
                    result =  num + '.' + decimal.slice(0, MAX_BALANCE_LENGTH_LIMIT - num.length - 1);
                }
            } else {
                hasShrink = true;
                const numHead = num.slice(0, FRAGMENT_LENGTH);
                const numTail = num.slice(num.length - FRAGMENT_LENGTH + 1);
                let leftLength = MAX_BALANCE_LENGTH_LIMIT - 2 - 2 * FRAGMENT_LENGTH;
                leftLength = Math.min(decimal.length, leftLength);
                const decimalPart = decimal.slice(0, leftLength + 1);
                result =  [numHead, '...', numTail, '.', decimalPart].join('');
            }
        } else {
            hasShrink = true;
            const sepLength = (MAX_BALANCE_LENGTH_LIMIT - 2) / 2;
            const num = original;
            const numHead = num.slice(0, sepLength);
            const numTail = num.slice(num.length - sepLength + 1);
            result =  [numHead, '...', numTail].join('');
        }
    }
    return {result : result + (unit ? (' ' + unit) : ''), hasShrink: hasShrink};
}

// lvt 为0，显示 eth 否则显示 lvt
export function adjust(lvtAmount: Big, ethAmount: Big) {
    if (Platform.OS === 'ios') {
        if (lvtAmount.eq(0)) {
            return beautifyBalanceShow(ethAmount, 'ETH').result;
        } else {
            return beautifyBalanceShow(lvtAmount, 'LVT').result;
        }
    } else {
        return beautifyBalanceShow(lvtAmount, 'LVT').result;
    }
}

/**
 * convert string of address to specific format like '0x1D3..123'
 * @param  {string} address
 * @param  {number=3} headNum
 * @param  {number=3} tailNum
 * @returns string
 */
export function converAddressToDisplayableText(address: string, headNum: number = 3, tailNum: number = 3): string {
    if (headNum + tailNum + 3 >= address.length || headNum === 0 || headNum + 3 >= address.length || tailNum === 0) {
        return address;
    }

    const upaddr = address.toUpperCase();
    const head = upaddr.substr(0, headNum);
    const tail = upaddr.substr(upaddr.length - tailNum, tailNum);
    return ['0x',head,'...',tail].join('');
}

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
export function isAddress(address: string) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
function isChecksumAddress(address: string) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

/**
 * Get the character length of the string
*/
export function getCharLength(str: string) {  
    var realLength = 0, len = str.length, charCode = -1;  
    for ( var i = 0; i < len; i++) {  
        charCode = str.charCodeAt(i);  
        if (charCode >= 0 && charCode <= 128)  
            realLength += 1;  
        else  
            realLength += 2;  
    }  
    return realLength;  
  }
