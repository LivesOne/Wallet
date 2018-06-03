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

    constructor(name: string, keystore: Object) {
        this.name = name;
        this.address = keystore.address;
        this.keystore = keystore;
        this.balance_list = [];
    }

    get lvtc(): Big {
        return this.getBalance('LVTC');
    }

    set lvtc(value: number | string | Big) {
        this.setBalance('LVTC', value);
    }

    get eth(): Big {
        return this.getBalance('eth');
    }

    set eth(value: number | string | Big) {
        this.setBalance('eth', value);
    }

    getBalance(token: string) : Big {
        var balance = this.balance_list.find(((value, index, arr) => {
            return value.token === token;
        }));
        return balance ? balance.value : Big(0);
    }

    setBalance(token: string, value: number | string | Big) {
        if (token === null || token === undefined || token.length === 0) {
            return;
        }
        if (value === null || value === undefined) {
            return;
        }

        var isNotFound = true;
        for (var i = 0; i < this.balance_list.length; i++) {
            var balance = this.balance_list[i];
            if (balance.token === token) {
                balance.value = Big(value);
                isNotFound = false;
                break;
            }
        }

        if (isNotFound) {
            this.balance_list.push(new LVBalance(token, value));
        }
    }

    minusBalance(token: string, amount: number | string | Big) {
        var b = this.getBalance(token);
        b.minus(amount);
        this.setBalance(token, b);
    }

    static emptyWallet() : LVWallet {
        return new LVWallet('', { address: '' });
    }
};

export default LVWallet;
export { LVBalance };