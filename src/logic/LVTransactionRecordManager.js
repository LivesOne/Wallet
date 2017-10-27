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

    unfinishedRecordJson() {
        return {
            transactionHash: this.hash,
            from: this.payer,
            to: this.receiver,
            lvt: this.amount,
            eth: this.minnerFee,
            timestamp: this.timestamp,
            state: this.state
        };
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

const LVTransactionUnfinishedRecords = '@Venus:UnfinishedRecordsV1';

export default class LVTransactionRecordManager {
    static unfinishedRecords: Array<LVTransactionRecord> = [];
    static records: Array<LVTransactionRecord> = [];

    static preUsedLvt: number = 0;
    static preUsedEth: number = 0;

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

            await LVTransactionRecordManager.saveUnfinishedTransactionRecords();

            LVNotificationCenter.postNotification(LVNotification.transcationRecordsChanged);
        }
    }

    static async saveUnfinishedTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const objects = this.unfinishedRecords.map(record => record.unfinishedRecordJson());
            await LVPersistent.setObject(LVTransactionUnfinishedRecords + '_' + wallet.address, objects);
        }
    }

    static async fetchSavedUnfinishedTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const uObjects = await LVPersistent.getObject(LVTransactionUnfinishedRecords + '_' + wallet.address);
            if (uObjects && uObjects.length > 0) {
                const uRecords = uObjects.map(json => new LVTransactionRecord(json, wallet.address, json.state));
                return uRecords;
            }
        }
        return null;
    }

    static async refreshTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            let _finishedRecords = [];
            let _unfinishedRecords = [];
            let _preUsedLvt = 0;
            let _preUsedEth = 0;

            const value = await LVNetworking.fetchTransactionHistory(wallet.address);

            if (value && value.length > 0) {
                _finishedRecords = value.map(record => new LVTransactionRecord(record, wallet.address));

                for (var index = 0; index < _finishedRecords.length; index++) {
                    var element = _finishedRecords[index];
                    const detail = await LVNetworking.fetchTransactionDetail(element.hash);
                    element.setRecordDetail(detail);
                }
            }

            const uRecords = await this.fetchSavedUnfinishedTransactionRecords();
            if (uRecords) {
                _unfinishedRecords.push(...uRecords);
            }

            for (var index = _unfinishedRecords.length - 1; index >= 0; index--) {
                var element = _unfinishedRecords[index];
                const found = _finishedRecords.findIndex(r => r.hash == element.hash) != -1;
                if (found) {
                    _unfinishedRecords.pop();
                } else {
                    const detail = await LVNetworking.fetchTransactionDetail(element.hash);
                    element.setRecordDetail(detail);

                    if (element.state === 'waiting') {
                        _preUsedLvt += element.amount;
                        _preUsedEth += element.minnerFee;
                    }
                }
            }

            this.records = [];
            this.unfinishedRecords = [];

            this.records.push(..._finishedRecords);
            this.unfinishedRecords.push(..._unfinishedRecords);

            await this.saveUnfinishedTransactionRecords();

            this.records.push(...this.unfinishedRecords);
            this.records.sort((a, b) => b.timestamp - a.timestamp);

            this.preUsedLvt = _preUsedLvt;
            this.preUsedEth = _preUsedEth;
        }
    }
}

let defaultManager = new LVTransactionRecordManager();

export { LVTransactionRecord };
