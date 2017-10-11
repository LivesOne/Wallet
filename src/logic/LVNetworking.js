/*
 * Project: Venus
 * File: src/logic/LVNetworking.js
 * @flow
 */
'use strict';

const HOST = 'http://office.metellica.cn:51515';

const API = {
    GET_BALANCE: HOST + '/wallet/balance',
    GET_TRANSACTION_HISTORY: HOST + '/wallet/history'
};

const ErrorCodeMap: Map<number, string> = new Map([
    [1, 'Request parameter error'],
    [2, 'Server internal error'],
]);

class LVFetch {
    constructor() {}

    static timeout = 30000;

    static convertErrorCode(code: number) {
        if (ErrorCodeMap.has(code)) {
            return ErrorCodeMap.get(code);
        } else {
            return 'Network Error';
        }
    }

    static GET(url: string) {
        return new Promise(async (resolve, reject) => {
            fetch(url, { method: 'GET' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject(new Error('Network Error'));
                    }
                })
                .then(json => {
                    if (json && json.code !== undefined && json.result !== undefined) {
                        if (json.code === 0) {
                            resolve(json.result);
                        } else {
                            reject(new Error(this.convertErrorCode(json.code)));
                        }
                    } else {
                        reject(new Error('Network Error'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
            setTimeout(() => {
                reject(new Error('Request Timeout'));
            }, LVFetch.timeout);
        });
    }
}

class LVNetworking {
    constructor() {}

    static async fetchBanlance(address: string, type: string = 'eth') {
        return await LVFetch.GET(API.GET_BALANCE + '/' + address + '?type=' + type);
    }
}

export default LVNetworking;
