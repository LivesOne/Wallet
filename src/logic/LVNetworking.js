/*
 * Project: Venus
 * File: src/logic/LVNetworking.js
 * @flow
 */
'use strict';

const HOST = 'http://office.metellica.cn:51515';

const API = {
    GET_BALANCE: HOST + '/wallet/balance',
    GET_TRANSACTION_HISTORY: HOST + '/wallet/history',
}

class LVFetch {
    constructor() {}

    static timeout = 30;

    static GET(url: string, params: Object = {}) {
        return new Promise(async (resolve, reject) => {
            fetch(url, { method: 'GET', body: params })
                .then(response => response.json())
                .then(async responseData => {
                    if (responseData) {
                        resolve(responseData);
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
        const url = API.GET_BALANCE + '/' + address + '?type=' + type;  
        return await LVFetch.GET(url);
    }
}

export default LVNetworking;
