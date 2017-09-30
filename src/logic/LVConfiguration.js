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

const LV_Key_LastTransferRecordsFilterStartDate = '@Venus:LastTransferRecordsFilterStartDate';
const LV_Key_LastTransferRecordsFilterEndDate = '@Venus:LastTransferRecordsFilterEndDate';

class LVConfiguration {
    constructor() {}

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

    static async lastTransferRecordsFilterStartDate() {
        const value = await LVPersistent.getString(LV_Key_LastTransferRecordsFilterStartDate);

        if (!value) {
            return Moment().format('YYYY-MM-DD');
        } else {
            return value;
        }
    }

    static async setLastTransferRecordsFilterStartDate(date: string) {
        await LVPersistent.setString(LV_Key_LastTransferRecordsFilterStartDate, date);
    }

    static async lastTransferRecordsFilterEndDate() {
        const value = await LVPersistent.getString(LV_Key_LastTransferRecordsFilterEndDate);
        
        if (!value) {
            return Moment().format('YYYY-MM-DD');
        } else {
            return value;
        }
    }

    static async setLastTransferRecordsFilterEndDate(date: string) {
        await LVPersistent.setString(LV_Key_LastTransferRecordsFilterEndDate, date);
    }
}

export default LVConfiguration;