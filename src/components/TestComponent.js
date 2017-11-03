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
import { ImageTextInput } from '../views/Transfer/ImageTextInput';
import LVWalletManager from '../logic/LVWalletManager';
import LVNetworking from '../logic/LVNetworking';
import TransferLogic from '../views/Transfer/TransferLogic';
import { isAddress } from '../utils/MXStringUtils';
import WalletUtils from '../views/Wallet/WalletUtils';
import TransferUtils from '../views/Transfer/TransferUtils';
import { LVPasswordDialog } from '../views/Common/LVPasswordDialog';
import { LVBalanceShowView } from '../views/Common/LVBalanceShowView';
var Big = require('big.js');

const eth_local = require('../foundation/ethlocal.js');
const wallet = require('../foundation/wallet.js');

const ICAP = require('ethereumjs-icap')

const MAX_BALANCE_LENGTH_LIMIT = 13;


class TestComponent extends Component {

    componentDidMount() {
       //this.testNative();
       //this.testWalletApi();
    }

    state: {
        str: string,
    }

    constructor() {
        super();
        this.state = {
            str: '',
        }
    }

    async fakeVerify() {
        let wallet = LVWalletManager.getSelectedWallet();
        return await LVWalletManager.verifyPassword('hello', wallet.keystore);
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
                        //this.testWalletValidator();
                        //this.refs.passwordDialog.show();
                        this.test0x();
                        //this.testWalletApi();
                    }}
                    themeStyle={"active"}
                />

                {/* <LVBalanceShowView
                    balanceStr={"37834690.99999999461031936"}
                >

                </LVBalanceShowView> */}
                
                <MXCrossTextInput
                    withUnderLine = {true}
                    placeholder={"hello"}
                    onTextChanged = {(newText) => {this.setState({str: newText})}}
                />

                <MXSwitchTab
                    leftText= {'共生币'}
                    rightText={'right'}
                    onTabSwitched={(leftPressed)=>{
                        }
                    }
                />
                <ImageTextInput
                    placeholder={'请输入文字'}
                    onTextChanged={(s) => {alert(s)}}
                    onAddClicked={()=>{alert('add clicked')}}
                    onScanClicked={()=>{alert('scan clicked')}}
                >

                </ImageTextInput>
                <LVPasswordDialog
                    ref={'passwordDialog'}
                    title={'input your password'}
                    verify={this.fakeVerify.bind(this)}
                    onVerifyResult={(result) => {alert(result)}}
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

    testBalance() {
        const testcases = ['37834690', '3783469098783433478828372323232',
        '37834690.99999999461031936',
        '3783469098783433478828372.99999999461031936',
        '1234567891234.99999999461031936',
        '123456789123.99999999461031936',
        '12345678912.99999999461031936',
        '1234567891.99999999461031936',
        '0.234223432',
        '0.8984932483249382984938298493829',
        '390.99999999461031936'];

        for (var i = 0; i< testcases.length; i++) {
            console.log('old=' + testcases[i] + ' new = ' + this.convertBalance(testcases[i]));
        }
    }

    // const walletInfo = {
    //     name: name,
    //     keystore: keystore,
    //     address: keystore.address,
    //     balance: 0
    // };

    // curl "http://10.16.10.9:10888/wallet/param?from=0x0233C1dd7fbE6DaB8C233Bf017F4B1F3BAfEc0B3&to=0xddfe1e560cabe7c06b0ec25f71c198e2a676d592&value=10000000000000000000"
    // {"code":0,"result":{"gasLimit":"0x8e65","nonce":"0xb","gasPrice":"0x4e3b29200","chainID":3,"token":"0xe6d97f5cb9e9C5c45025e67224fbA0a5f5A3751b","priceMin":"0x3b9aca00","priceMax":"0xba43b7400"}}
    async testWalletApi() {
        const wallet = {
            "name": "HelloMaxthon",
            "keystore": {
              "address": "ddfe1e560cabe7c06b0ec25f71c198e2a676d592",
              "crypto": {
                "cipher": "aes-128-ctr",
                "ciphertext": "de0a1065c8afae18fc1003124ed5f0f8b991846678e9a8093694c8b5ea6a2d4d",
                "cipherparams": {
                  "iv": "74174ca6ded73e0985f500c45c23ca06"
                },
                "mac": "62f993f4d679aa762648a080f5bf29e10dbb371ca5a12d8f2d8aae97ffe6c1d1",
                "kdf": "scrypt",
                "kdfparams": {
                  "dklen": 32,
                  "n": 262144,
                  "r": 8,
                  "p": 1,
                  "salt": "e7d129f5df099754701e3c010249140035fd26ecca712d0235556db800112976"
                }
              },
              "id": "71ecff67-9a2f-4b9b-b092-9f7944031556",
              "version": 3
            },
            "address": "ddfe1e560cabe7c06b0ec25f71c198e2a676d592",
            "balance": 0
          };

          WalletUtils.log('begin history');
        const result1 = await LVNetworking.fetchBalance(wallet.address);
        WalletUtils.log('history =' + JSON.stringify(result1));

        // const result2 = await LVNetworking.fetchTransactionParam(wallet.address, '0x0233C1dd7fbE6DaB8C233Bf017F4B1F3BAfEc0B3', 10000000000000000000);
        // this.log('Param =' + JSON.stringify(result2));

        // const result3 = await LVNetworking.fetchTransactionDetail('0x635f86096df7dfa624f2f2eba6ffb79a67f7550704cb618b61045ac5a364633b');
        // this.log('detail =' + JSON.stringify(result3));
        
        // await this.testTransaction(wallet);
    }

    convertBalance(original :string) {
        const arr = original.split('.');
        let totalLength = 0;
        for (var i = 0; i < arr.length; i++) {
            totalLength += arr[i].length;
        }
        if (totalLength <= MAX_BALANCE_LENGTH_LIMIT) {
            return original;
        } else {
            const fragmentLength = MAX_BALANCE_LENGTH_LIMIT / 4;
            if (arr.length > 1) {
                const num = arr[0];
                const decimal = arr[1];
                if (num.length < MAX_BALANCE_LENGTH_LIMIT) {
                    if (num.length === MAX_BALANCE_LENGTH_LIMIT - 1) {
                        return num;
                    } else {
                        return num + '.' + decimal.slice(0, MAX_BALANCE_LENGTH_LIMIT - num.length - 1);
                    }
                } else {
                    const numHead = num.slice(0, fragmentLength);
                    const numTail = num.slice(num.length - fragmentLength + 1);
                    let leftLength = MAX_BALANCE_LENGTH_LIMIT - 4 - 2 * fragmentLength;
                    leftLength = Math.min(decimal.length, leftLength);
                    const decimalPart = decimal.slice(0, leftLength + 1);
                    return [numHead, '...', numTail, '.', decimalPart].join('');
                }
            } else {
                const num = original;
                const numHead = num.slice(0, fragmentLength);
                const numTail = num.slice(num.length - fragmentLength + 1);
                return [numHead, '...', numTail].join('');
            }
        }
    }

    test0x() {
        // TransferUtils.log('before = ' + '0x878uiui' + ' after = ' + TransferUtils.convertToHexHeader('0x878uiui'));
        // TransferUtils.log('before = ' + '878uiui' + ' after = ' + TransferUtils.convertToHexHeader('878uiui'));
        // TransferUtils.log('before = ' + '0xe' + ' after = ' + TransferUtils.convertToHexHeader('0xe'));
            //TransferUtils.log(TransferUtils.convert2BNHex(1000000));
            //alert('begin');
        var x = new Big('123.4567');
        var y = new Big('2');
        //alert('x = ' + x.toFixed(5));
        alert('x * y = ' + x.times(y).toString());
    }

    async testTransaction(wallet: Object) {
        const valueArray = ['1'];
        // try {
        //     for(var i =0; i < valueArray.length; i++) {
        //         const result4 = await TransferLogic.transaction('niceToMeetYou', '0x9224A9f81Ac30F0E3B568553bf9a7372EE49548C', valueArray[i], wallet);
        //         this.log(JSON.stringify(result4));
        //     }   
        // } catch(e) {
        //     this.log(e.message);
        // }
    }


    testStandardAddr() {
        let imToken1 = 'iban:XE79AQHS00IKTQ0H0QKP2K97ZULC2OT9CIX?amount=0&token=ETH';
        let imToken2 = 'iban:XE79AQHS00IKTQ0H0QKP2K97ZULC2OT9CIX';
        this.log('parse others1 = ' + TransferUtils.convertIban2Addr(imToken1));
        this.log('parse others2 = ' + TransferUtils.convertIban2Addr(imToken2));

        let inner1 = '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8';
        let inner2 = '00c5496aee77c1ba1f0854206a26dda82a81d6d8';
        this.log('export inner1 = ' + TransferUtils.convertAddr2Iban(inner1));
        this.log('export inner2 = ' + TransferUtils.convertAddr2Iban(inner2));
    }


    testWalletValidator() {
        alert(WalletUtils.isValidKeyStoreStr(this.state.str));
    }

    testIsAddress() {
        const test1='0x9224A9f81Ac30F0E3B568553bf9a7372EE49548C';
        const test2='0x635f86096df7dfa624f2f2eba6ffb79a67f7550704cb618b61045ac5a364633b';
        const test3='askdjfka';
        this.log(''+ (isAddress(test1) ? 'true' : 'fasle'));
        this.log(isAddress(test2));
        this.log(isAddress(test3));
    }

    testBN() {
        TransferUtils.testBN();
    }

    log(msg:any) {
        console.log('--------test------- msg = ' + msg);
    }
}

export default TestComponent;


