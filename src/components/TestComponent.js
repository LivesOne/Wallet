/*
 * Project: Venus
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MXButton from './MXButton';
import MXNavigatorHeader from './MXNavigatorHeader';
import MXCrossTextInput from './MXCrossTextInput';
import { MXSwitchTab } from './MXSwitchTab';

class TestComponent extends Component {

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <MXNavigatorHeader
                    title = {"header"}
                    onBackPress = {() => {
                    alert("back clicked")
                    }}
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
                        alert(leftPressed ? "leftPressed" : "rightPressed")}}
                />
            </View>
        )
    }
}

export default TestComponent;


