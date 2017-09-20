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
                    rounded
                    onPress = {() => {
                        alert("button clicked");
                    }}
                    themeStyle={"active"}
                />
                <Text>Assets Screen</Text>
            </View>
        )
    }
}

export default AssetsScreen;