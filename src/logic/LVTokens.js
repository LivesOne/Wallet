/*
 * Project: Venus
 * File: src/logic/LVTokens.js
 * @flow
 */
'use strict';

import LVNetworking from './LVNetworking';

const tokenIcons = new Map([
    ['ETH',  require('../assets/images/tokens/normal/ETH.png')],
    ['LVTC', require('../assets/images/tokens/normal/LVT.png')],
    ['USDT', require('../assets/images/tokens/normal/USDT.png')],
    ['AE',  require('../assets/images/tokens/normal/AE.png')],
    ['BAT', require('../assets/images/tokens/normal/BAT.png')],
    ['BNB', require('../assets/images/tokens/normal/BNB.png')],
    ['DGD', require('../assets/images/tokens/normal/DGD.png')],
    ['GNT', require('../assets/images/tokens/normal/GNT.png')],
    ['OMG', require('../assets/images/tokens/normal/OMG.png')],
    ['REP', require('../assets/images/tokens/normal/REP.png')],
    ['XRP', require('../assets/images/tokens/normal/XRP.png')],
    ['ZIL', require('../assets/images/tokens/normal/ZIL.png')],
    ['ZRX', require('../assets/images/tokens/normal/ZRX.png')],
    ['UNKNOWN', require('../assets/images/tokens/normal/UNKNOWN.png')]
]);

const tokenLargeIcons = new Map([
    ['ETH',  require('../assets/images/tokens/large/ETH.png')],
    ['LVTC', require('../assets/images/tokens/large/LVT.png')],
    ['USDT', require('../assets/images/tokens/large/USDT.png')],
    ['AE',  require('../assets/images/tokens/large/AE.png')],
    ['BAT', require('../assets/images/tokens/large/BAT.png')],
    ['BNB', require('../assets/images/tokens/large/BNB.png')],
    ['DGD', require('../assets/images/tokens/large/DGD.png')],
    ['GNT', require('../assets/images/tokens/large/GNT.png')],
    ['OMG', require('../assets/images/tokens/large/OMG.png')],
    ['REP', require('../assets/images/tokens/large/REP.png')],
    ['XRP', require('../assets/images/tokens/large/XRP.png')],
    ['ZIL', require('../assets/images/tokens/large/ZIL.png')],
    ['ZRX', require('../assets/images/tokens/large/ZRX.png')],
    ['UNKNOWN', require('../assets/images/tokens/large/UNKNOWN.png')]
]);

const tokenFullNames = new Map([
    ['ETH',  'Ethereum Foundation'],
    ['LVTC', 'LivesToken'],
    ['USDT', 'Tether USD'],
    ['AE',   'Aeternity'],
    ['BAT',  'Basic Attention Token'],
    ['BNB',  'BNB'],
    ['DGD',  'Digix DAO'],
    ['GNT',  'Golem Network Token'],
    ['OMG',  'OmiseGO Token'],
    ['REP',  'Augur Reputation'],
    ['XRP',  'Ripple'],
    ['ZIL',  'Zilliqa Token'],
    ['ZRX',  '0x Protocol Token']
]);

class LVTokenIcons {
    constructor() {}

    // has(token: string): boolean {
    //     return tokenIcons.has(token.toUpperCase());
    // }

    normal(token: string): any | void {
        if (tokenIcons.has(token.toUpperCase())) {
            return tokenIcons.get(token.toUpperCase());
        } else {
            return tokenIcons.get('UNKNOWN');
        }
    }

    large(token: string): any | void {
        if (tokenLargeIcons.has(token.toUpperCase())) {
            return tokenLargeIcons.get(token.toUpperCase());
        } else {
            return tokenLargeIcons.get('UNKNOWN');
        }
    }
}

class LVTokens {
    icons: LVTokenIcons;
    decimals: Map<string, number>;
    supported: Array<string>;

    constructor() {
        this.icons = new LVTokenIcons();
        this.decimals = new Map([['eth', 18], ['LVTC', 18]]);
        this.supported = ['eth'];
    }

    fullname(token: string) : string {
        return tokenFullNames.get(token.toUpperCase()) || token.toUpperCase();
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

            this.supported = [...tokens, 'eth'];
        } catch (error) {
            console.log('update supported tokens error - ' + error);
        }
    }
}

const defaultTokens = new LVTokens();
export default defaultTokens;
