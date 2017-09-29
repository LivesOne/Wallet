/*
 * Project: Venus
 * File: src/views/Transfer/TransferScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { TransferHeader } from './TransferHeader';
import MXCrossTextInput from './../../components/MXCrossTextInput';

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import { TransferMinerTipsSetter } from './TransferMinerTipsSetter';
import MXButton from './../../components/MXButton';
import * as MXUtils from '../../utils/MXUtils'

class TransferScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        curETH: number,
    }

    constructor() {
        super();
        this.state = {
            curETH: 1.32556,
        }
    }
    
    render() {
        return (
            <ScrollView contentContainerStyle={ styles.container }>
                <View  style={ styles.container }>
                    <TransferHeader
                        balance={2100000}
                    ></TransferHeader>
                    <View style= { styles.headerBelow }>
                        <MXCrossTextInput style= {styles.textInput} placeholder={LVStrings.transfer_payee_address}></MXCrossTextInput>
                        <MXCrossTextInput style= {styles.textInput} placeholder={LVStrings.transfer_amount}></MXCrossTextInput>
                        <MXCrossTextInput style= {styles.textInput} placeholder={LVStrings.transfer_remarks}></MXCrossTextInput>
                        <TransferMinerTipsSetter style = {styles.setter}></TransferMinerTipsSetter>
                        <View style= { [styles.curEth, {paddingBottom: 10,borderColor: 'transparent', borderBottomColor: LVColor.border.editTextBottomBoarder, borderWidth:0.5, marginTop:10}] }>
                            <Text style = {styles.text}>{LVStrings.transfer_current_eth}</Text>
                            <Text style = {styles.textCurEth}>{this.state.curETH}</Text>
                        </View>   
                        <Text style = {styles.textHint}>{LVStrings.transfer_hint}</Text>
                        <MXButton rounded = {true} style ={{alignSelf:'center', marginTop: 20}} title={LVStrings.transfer}></MXButton>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: MXUtils.getDeviceHeight(),
        backgroundColor: 'white',
    },
    textInput: {
        marginTop: 20, 
        width: '100%',
    },
    headerBelow: {
        flex: 1,
        marginHorizontal: 15,
    },
    setter: {
    },
    curEth: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,   
        color: LVColor.text.grey1,
    },
    textCurEth: {
        fontSize: 14,
        color: LVColor.primary,
    },
    textHint: {
        fontSize: 12,
        color: LVColor.text.grey1,
        marginTop: 10,
    }
});

export default TransferScreen;