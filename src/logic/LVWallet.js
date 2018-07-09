/*
 * Project: Venus
 * File: src/logic/LVWallet.js
 * @flow
 */
'use strict';

import Big from 'big.js';

class LVBalance {
    token: string; // token 区分大小写
    value: Big;

    constructor(token: string, value: number | string | Big) {
        this.token = token;
        this.value = Big(value);
    }
}

class LVWallet {
    name: string;
    address: string;
    keystore: Object;
    balance_list: Array<LVBalance>;
    holding_list: Array<LVBalance>; // withholding balacne list

    static ETH_TOKEN = 'eth';
    static LVTC_TOKEN = 'LVTC';

    constructor(name: string, keystore: Object) {
        this.name = name;
        this.address = keystore.address;
        this.keystore = keystore;
        this.balance_list = [];
        this.holding_list = [];

        this.lvtc = 0;
        this.eth = 0;
    }

    get lvtc(): Big {
        return this.getBalance(LVWallet.LVTC_TOKEN);
    }

    set lvtc(value: number | string | Big) {
        this.setBalance(LVWallet.LVTC_TOKEN, value);
    }

    get eth(): Big {
        return this.getBalance(LVWallet.ETH_TOKEN);
    }

    set eth(value: number | string | Big) {
        this.setBalance(LVWallet.ETH_TOKEN, value);
    }

    getBalance(token: string): Big {
        const holding: Big = get_balance_from_list(token, this.holding_list);
        const balance: Big = get_balance_from_list(token, this.balance_list);
        return balance.cmp(0) === 0 ? Big(0) : balance.minus(holding);
    }

    setBalance(token: string, value: number | string | Big) {
        set_balance_for_list(token, value, this.balance_list);
    }

    addHoldingBalance(token: string, value: number | string | Big) {
        var balance: Big = get_balance_from_list(token, this.holding_list);
        balance = balance.plus(value);
        set_balance_for_list(token, balance, this.holding_list);
    }

    minusHoldingBalance(token: string, value: number | string | Big) {
        var balance: Big = get_balance_from_list(token, this.holding_list);
        balance = balance.minus(value);
        set_balance_for_list(token, balance.cmp(0) > 0 ? balance : 0, this.holding_list);
    }

    removeHoldingBalance(token: string) {
        set_balance_for_list(token, 0, this.holding_list);
    }

    static emptyWallet(): LVWallet {
        return new LVWallet('', { address: '' });
    }
}

function get_balance_from_list(token: string, list: Array<LVBalance>): Big {
    var balance = list.find((value, index, arr) => {
        return value.token === token;
    });
    return balance ? balance.value : Big(0);
}

function set_balance_for_list(token: string, value: number | string | Big, list: Array<LVBalance>) {
    if (token === null || token === undefined || token.length === 0) {
        return;
    }
    if (value === null || value === undefined) {
        return;
    }

    var isNotFound = true;
    for (var balance of list) {
        if (balance.token === token) {
            balance.value = Big(value);
            isNotFound = false;
            break;
        }
    }

    if (isNotFound) {
        list.push(new LVBalance(token, value));
    }
}

export default LVWallet;
export { LVBalance };
