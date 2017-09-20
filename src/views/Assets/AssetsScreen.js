/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MXButton from '../../components/MXButton';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import MXTextInputWithClear from '../../components/MXTextInputWithClear';

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

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
                <MXTextInputWithClear
                    rounded
                    callbackParent = {() => {}}
                />
                <Text>Assets Screen</Text>
            </View>
        )
    }
}

export default AssetsScreen;