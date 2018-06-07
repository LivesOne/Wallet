/*
 * Project: Venus
 * File: src/logic/LVWalletManager.js
 * Author: Charles Liu
 * @flow
 */

import LVWallet from './LVWallet';
import LVPersistent from './LVPersistent';
import LVConfiguration from './LVConfiguration';
import LVNotificationCenter from '../logic/LVNotificationCenter';
import LVNotification from '../logic/LVNotification';
import LVNetworking from './LVNetworking';
import LVTransactionRecordManager from './LVTransactionRecordManager';
import WalletUtils from '../views/Wallet/WalletUtils';
import LVBig from './LVBig';

const foundation = require('../foundation/wallet.js');
const WalletsKey :string = '@Venus:WalletsInfo';

function createNewKeystore(name: string, password: string, keystore: Object){
    return new LVWallet(name, keystore);
}

class WalletManager {
    //don't use this property directly, use getWallets() method instead as this method
    //will return a new array that contains same elements.
    wallets: Array<LVWallet>;
    selectedIndex: number;

    constructor() {
        this.wallets = [];
        this.selectedIndex = 0;
    }

    /**
     * load wallets from disk storage.
     */
    async loadLocalWallets() {
        const storageValue = await LVPersistent.getObject(WalletsKey);
        if (storageValue) {
            console.log(storageValue);
            if (storageValue.wallets.length > 0 && storageValue.wallets[0].hasOwnProperty('lvt')) {
                //old persistent
                this.wallets = [];
                storageValue.wallets.forEach(obj => {
                    var wallet = new LVWallet(obj.name, obj.keystore);
                    wallet.setBalance(LVWallet.LVTC_TOKEN, obj.lvt);
                    wallet.setBalance(LVWallet.ETH_TOKEN, obj.eth);
                    this.wallets.push(wallet);
                });
            } else {
                this.wallets = [];
                storageValue.wallets.forEach(obj => {
                    var wallet = new LVWallet(obj.name, obj.keystore);
                    obj.balance_list && obj.balance_list.forEach(b => wallet.setBalance(b.token, b.value));
                    obj.holding_list && obj.holding_list.forEach(b => wallet.setBalance(b.token, b.value));
                    this.wallets.push(wallet);
                });
            }
            this.selectedIndex = Math.max(0, Math.min(this.wallets.length - 1, storageValue.selectedIndex));
        }
    }

    /**
     * save wallets to disk storage.
     */
    async saveToDisk() {
        const walletInfo = {
            wallets: this.wallets,
            selectedIndex: this.selectedIndex
        };
        await LVConfiguration.setAnyWalletAvailable(this.wallets.length > 0);
        await LVPersistent.setObject(WalletsKey, walletInfo);
    }

    getWallets(): Array<LVWallet> {
        return [].concat(this.wallets).reverse();
    }

    /**
     * set the selected wallet with address
     * @param  {string} address
     * @returns bool
     */
    setSelectedWallet(address: string): boolean {
        const index = this.wallets.findIndex(w => {
            return address === w.address;
        });

        if (index === -1) {
            console.log('attempt to set selected wallet by using a invalid address');
            return false;
        }

        if (this.selectedIndex === index) {
            console.log('nothing happens as current selected index is same as the target selection index.');
            return false;
        }

        this.selectedIndex = index;
        return true;
    }

    /**
     * get the selected wallet.
     * @returns  { 
     *              name: name, //the name of the wallet
                    keystore: keystore, // the keystore object of the wallet.
                    address: keystore.address, //the address of the wallet
                    balance: 0 //the balance of the wallet.
                }
     */
    getSelectedWallet(): ?LVWallet {
        if (this.selectedIndex < this.wallets.length) {
            return this.wallets[this.selectedIndex];
        }
        return null;
    }

    isWalletNameAvailable(name: string): boolean {
        const index = this.wallets.findIndex(w => {
            return w.name === name;
        });
        return index === -1;
    }

