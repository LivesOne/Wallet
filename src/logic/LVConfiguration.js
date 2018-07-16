/*
 * Project: Venus
 * File: src/logic/LVConfiguration.js
 * @flow
 */
'use strict';

import LVPersistent from './LVPersistent';
import Moment from 'moment';

const LV_Key_HasAppEverLaunched = '@Venus:HasAppEverLaunched';
const LV_Key_HasAppGuidesEverDisplayed = '@Venus:HasAppGuidesEverDisplayed';

const LV_Key_LastTransactionRecordsFilterStartDate = '@Venus:LastTransactionRecordsFilterStartDate';
const LV_Key_LastTransactionRecordsFilterEndDate = '@Venus:LastTransactionRecordsFilterEndDate';
const LV_Key_AnyWalletAvailable = '@Venus:AnyWalletAvailable';
const LV_Key_HasSavedQrCodeToDisk = '@Venus:HasSavedQrCodeToDisk';

class LVConfiguration {
    constructor() {}

    static async isAnyWalletAvailable() {
        return await LVPersistent.getBoolean(LV_Key_AnyWalletAvailable);
    }

    static async setAnyWalletAvailable(isAvailable : boolean) {
        await LVPersistent.setBoolean(LV_Key_AnyWalletAvailable, isAvailable);
    }

    static async hasAppEverLaunched() {
        return await LVPersistent.getBoolean(LV_Key_HasAppEverLaunched);
    }

    static async setAppHasBeenLaunched() {
        await LVPersistent.setBoolean(LV_Key_HasAppEverLaunched, true);
    }

    // App 引导页

    static async hasAppGuidesEverDisplayed() {
        return await LVPersistent.getBoolean(LV_Key_HasAppEverLaunched);
    }

    static async setAppGuidesHasBeenDisplayed() {
        await LVPersistent.setBoolean(LV_Key_HasAppEverLaunched, true);
    }

    // 交易记录过滤时间

    static async lastTransactionRecordsFilterStartDate() {
        const value = await LVPersistent.getString(LV_Key_LastTransactionRecordsFilterStartDate);

        if (!value) {
            return Moment().add(-2, 'days').format('YYYY-MM-DD');
        } else {
            return value;
        }
    }

    static async setLastTransactionRecordsFilterStartDate(date: string) {
        await LVPersistent.setString(LV_Key_LastTransactionRecordsFilterStartDate, date);
    }

    static async lastTransactionRecordsFilterEndDate() {
        const value = await LVPersistent.getString(LV_Key_LastTransactionRecordsFilterEndDate);
        
        if (!value) {
            return Moment().format('YYYY-MM-DD');
        } else {
            return value;
        }
    }

    static async setLastTransactionRecordsFilterEndDate(date: string) {
        await LVPersistent.setString(LV_Key_LastTransactionRecordsFilterEndDate, date);
    }

    // 是否已经弹出过保存二维码到本地

    static async setHasSavedQrCodeToDisk(){
        await LVPersistent.setBoolean(LV_Key_HasSavedQrCodeToDisk, true);
    }

    static async getHasSavedQrCodeToDisk(){
        return await LVPersistent.getBoolean(LV_Key_HasSavedQrCodeToDisk);
    }
}

export default LVConfiguration;