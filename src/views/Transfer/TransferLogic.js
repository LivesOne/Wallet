//@flow
'use strict';
import LVNetworking from '../../logic/LVNetworking';
import TransferUtils from './TransferUtils';
import console from 'console-browserify';
const eth_local = require('../../foundation/ethlocal.js');
const wallet = require('../../foundation/wallet.js');

// 代币的合约地址，保持固定
const TOKEN = '0xe6d97f5cb9e9C5c45025e67224fbA0a5f5A3751b';

export default class TransferLogic {
    constructor() {}

      /**
     * transaction
     * @param  {Object} wallet
     * @param  {string} value 值包括gas
     */
    static async transaction(toAddress: string, value: number, 
            nonce: string, gasLimit: string, gasPrice: string, token: string, chainId: string, wallet: Object) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {reject("time out error")}, 60000);
            try {
                let result = this.innerTransaction(toAddress, value, nonce, gasLimit, gasPrice, token, chainId, wallet);
                clearTimeout(timeout);
                resolve(result);
            } catch(e) {
                console.log(e.message);
                reject('error')
            }
        });
            
    }

    static async innerTransaction(toAddress: string, value: number, 
        nonce: string, gasLimit: string, gasPrice: string, token: string, chainId: string, wallet: Object) {
            let privateKey = await this.getPrivateKey(wallet.password, wallet.keystore);
            let txData = await eth_local.generateTxData(
                privateKey,
                nonce,
                token,
                ' ',
                toAddress,
                '0x' + (value * Math.pow(10, 18)).toString(16),
                gasPrice,
                gasLimit,
                chainId
            );
            let params = {to: toAddress, value: value, nonce: nonce, gasLimit: gasLimit, gasPrice: gasPrice, token: token, chainId: chainId, wallet: wallet};
            TransferUtils.log('transfer params = '+ JSON.stringify(params));
            let success = false;
            let result = await LVNetworking.transaction(txData);
            TransferUtils.log('transfer result = ' + JSON.stringify(result));
            if (result && result.hasOwnProperty('transactionHash')) {
                let transactionHash = result.transactionHash;
                // let detail = await LVNetworking.fetchTransactionDetail(transactionHash);
                // TransferUtils.log('transfer detail = ' + JSON.stringify(detail));
                // success = detail && detail.hasOwnProperty('error') && !detail.error;
                return {result: true, transactionHash: transactionHash};
            }
            return {result: success, transactionHash: null};
    }

    static async testGetDetails(transactionHash: string) {
        setInterval(function() {
            let details = LVNetworking.fetchTransactionDetail(transactionHash);
            TransferUtils.log('transfer details = ' + JSON.stringify(details));
        }, 200);
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
