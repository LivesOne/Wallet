/*
 * Project: Venus
 * File: src/logic/LVTransactionRecordManager.js
 * @flow
 */
'use strict';

import LVNetworking from './LVNetworking';
import LVWalletManager from './LVWalletManager';
import LVPersistent from './LVPersistent';
import LVNotification from './LVNotification';
import LVNotificationCenter from './LVNotificationCenter';
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
    state: string; // ok, failed, waiting

    constructor(json: any, currentWalletAddress: string, state: string = 'ok') {
        this.block = json.block;
        this.hash = json.transactionHash;
        this.type = this.isEqualAddress(json.to || '', currentWalletAddress) ? 'in' : 'out';
        this.payer = this.pureAddress(json.from);
        this.receiver = this.pureAddress(json.to);
        this.amount = Number(json.value) * Math.pow(10, -18);
        this.state = state;

        if (state === 'waiting') {
            this.amount = json.lvt || 0;
            this.minnerFee = json.eth || 0;
            this.timestamp = json.timestamp;
            this.datetime = Moment(this.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
    }

    setRecordDetail(detailJson: any) {
        const error = detailJson.error || false;
        const timestamp = detailJson.timestamp || 0;

        if (error) {
            this.state = 'failed';
        } else if (timestamp === 0) {
            this.state = 'waiting';
        } else {
            this.state = 'ok';
            this.timestamp = timestamp;
            this.datetime = Moment(this.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
            this.minnerFee = detailJson.gas * detailJson.gasPrice * Math.pow(10, -18);
        }
    }

    pureAddress(addr: string): string {
        if (addr.substr(0, 2).toLowerCase() == '0x') {
            return addr.substr(2);
        } else {
            return addr;
        }
    }

    isEqualAddress(addr1: string, addr2: string): boolean {
        return this.pureAddress(addr1).toLowerCase() == this.pureAddress(addr2).toLowerCase();
    }
}

const LVTransactionUnfinishedRecords = '@Venus:UnfinishedRecords';

export default class LVTransactionRecordManager {
    static unfinishedRecords: Array<LVTransactionRecord> = [];
    static records: Array<LVTransactionRecord> = [];

    static preUsedLvt: number;
    static preUsedEth: number;

    constructor() {
        LVNotificationCenter.addObserver(
            this,
            LVNotification.transcationCreated,
            this.handleTransactionCreated.bind(this)
        );
    }

    async handleTransactionCreated(json: ?Object) {
        const wallet = LVWalletManager.getSelectedWallet();
        if (json && wallet) {
            const record = new LVTransactionRecord(json, wallet.address, 'waiting');
            LVTransactionRecordManager.unfinishedRecords.push(record);
            LVTransactionRecordManager.records.unshift(record);

            LVTransactionRecordManager.preUsedLvt += record.amount;
            LVTransactionRecordManager.preUsedEth += record.minnerFee;
            wallet.lvt -= record.amount;
            wallet.eth -= record.minnerFee;

            await LVPersistent.setObject(
                LVTransactionUnfinishedRecords + '_' + wallet.address,
                LVTransactionRecordManager.unfinishedRecords
            );

            LVNotificationCenter.postNotification(LVNotification.transcationRecordsChanged);
        }
    }

    static async reloadSavedUnfinishedTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const unfinished = await LVPersistent.getObject(LVTransactionUnfinishedRecords + '_' + wallet.address);
            if (unfinished && unfinished.length > 0) {
                LVTransactionRecordManager.unfinishedRecords = [];
                LVTransactionRecordManager.unfinishedRecords.push(...unfinished);
            }
        }
    }

    static async refreshTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                this.records = [];
                this.unfinishedRecords = [];
                this.preUsedLvt = 0;
                this.preUsedEth = 0;

                const value = await LVNetworking.fetchTransactionHistory(wallet.address);
                if (value && value.length > 0) {
                    const list = value.map(record => new LVTransactionRecord(record, wallet.address));
                    this.records.push(...list);

                    for (var index = 0; index < list.length; index++) {
                        var element = list[index];
                        const detail = await LVNetworking.fetchTransactionDetail(element.hash);
                        element.setRecordDetail(detail);
                    }
                }

                await this.reloadSavedUnfinishedTransactionRecords();

                for (var index = this.unfinishedRecords.length - 1; index >= 0 ; index--) {
                    var element = this.unfinishedRecords[index];
                    const found = this.records.findIndex(r => r.hash == element.hash) != -1;
                    if (found) {
                        this.unfinishedRecords.pop();
                    } else {
                        const detail = await LVNetworking.fetchTransactionDetail(element.hash);
                        element.setRecordDetail(detail);

                        if (element.state === 'waiting') {
                            this.preUsedLvt += element.amount;
                            this.preUsedEth += element.minnerFee;
                        }
                    }
                }

                await LVPersistent.setObject(
                    LVTransactionUnfinishedRecords + '_' + wallet.address,
                    LVTransactionRecordManager.unfinishedRecords
                );

                this.records.push(...this.unfinishedRecords);
                this.records.sort((a, b) => b.timestamp - a.timestamp);

            } catch (error) {
                console.log('error in refresh transaction list : ' + error);
            }
        }
    }
}

let defaultManager = new LVTransactionRecordManager();

export { LVTransactionRecord };
