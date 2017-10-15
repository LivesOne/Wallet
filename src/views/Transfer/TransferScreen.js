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
import { TransferMinerGapSetter } from './TransferMinerGapSetter';
import MXButton from './../../components/MXButton';
import * as MXUtils from '../../utils/MXUtils'
import { converAddressToDisplayableText } from '../../utils/MXStringUtils';
import { TransferDetailModal } from './TransferDetailModal';
import { ImageTextInput } from './ImageTextInput';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import { LVQrScanModal } from '../Common/LVQrScanModal';
import TransferUtils from './TransferUtils';
import LVWalletManager from '../../logic/LVWalletManager';
import LVDialog from '../Common/LVDialog';

class TransferScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        wallet: ?Object,
        curETH: number,
        addressIn: string,
        amount: number,
        minerGap: number,
        balance: number,
        remarks: string,
        showModal: boolean,
        openSelectWallet: boolean,
        showQrScanModal: boolean,
        alertMessage: string,
    }

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        console.log(JSON.stringify(wallet));
        this.state = {
            wallet: wallet,
            curETH: wallet != null ? wallet.eth: 0,
            addressIn: '',
            amount: 0,
            balance: wallet != null ? wallet.lvt: 0,
            minerGap: 0.0,
            remarks: '',
            showModal: false,
            openSelectWallet: false,
            showQrScanModal: false,
            alertMessage: '',
        }
    }

    onAmountChanged(newAmountText:string) {
        if (!TransferUtils.isBlank(newAmountText) && !TransferUtils.isValidAmount(newAmountText)) {
            alert('请输入正确的转账金额');
            return;
        } else {
            this.setState({amount: parseFloat(newAmountText)})
        }
    }

    onTransferPresse() {
        const {addressIn, amount, minerGap} = this.state;

        if (!addressIn) {
            this.setState({alertMessage:LVStrings.transfer_address_required });
            this.refs.alert.show();
            return;
        }

        if (!TransferUtils.isValidAddress(addressIn)) {
            this.setState({alertMessage:LVStrings.transfer_address_invalid });
            this.refs.alert.show();
            return;
        }

        if (!amount) {
            this.setState({alertMessage:LVStrings.transfer_amount_required });
            this.refs.alert.show();
            return;
        }

        this.setState({showModal: true})
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
                    minerTips= {this.state.minerGap + ' ETH'}
                    remarks= {this.state.remarks}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {()=>{alert('transfering...')}}
                />}
                <View  style={ styles.container }>
                    <LVQrScanModal
                        barcodeReceived={(event)=>{this.setState({addressIn: event.data})}}
                        isOpen= {this.state.showQrScanModal}
                        onClosed = {()=>{this.setState({ showQrScanModal: false })}}/>
                    <TransferHeader
                        balance={this.state.balance}
                        onPressSelectWallet={()=>{this.setState({ openSelectWallet: true })}}
                    ></TransferHeader>
                    <View style= { styles.headerBelow }>
                        <ImageTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_payee_address}
                            onAddClicked={() => {alert('add contracts')}}
                            value={converAddressToDisplayableText(this.state.addressIn, 12, 12)}
                            onScanClicked={() => {this.setState({ showQrScanModal: true })}}
                            onTextChanged={(newText) => {this.setState({addressIn: newText})}}/>
                        <MXCrossTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_amount}
                            keyboardType = {'numeric'}
                            onTextChanged={this.onAmountChanged.bind(this)}/>
                        <MXCrossTextInput 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_remarks}
                            onTextChanged={(newText) => {this.setState({remarks: newText})}}/>
                        <TransferMinerGapSetter 
                            minimumValue={0.2}
                            maximumValue={0.8}
                            onGapChanged={(gap)=>{this.setState({minerGap: parseFloat(gap)})}}
                            style = {styles.setter}/>
                        <View style= { styles.curEth }>
                            <Text style = {styles.text}>{LVStrings.transfer_current_eth}</Text>
                            <Text style = {styles.textCurEth}>{this.state.curETH}</Text>
                        </View>   
                        <Text style = {styles.textHint}>{LVStrings.transfer_hint}</Text>
                        <MXButton 
                            rounded = {true} 
                            style ={styles.btn} 
                            onPress = {this.onTransferPresse.bind(this)}
                            title={LVStrings.transfer}>
                            </MXButton>
                    </View>
                    <LVDialog 
                        ref={'alert'} 
                        title={LVStrings.alert_hint} 
                        message={this.state.alertMessage} 
                        buttonTitle={LVStrings.alert_ok}/>
                    <LVSelectWalletModal
                        isOpen={this.state.openSelectWallet}
                        onClosed={this.onTransferPresse.bind(this)}
                    />
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