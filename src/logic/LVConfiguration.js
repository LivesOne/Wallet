/*
 * Project: Venus
 * File: src/logic/LVConfiguration.js
 * @flow
 */
'use strict';

import LVPersistent from './LVPersistent';

const LV_Key_HasAppEverLaunched = '@Venus:HasAppEverLaunched';
const LV_Key_HasAppGuidesEverDisplayed = '@Venus:HasAppGuidesEverDisplayed';

class LVConfiguration {
    constructor() {}

    static async hasAppEverLaunched() {
        return await LVPersistent.getBoolean(LV_Key_HasAppEverLaunched);
    }

    static async setAppHasBeenLaunched() {
        await LVPersistent.setBoolean(LV_Key_HasAppEverLaunched, true);
    }

    static async hasAppGuidesEverDisplayed() {
        return await LVPersistent.getBoolean(LV_Key_HasAppEverLaunched);
    }

    static async setAppGuidesHasBeenDisplayed() {
        await LVPersistent.setBoolean(LV_Key_HasAppEverLaunched, true);
    }
}

export default LVConfiguration;