/*
 * Project: Venus
 * File: src/logic/LVWalletManager.js
 * Author: Charles Liu
 * @flow
 */

import LVPersistent from './LVPersistent';
import LVConfiguration from './LVConfiguration';

const foundation = require('../foundation/wallet.js');
const WalletsKey :string = '@Venus:WalletsInfo';

class WalletManager {
    wallets: Array<Object>;
    selectedIndex: number;

    constructor() {
        this.wallets = [];
        this.selectedIndex = 0;
    }

    /**
     * load wallets from disk storage.
     */
    async loadLocalWallets() {
        const walletsInfo = await LVPersistent.getObject(WalletsKey);
        if(walletsInfo) {
            console.log(walletsInfo);
            this.wallets = walletsInfo.wallets;
            this.selectedIndex = Math.max(0,Math.min(this.wallets.length - 1, walletsInfo.selectedIndex));
        }
    }
    
    getWallets() : Array<Object> {
        return this.wallets.reverse();
    }

    /**
     * set the selected wallet with address
     * @param  {string} address
     * @returns bool
     */
    setSelectedWallet(address : string) : bool {
        const index = this.wallets.findIndex((w) => {
            return address === w.address;
        });

        if(index === -1) {
            console.log('attempt to set selected wallet by using a invalid address');
            return false;
        }

        if(this.selectedIndex === index) {
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
    getSelectedWallet() : ?Object {
        if(this.selectedIndex < this.wallets.length) {
            return this.wallets[this.selectedIndex];
        }
        return null;
    }

    isWalletNameAvailable(name : string) : bool {
        const index = this.wallets.findIndex((w) => {
            return w.name === name;
        });
        return index === -1;
    }

    /**
     * export the private key of current wallet.
     * @param  {string} password
     */
    async exportPrivateKey(password : string) : Promise<?string> {
        const selectedWallet = this.getSelectedWallet();
        const promise = new Promise(function(resolve, reject){
            if(!selectedWallet) {
                resolve(null);
            } else {
                foundation.exportPrivateKey(password, selectedWallet.keystore,(p) => {
                    resolve(p);
                });
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
    async createWallet(name : string, password : string) : Promise<Object> {
        const promise = new Promise(function(resolve, reject){
            foundation.createKeyStore(password, null, function(keystore){
                const walletInfo = {
                    name: name,
                    keystore: keystore,
                    address: keystore.address,
                    lvt: 0,
                    eth: 0
                };
                resolve(walletInfo);
            });
        });
        return promise;
    }

    /**
     * @param  {Object} wallet
     * @returns bool
     */
    addWallet(wallet : Object) : bool {
        const index = this.wallets.findIndex((w) => {
            if(w.address === wallet.address || w.name === wallet.name) {
                console.log('warning, attempt to add duplicate wallet');
                return true;
            }
            return false;
        });

        if(index === -1){
            this.wallets.push(wallet);
            return true;
        }
        return false;
    }
    /**
     * delete a wallet.
     * @param  {string} address wallet address
     * @returns bool true if delete succeeds, otherwise false.
     */
    deleteWallet(address : string) : bool {
        const walletIndex = this.wallets.findIndex((w)=>{
            return w.address === address;
        });

        //remove wallet from memory.
        this.wallets.splice(walletIndex,1);
        //make sure the selected index is in valid range.
        this.selectedIndex = Math.max(0,Math.min(this.wallets.length - 1, this.selectedIndex));
        return true;
    }

    findWalletWithAddress(address : string) : ?Object {
        const wallet = this.wallets.find((w) => {
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
    async importWalletWithPrivatekey(name: string, password : string, privateKey : string) {
        const promise = new Promise(function(resolve, reject){
            foundation.importWithPrivateKey(password, privateKey, function(keystore){
                const walletInfo = {
                    name: name,
                    keystore: keystore,
                    address: keystore.address,
                    lvt: 0,
                    eth: 0
                };
                resolve(walletInfo);
            });
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
        const promise = new Promise(function(resolve, reject){
            foundation.importWithKeyStoreObject(password, keystore, function(calcedKeystore) {
                const walletInfo = {
                    name: name,
                    keystore: calcedKeystore,
                    address: calcedKeystore.address,
                    lvt: 0,
                    eth: 0
                };
                resolve(walletInfo);
            })
        });
        return promise;
    }

    saveToDisk() {
        const walletInfo = {
            wallets: this.wallets,
            selectedIndex: this.selectedIndex
        };

        LVConfiguration.setAnyWalletAvailable(this.wallets.length > 0);
        LVPersistent.setObject(WalletsKey, walletInfo);
    }
}

const walletManager = new WalletManager();

export default walletManager;