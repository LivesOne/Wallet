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
