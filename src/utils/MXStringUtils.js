// @flow

/**
* Convert the number like 20000 into '20,000' this form of the amount of the string.
* The fractional part of the number will be retained, eg: 2000.050 -> '2,000.050'
*/
export function convertAmountToCurrencyString(amount: number, thousandsSeparator: string): string {
    const sep = thousandsSeparator || ',';
    const arr = (amount + '').split('.');

    let num = (arr[0] || 0).toString();
    let result = '';

    while (num.length > 3) {
        result = sep + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
        if (arr.length === 2) {
            result = result + '.' + arr[1];
        }
    }
    return result;
}

/**
 * convert string of address to specific format like '0x1D3..123'
 * @param  {string} address
 * @param  {number=3} headNum
 * @param  {number=3} tailNum
 * @returns string
 */
export function converAddressToDisplayableText(address: string, headNum: number = 3, tailNum: number = 3) : string {
    if(headNum + tailNum + 3 >= address.length
        || headNum === 0 
        || headNum + 3 >= address.length
        || tailNum === 0) {
        return address;
    }

    const head = address.substr(0,headNum);
    const tail = address.substr(address.length - tailNum - 1, tailNum);
    return ['0x',head,'...',tail].join('').toUpperCase();
}