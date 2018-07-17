/*
 * Project: Wallet
 * File: src/views/Transfer/TransferMinerTips.js
 * @flow
 * author: xcl
 */

"use strict";

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Image } from 'react-native';
import Modal from 'react-native-modalbox';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVColor from './../../styles/LVColor';
import * as MXUtils from './../../utils/MXUtils';
import LVStrings from './../../assets/localization';
import LVSize from '../../styles/LVFontSize';

type Props = {
    navigation: Object 
};

export class TransferMinerTips extends Component<Props> {


    render() {
        return (
            <View style = {{justifyContent: 'center'}}>
                <MXNavigatorHeader
                    style={{ backgroundColor: LVColor.white }}
                    title={LVStrings.transfer}
                    titleStyle={{color: LVColor.text.grey2, fontSize: LVSize.large}}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style = {{flex:1 ,backgroundColor:'red'}}>
                </View>
            </View>
    )}

}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
      },
});

export default TransferMinerTips