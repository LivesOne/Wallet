//@flow
'use strict';
import LVNetworking from '../../logic/LVNetworking';
const eth_local = require('../../foundation/ethlocal.js');
const wallet = require('../../foundation/wallet.js');

// 代币的合约地址，保持固定
const TOKEN = '0xe6d97f5cb9e9C5c45025e67224fbA0a5f5A3751b';

export default class TransferLogic {
    constructor() {}

    static async transaction(password: string, toAddress: string, value: string, wallet: Object) {
        let privateKey = await this.getPrivateKey(password, wallet.keystore);
        let param = await LVNetworking.fetchTransactionParam(wallet.address);
        let txData = await eth_local.generateTxData(
            privateKey,
            param.nonce,
            TOKEN,
            ' ',
            toAddress,
            this.formatValue(value),
            param.nonce,
            param.gasLimit
        );
        return await LVNetworking.transaction(txData);
    }

    static async getPrivateKey(password: string, keystore: Object): Promise<?string> {
        const promise = new Promise(function(resolve, reject) {
            wallet.exportPrivateKey(password, keystore, p => {
                resolve(p);
            });
        });
        return promise;
    }

    //转账数目，如果是16进制需要‘0x’打头，由于我们的代币小数点后18位，所以如果用户转1lvt，这里需要传入1后面加18个0的string（这是10进制，16进制可以通过换算生成）
    static formatValue(value: string) {
        let format = (parseFloat(value) * Math.pow(10, 18)).toString();
        return format;
    }
}
