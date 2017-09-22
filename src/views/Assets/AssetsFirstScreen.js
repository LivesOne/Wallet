/*
 * Project: Venus
 * File: src/views/Assets/AssetsFirstScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MXButton from '../../components/MXButton';
import LVStrings from '../../assets/localization';

const assetsIcon = require("../../assets/images/create_wallet.png");

class AssetsFirstScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: "white"}} >
                <Image
                    source={assetsIcon}
                    style={{marginTop: 110, width: 220, height: 220}}
                />
                <MXButton
                    rounded
                    title={LVStrings.create_wallet}
                    onPress = {() => {
                        this.props.navigation.navigate("CreateWallet")
                    }}
                    themeStyle={"active"}
                    style={{marginTop: 80}}
                />
                <MXButton
                    rounded                
                    title={LVStrings.assets_import_header}
                    onPress = {() => {
                        alert(LVStrings.assets_import_header);
                    }}
                    themeStyle={"active"}
                    style={{marginTop: 25}}
                />
            </View>
        )
    }
}

export default AssetsFirstScreen;