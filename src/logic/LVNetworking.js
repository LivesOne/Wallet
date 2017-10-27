/*
 * Project: Venus
 * File: src/logic/LVNetworking.js
 * @flow
 */
'use strict';

import { NetInfo, Platform, NativeModules } from 'react-native';
import LVStrings from '../assets/localization';
import TransferUtils from '../views/Transfer/TransferUtils';

const HOST_TEST = 'http://office.metellica.cn:51515';
const HOST_ONLINE = 'http://api.lives.one';
let HOST = HOST_TEST;

if (Platform.OS === 'ios') {
    if (NativeModules.LVReactExport.isAdHoc || NativeModules.LVReactExport.isAppStore) {
        HOST = HOST_ONLINE;
    }
}

const API = {
    GET_BALANCE: HOST + '/wallet/balance',
    GET_MARKET: HOST + '/wallet/market',
    GET_TRANSACTION_HISTORY: HOST + '/wallet/history',
    GET_TRANSACTION_DETAIL: HOST + '/wallet/tx',
    GET_TRANSACTION_PARAM: HOST + '/wallet/param?',
    POST_SIGNED_TRANSACTION: HOST + '/wallet/tx'
};

const ErrorCodeMap: Map<number, string> = new Map([[1, 'Request parameter error'], [2, 'Server internal error']]);

class LVFetch {
    constructor() {}

    static timeout = 30000;

    static convertErrorCode(code: number) {
        if (ErrorCodeMap.has(code)) {
            return ErrorCodeMap.get(code);
        } else {
            return LVStrings.network_error;
        }
    }

    static GET(url: string) {
        return new Promise(async (resolve, reject) => {
            fetch(url, { method: 'GET' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject(new Error(LVStrings.network_error));
                    }
                })
                .then(json => {
                    if (json && json.code !== undefined) {
                        if (json.code === 0) {
                            resolve(json.result);
                        } else {
                            reject(new Error(this.convertErrorCode(json.code)));
                        }
                    } else {
                        reject(new Error(LVStrings.network_error));
                    }
                })
                .catch(error => {
                    NetInfo.isConnected.fetch().done(isConnected => {
                        reject(new Error(isConnected ? LVStrings.network_error : LVStrings.network_error_network_lost));
                    });
                });
            setTimeout(() => {
                reject(new Error(LVStrings.network_timeout));
            }, LVFetch.timeout);
        });
    }

    static POST(url: string, param: Object) {
        return new Promise(async (resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(param)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject(new Error(LVStrings.network_error));
                    }
                })
                .then(json => {
                    if (json && json.code !== undefined) {
                        if (json.code === 0) {
                            resolve(json.result);
                        } else {
                            reject(new Error(this.convertErrorCode(json.code)));
                        }
                    } else {
                        reject(new Error(LVStrings.network_error));
                    }
                })
                .catch(error => {
                    NetInfo.isConnected.fetch().done(isConnected => {
                        reject(new Error(isConnected ? LVStrings.network_error : LVStrings.network_error_network_lost));
                    });
                });
            setTimeout(() => {
                reject(new Error(LVStrings.network_timeout));
            }, LVFetch.timeout);
        });
    }
}

class LVNetworking {
    constructor() {}

    static async fetchBalance(address: string, type: string = 'eth') {
        return await LVFetch.GET(API.GET_BALANCE + '/' + address + '?type=' + type);
    }

    static async fetchMarketExchangeRates() {
        return await LVFetch.GET(API.GET_MARKET);
    }

    static async fetchTransactionHistory(address: string) {
        return await LVFetch.GET(API.GET_TRANSACTION_HISTORY + '/' + address);
    }

    static async fetchTransactionDetail(transactionHash: string) {
        return await LVFetch.GET(API.GET_TRANSACTION_DETAIL + '/' + transactionHash);
    }

    static async fetchTransactionParam(from: string, to: string, value: string) {
        return await LVFetch.GET(API.GET_TRANSACTION_PARAM + 'from=' + from + '&to=' + to + '&value=' + value);
    }

    static async transaction(txData: string) {
        return await LVFetch.POST(API.POST_SIGNED_TRANSACTION, { tx: txData });
    }
}

export default LVNetworking;
