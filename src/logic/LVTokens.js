/*
 * Project: Venus
 * File: src/logic/LVTokens.js
 * @flow
 */
'use strict';

import LVNetworking from './LVNetworking';

class LVTokens {
    icons: Map<string, any>;
    decimals: Map<string, number>;
    supported: Array<string>;

    constructor() {
        this.icons = new Map([
            ['eth', require('../assets/images/eth.png')],
            ['LVTC', require('../assets/images/lvt.png')],
            ['OMG', require('../assets/images/omg.png')],
            ['XRP', require('../assets/images/xrp.png')]
        ]);
        this.decimals = new Map([
            ['eth', 18],
            ['LVTC', 18]
        ]);
        this.supported = ['eth'];
    }

    async updateSupportedTokens() {
        try {
            var tokens = [];
            const object = await LVNetworking.fetchTokenList();
            
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    tokens.push(key);
                    this.decimals.set(key, parseInt(object[key].decimal));
                }
            }

            tokens = tokens.filter(token => this.icons.has(token));
            this.supported = [...tokens, 'eth'];
        } catch (error) {
            console.log('update supported tokens error - ' + error);
        }
    }
}

const defaultTokens = new LVTokens();
export default defaultTokens;
