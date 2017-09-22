/*
 * Project: Venus
 * File: src/views/Assets/CreateWalletScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

const assetsIcon = require("../../assets/images/create_wallet.png");

class CreateWalletScreen extends Component {
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
            </View>
        )
    }
}

export default CreateWalletScreen;