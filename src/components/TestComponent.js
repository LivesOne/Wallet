/*
 * Project: Venus
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, NativeModules } from 'react-native';
import MXButton from './MXButton';
import MXNavigatorHeader from './MXNavigatorHeader';
import MXCrossTextInput from './MXCrossTextInput';
import { MXSwitchTab } from './MXSwitchTab';
import LVWalletManager from '../logic/LVWalletManager';
import LVWalletApi from '../logic/LVWalletApi';

const eth_local = require('../foundation/ethlocal.js');
const wallet = require('../foundation/wallet.js');

class TestComponent extends Component {

    componentDidMount() {
       //this.testNative();
       this.testWalletApi();
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}} >
                <MXNavigatorHeader
                    title = {"title"}
                    left = {'left'}
                    onLeftPress = {() => {alert("left")}}
                    right = {require("../assets/images/qrScan.png")}
                    onRightPress = {() => {alert("right")}}
                />
                <MXButton
                    title={"hello"}
                    onPress = {() => {
                    alert("button clicked");
                    }}
                    themeStyle={"active"}
                />
                
                <MXCrossTextInput
                    withUnderLine = {true}
                    placeholder={"hello"}
                    onTextChanged = {(newText) => {alert(newText)}}
                />

                <MXSwitchTab
                    leftText= {'共生币'}
                    rightText={'right'}
                    onTabSwitched={(leftPressed)=>{
                        }
                    }
                />
            </View>
        )
    }

    async testNative() {
        let nativeMsg =  await NativeModules.LVReactExport.test();
        this.log(nativeMsg);

        // let res = await NativeModules.LVReactExport.libscrypt('showmethemoney',
        // '8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af', 262144,8,1, 64);
        // let isOk = res === '81f5e6e983cccc5a42efaa07e6e5ca002f1aee545c779d9fada9d6fcee0c92028b1b0cad770ca4164022ac05860d6a326cd5cb2ca88530a3e1dea9388b441ff4';
        // this.log(isOk)

        NativeModules.LVReactExport.libscrypt('showmethemoney',
        '8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af', 262144,8,1, 64, (result) => {
            this.log(result);
        });
    }

    // const walletInfo = {
    //     name: name,
    //     keystore: keystore,
    //     address: keystore.address,
    //     balance: 0
    // };
    async testWalletApi() {
        const wallet = await LVWalletManager.createWallet("HelloMaxthon", "niceToMeetYou");
        this.log(JSON.stringify(wallet));


        // const wallet = {"version":3,"id":"7b2cf509-2568-48a4-9c7e-7d65a05d748f","address":"b09a753b35c031147e8c373f5df875032d1ac039","Crypto":{"ciphertext":"4279bf9f995535a40fd8be6d717bd95d811223e4bcc43609a3ca9e0f1803c015","cipherparams":{"iv":"d582fe5b6fdf1423ebba57c32d7e89a4"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"6853d0ab4604c348aaeb9a2099f19b0676217534df2d08bc0461d2e50192f6ba","n":1024,"r":8,"p":1},"mac":"dee8797f58e9580b9c95bd76889802683d8ab957c8e7e551c9e736a168d1dd8d"}};
        //test get balance
        // const result = await LVWalletApi.getBalance(wallet.address);
        // this.log(JSON.stringify(result));

        //test get transaction history
        // const result1 = await LVWalletApi.getTransactionHistory(wallet.address);
        // this.log(JSON.stringify(result1));

        // test get transaction params
        const result2 = await LVWalletApi.getTransactionParams(wallet.address);
        this.log(JSON.stringify(result2));

        //{"nonce":0,"gasPrice":"21000000000","gasLimit":220000}
        const privateKey = await this.getPrivateKey('niceToMeetYou', wallet.keystore);
        this.log(privateKey);
        const nonce = result2.result.nonce;
        const gasPrice = result2.result.gasPrice;
        const gasLimit = result2.result.gasLimit;
        const token = '0xe6d97f5cb9e9C5c45025e67224fbA0a5f5A3751b';
        const from = ''; //
        const to = token; //
        const value = ''; //

        let txData = await eth_local.generateTxData(privateKey, nonce, token, from, to, value, gasPrice, gasLimit);
        this.log('tx=' + txData);




        // test get transaction details
        // const result3 = await LVWalletApi.getTransactionDetails(wallet.keystore);
        // this.log(JSON.stringify(result3));

        // test post transaction
        const result4 = await LVWalletApi.postTransaction(txData);
        this.log(JSON.stringify(result4));
    }

    async getPrivateKey(password : string, keystore: Object) : Promise<?string> {
        const promise = new Promise(function(resolve, reject){
            wallet.exportPrivateKey(password, keystore, (p) => {
                resolve(p);
            });
        });
        return promise;
    }

    log(msg:any) {
        console.log('--------test------- msg = ' + msg);
    }
}

export default TestComponent;


