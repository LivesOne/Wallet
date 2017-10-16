//@flow
'use strict';
import LVNetworking from '../../logic/LVNetworking';
const eth_local = require('../../foundation/ethlocal.js');
const wallet = require('../../foundation/wallet.js');

// 代币的合约地址，保持固定
const TOKEN = '0xe6d97f5cb9e9C5c45025e67224fbA0a5f5A3751b';

export default class TransferLogic {
    constructor() {}

    static async transaction(password: string, toAddress: string, value: number, wallet: Object) {
        let privateKey = await this.getPrivateKey(password, wallet.keystore);
        let param = await LVNetworking.fetchTransactionParam(wallet.address);
        let txData = await eth_local.generateTxData(
            privateKey,
            param.nonce,
            TOKEN,
            ' ',
            toAddress,
            '0x' + (value * Math.pow(10, 18)).toString(16),
            param.gasPrice,
            param.gasLimit,
        );
        let result = await LVNetworking.transaction(txData);
        console.log('result = ' + JSON.stringify(result));
        return result;
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
