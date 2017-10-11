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
import { TransferDetailModal } from './TransferDetailModal';
import { ImageTextInput } from './ImageTextInput';

class TransferScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        curETH: number,
        addressIn: string,
        amount: number,
        minerTips: number,
        remarks: string,
        showModal: boolean,
    }

    constructor() {
        super();
        this.state = {
            curETH: 1.32556,
            addressIn: '325FDVXVb56EGD838FXC7AD0ASD21LDCH5',
            amount: 19840,
            minerTips: 0.0024,
            remarks: '无',
            showModal: false,
        }
    }

    onModalClosed() {
        this.setState({ showModal: false })
    }
    
    render() {
        return (
            <ScrollView 
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle={ styles.container }>
                {this.state.showModal && <TransferDetailModal
                    isOpen= {this.state.showModal}
                    address= {this.state.addressIn}
                    amount= {MXUtils.formatCurrency(this.state.amount) + ' LVT'}
                    minerTips= {this.state.minerTips + ' ETH'}
                    remarks= {this.state.remarks}
                    onClosed = {this.onModalClosed.bind(this)}
                    onTransferConfirmed = {()=>{alert('transfering...')}}
                />}
                <View  style={ styles.container }>
                    <TransferHeader
                        balance={2100000}
                    ></TransferHeader>
                    <View style= { styles.headerBelow }>
                        <ImageTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_payee_address}
                            onAddClicked={() => {alert('add contracts')}}
                            onScanClicked={() => {alert('scan clicked')}}
                            onTextChanged={(newText) => {this.setState({addressIn: newText})}}/>
                        <MXCrossTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_amount}
                            keyboardType = {'numeric'}
                            onTextChanged={(newText) => {this.setState({amount: (newText * 1) | 0})}}/>
                        <MXCrossTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_remarks}
                            onTextChanged={(newText) => {this.setState({remarks: newText})}}/>
                        <TransferMinerTipsSetter style = {styles.setter}></TransferMinerTipsSetter>
                        <View style= { styles.curEth }>
                            <Text style = {styles.text}>{LVStrings.transfer_current_eth}</Text>
                            <Text style = {styles.textCurEth}>{this.state.curETH}</Text>
                        </View>   
                        <Text style = {styles.textHint}>{LVStrings.transfer_hint}</Text>
                        <MXButton 
                            rounded = {true} 
                            style ={styles.btn} 
                            onPress = {()=> {this.setState({showModal: true})}}
                            title={LVStrings.transfer}>
                            </MXButton>
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
        paddingBottom: 10,
        borderColor: 'transparent', 
        borderBottomColor: LVColor.border.editTextBottomBoarder, 
        borderWidth:0.5, 
        marginTop:10
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
    },
    btn: {
        alignSelf:'center', 
        marginTop: 20
    }
});

export default TransferScreen;