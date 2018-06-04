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
    amount: Big;
    minnerFee: Big;

    timestamp: number;
    remarks: string;
    state: string; // ok, failed, waiting

    constructor() {
    }

    get type(): string {
        const wallet = LVWalletManager.getSelectedWallet();
        return LVTransactionRecord.isEqualAddress(this.to, wallet ? wallet.address : '') ? 'in' : 'out';
    }

    get datetime(): string {
        return this.timestamp ? Moment(this.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') : '';
    }

    static recordFromObject(obj: Object) {
        var record = new LVTransactionRecord();

        record.block    = obj.block;
        record.hash     = obj.hash;
        record.from     = obj.from;
        record.to       = obj.to;
        record.token    = obj.token;
        record.amount   = Big(obj.amount);
        record.minnerFee= Big(obj.minnerFee);
        record.timestamp= obj.timestamp;
        record.remarks  = obj.remarks;
        record.state    = obj.state;

        return record;
    }

    static recordFromJson(json: any, token: string, state: string = 'ok') {
        var record = new LVTransactionRecord();

        record.block = json.block;
        record.hash = json.transactionHash;
        record.from = this.pureAddress(json.from);
        record.to = this.pureAddress(json.to);
        record.token = json.token || token;
        record.state = state;

        if (state === 'waiting') {
            record.amount = json.amount ? new Big(json.amount) : Big(0);
            record.minnerFee = json.fee ? new Big(json.fee) : Big(0);
            record.timestamp = json.timestamp;
        } else if (state !== 'failed') {
            try {
                record.amount = new Big(json.value).times(new Big(10).pow(-18));
            } catch (e) {
                TransferUtils.log('error = ' + e.message + ' value = ' + json.value);
            }
        }

        return record;
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

    static pureAddress(addr: string): string {
        if (addr.substr(0, 2).toLowerCase() == '0x') {
            return addr.substr(2);
        } else {
            return addr;
        }
    }

    static isEqualAddress(addr1: string, addr2: string): boolean {
        return this.pureAddress(addr1).toLowerCase() == this.pureAddress(addr2).toLowerCase();
    }
}

const lv_transcation_records_key = '@Venus:LVTransactionRecordsV1';

export default class LVTransactionRecordManager {
    static records: Array<LVTransactionRecord> = [];

    constructor() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChanged.bind(this));
        LVNotificationCenter.addObserver(this, LVNotification.transcationCreated, this.handleRecordCreated.bind(this));
    }

    static clear() {
        this.records = [];
    }

    async handleWalletChanged() {
        await LVTransactionRecordManager.clear();
    }

    async handleRecordCreated(json: ?Object) {
        const wallet = LVWalletManager.getSelectedWallet();
        if (json && wallet) {
            const record = LVTransactionRecord.recordFromJson(json, json.token, 'waiting');
            LVTransactionRecordManager.records.unshift(record);
            LVTransactionRecordManager.saveRecordsToLocal();
            LVNotificationCenter.postNotification(LVNotification.transcationRecordsChanged);
        }
    }

    static async saveRecordsToLocal() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const key = lv_transcation_records_key + '_' + wallet.address;
            await LVPersistent.setObject(key, this.records);
        }
    }

    static async loadRecordsFromLocal() {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            const key = lv_transcation_records_key + '_' + wallet.address;
            const objects: ?Array<Object> = await LVPersistent.getObject(key);
            if (objects && objects.length > 0) {
                const records = objects.map( (obj) => LVTransactionRecord.recordFromObject(obj) );
                this.records = records;
            }
        }
    }

    static async refreshTransactionRecords(token: string, forceUpdate: boolean) {
        if (this.records.length === 0) {
            await this.loadRecordsFromLocal();
        }

        if (!forceUpdate && this.records.length > 0) return;

        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet === null || wallet === undefined) return;

        var address = wallet.address;
        if (address.substr(0, 2).toLowerCase() != '0x') {
            address = '0x' + address;
        }

        const history: ?Array<any> = await LVNetworking.fetchTransactionHistory(address, token);
        if (history === null || history === undefined) return;

        const trans_records: ?Array<LVTransactionRecord> = history.map(json => LVTransactionRecord.recordFromJson(json, token));
        if (trans_records === null || trans_records === undefined || trans_records.length === 0) return;

        for (var record of trans_records) {
            const find_index = this.records.findIndex(r => r.hash === record.hash);

            if (find_index === -1) {
                const detail = await LVNetworking.fetchTransactionDetail(record.hash);
                record.setRecordDetail(detail);
                this.records.push(record);
            } else {
                const cached_record = this.records[find_index];
                if (cached_record.state != 'ok') {
                    const detail = await LVNetworking.fetchTransactionDetail(record.hash);
                    record.setRecordDetail(detail);
                    this.records[find_index] = record;
                }
            }
        }

        this.records.sort((a, b) => b.timestamp - a.timestamp);

        await this.saveRecordsToLocal();
    }
}

let defaultManager = new LVTransactionRecordManager();

export { LVTransactionRecord };
