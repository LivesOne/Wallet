/*
 * Project: Venus
 * File: src/logic/LVMarketInfo.js
 * @flow
 */
'use strict';

import Moment from 'moment';
import LVNetworking from './LVNetworking';
import LVPersistent from './LVPersistent';

const LastExchangeRateKey = '@Venus:LastExchangeRate';
const LastExchangeRateFethTimeKey = '@Venus:LastExchangeRateFethTime';

class LVMarketInfo {
    constructor() {}

    static usd_per_eth = 0;
    static lvt_per_eth = 0;

    static async updateExchangeRateIfNecessary() {
        const lastFetchTime = await LVPersistent.getNumber(LastExchangeRateFethTimeKey);
        const currentTime = Moment().format('X');

        if (currentTime - lastFetchTime > (3600 * 24)) {
            try {
                const rate = await LVNetworking.fetchMarketExchangeRates();
                this.usd_per_eth = rate.eth_usd;
                this.lvt_per_eth = rate.eth_lvt;
                await LVPersistent.setObject(LastExchangeRateKey, rate);
                await LVPersistent.setNumber(LastExchangeRateFethTimeKey, currentTime);
            } catch (error) {

            }
        } else {
            const rate = await LVPersistent.getObject(LastExchangeRateKey);
            if (rate) {
                this.usd_per_eth = rate.eth_usd;
                this.lvt_per_eth = rate.eth_lvt;
            }
        }
    }
}

export default LVMarketInfo;
