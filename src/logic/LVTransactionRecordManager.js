/*
 * Project: Venus
 * File: src/logic/LVTransactionRecordManager.js
 * @flow
 */
'use strict';

import LVNetworking from './LVNetworking';
import LVWalletManager from './LVWalletManager';
import Moment from 'moment';

class LVTransactionRecord {
    block: number;
    hash: string;
    type: string;
    payer: string;
    receiver: string;
    amount: number;
    timestamp: number;
    datetime: string = '';
    minnerFee: number;
    remarks: string;
    
    constructor(json: any, currentWalletAddress: string) {
        this.block = json.block;
        this.hash = json.transactionHash;
        this.type = json.to.toUpperCase().substr(2) == currentWalletAddress.toUpperCase() ? 'in' : 'out';
        this.payer = json.from;
        this.receiver = json.to;
        this.amount = Number(json.value) * Math.pow(10, -18);
    }

    setRecordDetail(detailJson: any) {
        this.timestamp = detailJson.timestamp;
        this.datetime = Moment(this.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'); 
        this.minnerFee = detailJson.gas * detailJson.gasPrice * Math.pow(10, -18);
    }
}

export default class LVTransactionRecordManager {

    static transactionRecords: Array<LVTransactionRecord> = [];

    static async refreshTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                const list = await LVNetworking.fetchTransactionHistory(wallet.address);
                if (list) {
                    const records = list.map(record => new LVTransactionRecord(record, wallet.address));
                    this.transactionRecords = [];
                    this.transactionRecords.push(...records);

                    for (var index = 0; index < records.length; index++) {
                        var element = records[index];
                        const detail = await LVNetworking.fetchTransactionDetail(element.hash);
                        element.setRecordDetail(detail);
                    }

                    this.transactionRecords.sort((a, b) => b.timestamp - a.timestamp);
                }
            } catch (error) {
                console.log('error in refresh transaction list : ' + error);
            }
        }
    }
}

export { LVTransactionRecord };