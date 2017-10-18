/*
 * Project: Venus
 * File: src/foundation/wallet.js
 * Author: Charles Liu
 * @flow
 */
import WalletUtils from '../views/Wallet/WalletUtils';

const eth_local = require('./ethlocal.js');
const ethUtil = require('ethereumjs-util');
const crypto = require("crypto");

module.exports = {
    defaultOptions : {
        kdf : 'scrypt',
        cipher : 'aes-128-ctr',
        kdfparams : {
            n: 262144,
            r: 8,
            p: 1,
            dklen: 32
        }
    },

    setInternalErrorHandleHook: function(hook: Function) {
        eth_local.internalErrorHandleHook = hook;
    },

    /**
     * Create key store.
     * @param  {string} password
     * @param  {?string} privateKey. this param is optional.
     * @param  {?Function} callback this callback returns the created keystore object to the caller.
     * @description keystore object example.
     * 
     * { address: 'ba23cf872924eb600e81f08d7e7d9ff3c28e38ed', //address, use this address to send or receive.
        crypto: 
        { cipher: 'aes-128-ctr',
            ciphertext: '12d613f55e0516e93862bc248456ff6930821cb3722067357248f8023527220d',
            cipherparams: { iv: '333e3f5bea39ff631b68854db0c13a32' },
            mac: 'c238e9ca9a43ed8a6c45ae73c0273ff0dd23e063ba6fe373ff4e2716b88ac638',
            kdf: 'scrypt',
            kdfparams: 
            { dklen: 32,
                n: 262144,
                r: 8,
                p: 1,
                salt: '8314fcb5dd14a90a3ff079a58157ab3b4ce4d9562b3b262d78e98e778db9d534' } },
        id: 'ab3075f1-0ebf-4c16-93eb-00c106a3c224',
        version: 3 }
     * 
     * 
     */
    createKeyStore : function(password: string, privateKey: ?string, callback: ?Function) {
        if(!callback) {
            throw 'callback is required';
        }  

        let keyObj = null;
        if(!privateKey) {
            keyObj = eth_local.create();
        } else {
            keyObj = {
                privateKey: privateKey,
                salt: crypto.randomBytes(32),
                iv: crypto.randomBytes(16),
            }
        }
        console.log('private key is ' + keyObj.privateKey.toString('hex'));
        eth_local.dump(password, keyObj.privateKey, keyObj.salt, keyObj.iv, this.defaultOptions, callback);
    },
    
    modifyPassword: function(oldPassword: string, keyStoreObject: Object, newPassword: string, callback: Function) {
        if(!callback) {
            throw 'callback is required';
        } 

        const self = this;
        
        eth_local.recover(oldPassword, keyStoreObject, function(privateKeyBuffer) {
            const privateKey = privateKeyBuffer.toString('hex');

            self.createKeyStore(newPassword, privateKey, callback);
        });
    },

    /**
     * import keystore with keystore object.
     * @param  {string} password
     * @param  {Object} keyStoreObject
     * @param  {?Function} callback this callback returns the keystore object to the caller.
     */
    importWithKeyStoreObject : function(password: string, keyStoreObject: Object, callback: ?Function) {
        if(!callback) {
            throw 'callback is required';
        }  

        const self = this;

        eth_local.recover(password, keyStoreObject, function(privateKeyBuffer) {
            const privateKey = privateKeyBuffer.toString('hex');

            self.createKeyStore(password, privateKey, callback);
        });
       
    },

    /**
     * import keystore with private key.
     * @param  {string} password
     * @param  {string} privateKey
     * @param  {?Function} callback this callback returns the keystore object to the caller. 
     */
    importWithPrivateKey : function(password: string, privateKey: string, callback: ?Function) {
        if(!callback) {
            throw 'callback is required';
        }  

        const self = this;
        this.createKeyStore(password, privateKey, function(keystore){

            //validate if the import succeeds through recovering.
            eth_local.recover(password, keystore, function(privateKeyBuffer){
                const recoveredPrivateKey = privateKeyBuffer.toString('hex');
                if(privateKey !== recoveredPrivateKey) {
                    callback(null);
                } else {
                    callback(keystore);
                }
            });
        });
    },

    /**
     * export private key with keystore object.
     * @param  {string} password
     * @param  {string} keyStoreObject
     * @param  {?Function} callback
     */
    exportPrivateKey: function(password: string, keyStoreObject: Object, callback: ?Function) {   
        if(!callback) {
            throw 'callback is required';
        }     

        eth_local.recover(password, keyStoreObject, function(privateKeyBuffer) {
            const privateKey = privateKeyBuffer.toString('hex');
            if(callback) {
                callback(privateKey);
            }
        });
    }
};