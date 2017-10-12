// @flow

/**
* Convert the number like 20000 into '20,000' this form of the amount of the string.
* The fraction digits will be retained if precision is not set, eg: 2000.050 -> '2,000.050'
*/
export function convertAmountToCurrencyString(amount: number, thousandsSeparator: ?string, precision: ?number): string {
    const sep = thousandsSeparator || ',';
    const arr = (precision ? amount.toFixed(precision) : (amount + '')).split('.');

    let result = '';
    let num = (arr[0] || 0).toString();
    let decimal = (arr[1] || 0).toString();

    while (num.length > 3) {
        result = sep + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }

    result = num + result;

    if (arr.length === 2) {
        result = result + '.' + decimal;
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
export function converAddressToDisplayableText(address: string, headNum: number = 3, tailNum: number = 3): string {
    if (headNum + tailNum + 3 >= address.length || headNum === 0 || headNum + 3 >= address.length || tailNum === 0) {
        return address;
    }

    const upaddr = address.toUpperCase();
    const head = upaddr.substr(0, headNum);
    const tail = upaddr.substr(upaddr.length - tailNum - 1, tailNum);
    return ['0x', head, '...', tail].join('');
}
