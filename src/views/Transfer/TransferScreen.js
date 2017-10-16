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
import LVNetworking from '../../logic/LVNetworking';
import TransferLogic from './TransferLogic';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVNotification from '../../logic/LVNotification';
import LVLoadingToast from '../Common/LVLoadingToast';

const MIN_BALANCE_ALLOW_TO_TRANSFER = 0.01;
const GAP_MIN_VALUE = 0.02;
const GAP_MAX_VALUE = 0.08;

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

    isAddressOnFocus = false;

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        console.log(JSON.stringify(wallet));
        this.state = {
            wallet: wallet,
            curETH: wallet != null ? wallet.eth: 0,
            addressIn: '0x9224A9f81Ac30F0E3B568553bf9a7372EE49548C',
            amount: 0,
            balance: wallet != null ? wallet.lvt: 0,
            minerGap: GAP_MIN_VALUE,
            remarks: '',
            showModal: false,
            openSelectWallet: false,
            showQrScanModal: false,
            alertMessage: '',
        }
    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.balanceChanged, this.handleWalletChange);
        this.refreshWalletDatas();
    }

    handleWalletChange = async () => {
        await this.refreshWalletDatas();
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }


    onAmountChanged(newAmountText:string) {
        if (!TransferUtils.isBlank(newAmountText) && !TransferUtils.isValidAmount(newAmountText)) {
            this.setState({alertMessage:LVStrings.transfer_amount_format_hint });
            this.refs.alert.show();
            return;
        } else {
            this.setState({amount: parseFloat(newAmountText)})
        }
    }

    refreshWalletDatas = async () => {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                const lvt = await LVNetworking.fetchBalance(wallet.address, 'lvt');
                const eth = await LVNetworking.fetchBalance(wallet.address, 'eth');

                wallet.lvt = lvt ? parseFloat(lvt) : 0;
                wallet.eth = eth ? parseFloat(eth) : 0;
                this.setState({
                    wallet: wallet,
                    curETH: wallet.eth,
                    balance: wallet.lvt,
                });

                LVWalletManager.saveToDisk();
            } catch (error) {
                console.log('error in refresh wallet datas : ' + error);
            }
        }
    }

    onTransferPresse() {
        const {addressIn, amount, minerGap, balance} = this.state;

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

        if (balance < MIN_BALANCE_ALLOW_TO_TRANSFER || balance < minerGap + amount) {
            this.setState({alertMessage:LVStrings.transfer_eth_insufficient });
            this.refs.alert.show();
            return;
        }

        this.setState({showModal: true})
    }

    async onTransfer() {
        this.setState({ showModal: false });
        const {wallet, addressIn, amount, minerGap, balance} = this.state;
        let value = minerGap + amount;
        this.refs.loading.show();
        setTimeout(async ()=> {
            let result = await TransferLogic.transaction(wallet.password, addressIn, value, wallet);
            this.refs.loading.dismiss();
            let success = result && result.hasOwnProperty('transactionHash')      
            if (success) {   
                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
            }
            setTimeout(() => {
                this.setState({alertMessage: success ? LVStrings.transfer_success : LVStrings.transfer_fail });
                this.refs.alert.show();
            }, 100);
        },500);
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
                    amount= {this.state.amount}
                    minerTips= {this.state.minerGap}
                    remarks= {this.state.remarks}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {this.onTransfer.bind(this)}
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
                            value={this.state.addressIn}
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
                            minimumValue={GAP_MIN_VALUE}
                            maximumValue={GAP_MAX_VALUE}
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
                        height={200}
                        title={LVStrings.alert_hint} 
                        message={this.state.alertMessage} 
                        buttonTitle={LVStrings.alert_ok}/>
                    <LVSelectWalletModal
                        isOpen={this.state.openSelectWallet}
                        onClosed={()=>{this.setState({openSelectWallet: false})}}
                    />
                    <LVLoadingToast ref={'loading'} title={LVStrings.transfer_processing}/>
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