/*
 * Project: Venus
 * File: src/logic/LVTransactionRecordManager.js
 * @flow
 */
'use strict';

import Big from 'big.js';
import Moment from 'moment';
import LVWallet, { LVBalance } from './LVWallet';
import LVNetworking from './LVNetworking';
import LVWalletManager from './LVWalletManager';
import LVPersistent from './LVPersistent';
import LVNotification from './LVNotification';
import LVNotificationCenter from './LVNotificationCenter';
import TransferUtils from '../views/Transfer/TransferUtils';

class LVTransactionRecord {
    block: number;
    hash: string;
    
    from: string;
    to: string;
    
    token: string;
    amount: Object;
    minnerFee: Object;
    
    timestamp: number;
    remarks: string;
    state: string; // ok, failed, waiting

    constructor(json: any, state: string = 'ok') {
        this.block = json.block;
        this.hash  = json.transactionHash;
        this.from  = this.pureAddress(json.from);
        this.to    = this.pureAddress(json.to);
        this.token = json.token || 'lvt';
        this.state = state;

        if (state === 'waiting') {
            this.amount = json.amount ? new Big(json.amount) : Big(0);
            this.minnerFee = json.fee ? new Big(json.fee) : Big(0);
            this.timestamp = json.timestamp;
        } else if (state !== 'failed'){
            try {
                this.amount = new Big(json.value).times(new Big(10).pow(-18));
            } catch (e) {
                TransferUtils.log('error = ' + e.message + " value = " + json.value);
            }
        }
    }

    get type(): string {
        const wallet = LVWalletManager.getSelectedWallet();
        return this.isEqualAddress(this.to, wallet ? wallet.address : '') ? 'in' : 'out';
    }

    get datetime(): string {
        return this.timestamp ? Moment(this.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    unfinishedRecordJson() {
        return {
            transactionHash: this.hash,
            from: this.from,
            to: this.to,
            token: this.token,
            amount: this.amount,
            fee: this.minnerFee,
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
            this.minnerFee = new Big(detailJson.gas * detailJson.gasPrice * Math.pow(10, -18));
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
    static records: Array<LVTransactionRecord> = [];
    static unfinish_records: Array<LVTransactionRecord> = [];
    static in_using_balances: Array<LVBalance> = [];

    constructor() {
        LVNotificationCenter.addObserver(
            this,
            LVNotification.transcationCreated,
            this.handleTransactionCreated.bind(this)
        );
    }

    static clear() {
        this.records = [];
        this.unfinish_records = [];
        this.in_using_balances = [];
    }

    async handleTransactionCreated(json: ?Object) {
        const wallet = LVWalletManager.getSelectedWallet();
        if (json && wallet) {
            const record = new LVTransactionRecord(json, 'waiting');
            LVTransactionRecordManager.records.unshift(record);
            LVTransactionRecordManager.unfinish_records.push(record);

            //LVTransactionRecordManager.in_using_balances.push(new LVBalance(record.token, record.amount));
            //LVTransactionRecordManager.in_using_balances.push(new LVBalance('eth', record.minnerFee));

            //wallet.minusBalance(record.token, record.amount);
            //wallet.minusBalance('eth', record.minnerFee);

            await LVTransactionRecordManager.saveUnfinishedTransactionRecords();

            LVNotificationCenter.postNotification(LVNotification.transcationRecordsChanged);
        }
    }

    static async saveUnfinishedTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const objects = this.unfinish_records.map(record => record.unfinishedRecordJson());
            await LVPersistent.setObject(LVTransactionUnfinishedRecords + '_' + wallet.address, objects);
        }
    }

    static async fetchSavedUnfinishedTransactionRecords() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const uObjects = await LVPersistent.getObject(LVTransactionUnfinishedRecords + '_' + wallet.address);
            if (uObjects && uObjects.length > 0) {
                const uRecords = uObjects.map(json => new LVTransactionRecord(json, json.state));
                return uRecords;
            }
        }
        return null;
    }

    static async refreshTransactionRecords(token: string) {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            let _finishedRecords = [];
            let _unfinishedRecords = [];
            let _preUsedLvt = 0;
            let _preUsedEth = 0;

            const value = await LVNetworking.fetchTransactionHistory(wallet.address, token);
            console.log(value);

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
            this.unfinish_records = [];

            this.records.push(..._finishedRecords);
            this.unfinish_records.push(..._unfinishedRecords);

            await this.saveUnfinishedTransactionRecords();

            this.records.push(...this.unfinish_records);
            this.records.sort((a, b) => b.timestamp - a.timestamp);

            //this.preUsedLvt = new Big(_preUsedLvt);
            //this.preUsedEth = new Big(_preUsedEth);
        }
    }
}

let defaultManager = new LVTransactionRecordManager();

export { LVTransactionRecord };
