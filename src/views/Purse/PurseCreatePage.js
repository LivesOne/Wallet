/*
 * Project: Venus
 * File: src/views/Assets/PurseCreatePage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet'
import MXNavigatorHeader from './../../components/MXNavigatorHeader';

const assetsIcon = require("../../assets/images/create_wallet.png");

export default class PurseCreatePage extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style = {styles.container}>
                <MXNavigatorHeader
                    style={ styles.header }
                    titleColor={ LVColor.white }
                    title = {LVStrings.create_wallet}
                    onBackPress = {() => {
                    this.props.navigation.goBack();
                    }}
                />
            </View>
        )
    }
}

const styles = LVStyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        backgroundColor: LVColor.white,
    },
    header: {
        backgroundColor: LVColor.primary,
        height: 50,
    },
});