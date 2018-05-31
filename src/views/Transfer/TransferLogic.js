//@flow
'use strict';
import LVNetworking from '../../logic/LVNetworking';
import TransferUtils from './TransferUtils';
import console from 'console-browserify';
import Transaction from 'ethereumjs-tx';
const eth_local = require('../../foundation/ethlocal.js');
const wallet = require('../../foundation/wallet.js');
var Big = require('big.js');

export default class TransferLogic {
    
    constructor() {}

    static async fetchTransactionParam(from: string, to: string, value: Object, token: string) {
        let f = TransferUtils.convertToHexHeader(from);
        let t = TransferUtils.convertToHexHeader(to);
        let v = TransferUtils.convert2BNHex(value);
        TransferUtils.log('tryFetchParams request = ' + JSON.stringify({from: f, to: t, value: v}));
        return await LVNetworking.fetchTransactionParam(f, t, v, token);
    }

      /**
     * transaction
     * @param  {Object} wallet
     * @param  {string} value 值包括gas
     */
    static async transaction(toAddress: string, password: string, value: Big, 
            nonce: string, gasLimit: string, gasPrice: string, token: string, chainId: string, wallet: Object) {
        let to = TransferUtils.convertToHexHeader(toAddress);
        let from = TransferUtils.convertToHexHeader(wallet.address);
        let v = TransferUtils.convert2BNHex(value);
        return new Promise((resolve, reject) => {
            let params = {from: from, to: to, value: v, nonce: nonce, gasLimit: gasLimit, gasPrice: gasPrice, lvt: wallet.lvt, eth: wallet.eth};
            TransferUtils.log('transfer params = '+ JSON.stringify(params));
            let result = this.innerTransaction(to, password, v, nonce, gasLimit, gasPrice, token, chainId, wallet);
            resolve(result);
        });
            
    }

    static async innerTransaction(toAddress: string, password: string, value: string, 
        nonce: string, gasLimit: string, gasPrice: string, token: string, chainId: string, wallet: Object) {
            let privateKey = await this.getPrivateKey(password, wallet.keystore);
            let txData = await eth_local.generateTxData(
                privateKey,
                nonce,
                token,
                ' ',
                toAddress,
                value,
                gasPrice,
                gasLimit,
                chainId
            );
            let success = false;
            try {
                TransferUtils.log('transfer tx = ' + JSON.stringify(txData));
                let result = await LVNetworking.transaction(txData);
                TransferUtils.log('transfer result = ' + JSON.stringify(result));
                if (result && result.hasOwnProperty('transactionHash')) {
                    let transactionHash = result.transactionHash;
                    return {result: true, transactionHash: transactionHash};
                }
                return {result: success, transactionHash: null, errorMsg: null};
            } catch (error) {
                TransferUtils.log('transaction error ' + error.message)
                return {result: false, transactionHash: null, errorMsg: error.message};
            }
    }

    static async getPrivateKey(password: string, keystore: Object): Promise<?string> {
        const promise = new Promise(function(resolve, reject) {
            wallet.exportPrivateKey(password, keystore, p => {
                resolve(p);
            });
        });
        return promise;
    }

}