    async updateWalletBalance() {
        const wallet = this.getSelectedWallet();
        if (wallet) {
            try {
                const tokens_except_eth = await LVNetworking.fetchTokenList();
                const tokens = [...tokens_except_eth, LVWallet.ETH_TOKEN];
                const balances = await LVNetworking.fetchBalances(wallet.address, tokens);
                console.log(balances);

                tokens.forEach(token => {
                    wallet.setBalance(token, balances[token]);
                });

                await this.saveToDisk();
                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
                
                return true;
            } catch (error) {
                console.log('error in refresh wallet datas : ' + error);
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * export the private key of current wallet.
     * @param  {string} password
     */
    async exportPrivateKey(wallet: LVWallet, password: string): Promise<string> {
        const promise = new Promise(function(resolve, reject) {
            try {
                foundation.exportPrivateKey(password, wallet.keystore, (privateKey, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(privateKey);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });

        return promise;
    }

    /**
     * create a wallet
     * @param  {string} name
     * @param  {string} password
     * @returns Promise
     */
    async createWallet(name: string, password: string): Promise<LVWallet> {
        const promise = new Promise(function(resolve, reject) {
            foundation.createKeyStore(password, null, function(keystore, error) {
                if (error) {
                    reject(error);
                    return;
                }
                const walletInfo = createNewKeystore(name, password, keystore);
                resolve(walletInfo);
            });
        });
        return promise;
    }

    /**
     * @param  {LVWallet} wallet
     * @returns bool
     */
    addWallet(wallet: LVWallet): boolean {
        const index = this.wallets.findIndex(w => {
            if (w.address === wallet.address || w.name === wallet.name) {
                console.log('warning, attempt to add duplicate wallet');
                return true;
            }
            return false;
        });

        if (index === -1) {
            this.wallets.push(wallet);
            return true;
        }
        return false;
    }

    updateWallet(wallet: LVWallet): boolean {
        const index = this.wallets.findIndex(w => {
            return w.address === wallet.address;
        });

        if (index === -1) {
            return false;
        } else {
            this.wallets[index] = wallet;
            return true;
        }
    }

    /**
     * delete a wallet.
     * @param  {string} address wallet address
     * @returns bool true if delete succeeds, otherwise false.
     */
    deleteWallet(address: string): boolean {
        const walletIndex = this.wallets.findIndex(w => {
            return w.address === address;
        });
        if (walletIndex === -1) {
            return false;
        }
        //remove wallet from memory.
        this.wallets.splice(walletIndex, 1);
        //make sure the selected index is in valid range.
        this.selectedIndex = Math.max(0, Math.min(this.wallets.length - 1, this.selectedIndex));
        return true;
    }

    findWalletWithAddress(address: string): ?Object {
        const wallet = this.wallets.find(w => {
            return w.address === address;
        });

        return wallet;
    }

    /**
     * import wallet with private key.
     * @param  {string} name
     * @param  {string} password
     * @param  {string} privateKey
     */
    async importWalletWithPrivatekey(name: string, password: string, privateKey: string) {
        const promise = new Promise(function(resolve, reject) {
            try {
                foundation.importWithPrivateKey(password, privateKey, function(keystore, error) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const walletInfo = createNewKeystore(name, password, keystore);
                    resolve(walletInfo);
                });
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
    /**
     * import wallet with keystore string.
     * @param  {string} name
     * @param  {string} password
     * @param  {Object} keystore
     */
    async importWalletWithKeystore(name: string, password: string, keystore: Object) {
        const promise = new Promise(function(resolve, reject) {
            try {
                foundation.importWithKeyStoreObject(password, keystore, function(calcedKeystore, error) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const walletInfo = createNewKeystore(name, password, calcedKeystore);
                    resolve(walletInfo);
                });
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
    /**
     * Modify wallet's password
     * @param  {LVWallet} wallet
     * @param  {string} oldPassword
     * @param  {string} newPassword
     */
    async modifyPassword(wallet: LVWallet, oldPassword: string, newPassword: string) {
        const promise = new Promise(function(resolve, reject) {
            try {
                foundation.modifyPassword(oldPassword, wallet.keystore, newPassword, function(calcedKeystore, error) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    wallet.keystore = calcedKeystore;
                    if (wallet.address !== calcedKeystore.address) {
                        reject({ error: 'internal error, keystore addresses are different.' });
                    } else {
                        resolve(wallet);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }

    async verifyPassword(password: string, keystore: Object): Promise<boolean> {
        const promise = new Promise(function(resolve, reject) {
            try {
                foundation.verifyPassword(password, keystore, function(isMatched: boolean, error) {
                    WalletUtils.log('no catch and isMatched = ' + (isMatched ? 'true' : 'false'));
                    resolve(isMatched);
                });
            } catch (error) {
                WalletUtils.log('catch ' + error);
                reject(false);
            }
        });

        return promise;
    }
}

const walletManager = new WalletManager();

export default walletManager;