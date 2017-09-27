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

class TestComponent extends Component {

    componentDidMount() {
       this.testNative();
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
                    rounded
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

        let res = await NativeModules.LVReactExport.libscrypt('showmethemoney',
        '8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af', 262144,8,1, 64);
        let isOk = res === '81f5e6e983cccc5a42efaa07e6e5ca002f1aee545c779d9fada9d6fcee0c92028b1b0cad770ca4164022ac05860d6a326cd5cb2ca88530a3e1dea9388b441ff4';
        this.log(isOk)

        NativeModules.LVReactExport.libscryptWithCallback('showmethemoney',
        '8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af', 262144,8,1, 64, (result) => {
            this.log(result);
        });
    }

    log(msg:any) {
        console.log('--------test------- msg = ' + msg);
    }
}

export default TestComponent;


