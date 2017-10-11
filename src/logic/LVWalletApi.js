//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View } from 'react-native'

const WALLET_API_BASE: string = 'http://office.metellica.cn:51515/wallet/';

export default class LVWalletApi {

    constructor() {}

    static async getBalance(address: string) {
        const api = WALLET_API_BASE + 'balance/' + address;
        let response = await fetch(api);
        return response.json();
    }

    static async getTransactionHistory(address: string) {
        const api = WALLET_API_BASE + 'history/' + address;
        let response = await fetch(api);
        return response.json();
    }

    static async getTransactionDetails(hash: string) {
        const api = WALLET_API_BASE + 'tx/' + hash;
        let response = await fetch(api);
        return response.json();
    }

    static async getTransactionParams(address: string) {
        const api = WALLET_API_BASE + 'param/' + address;
        let response = await fetch(api);
        return response.json();
    }
  
    static async postTransaction(signedTransaction: string) {
        const api = WALLET_API_BASE + 'tx';
        
        let formData = new FormData();
        formData.append("tx", signedTransaction);
    
        let response = await fetch(api, {
            method:'POST',
            body:formData,
            });
        let responseJson = await response.json();
        return responseJson;
    }
}