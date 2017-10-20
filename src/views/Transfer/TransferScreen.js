/*
 * Project: Venus
 * File: src/views/Transfer/TransferScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { TransferHeader } from './TransferHeader';
import MXCrossTextInput from './../../components/MXCrossTextInput';
import MXTouchableImage from '../../components/MXTouchableImage';

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import { TransferMinerGapSetter } from './TransferMinerGapSetter';
import MXButton from './../../components/MXButton';
import * as MXUtils from '../../utils/MXUtils'
import { StringUtils } from '../../utils';
import { converAddressToDisplayableText } from '../../utils/MXStringUtils';
import { TransferDetailModal } from './TransferDetailModal';
import { ImageTextInput } from './ImageTextInput';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import { LVQrScanModal } from '../Common/LVQrScanModal';
import TransferUtils from './TransferUtils';
import LVWalletManager from '../../logic/LVWalletManager';
import LVDialog, { LVConfirmDialog } from '../Common/LVDialog';
import LVNetworking from '../../logic/LVNetworking';
import TransferLogic from './TransferLogic';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVNotification from '../../logic/LVNotification';
import LVLoadingToast from '../Common/LVLoadingToast';
import Moment from 'moment';

const addImg = require('../../assets/images/transfer_add_contracts.png');
const scanImg = require('../../assets/images/transfer_scan.png');

const MIN_BALANCE_ALLOW_TO_TRANSFER = 0.01;

class TransferScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        wallet: ?Object,
        transactionParams: ?Object;
        curETH: number,
        addressIn: string,
        amount: number,
        minerGap: number,
        minGap: number,
        maxGap:number,
        balance: number,
        remarks: string,
        showModal: boolean,
        openSelectWallet: boolean,
        showQrScanModal: boolean,
        alertMessage: string,
        inputPwd: string,
        userHasSetGap: boolean, 
    }

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        console.log(JSON.stringify(wallet));
        this.state = {
            wallet: wallet,
            transactionParams: null,
            curETH: wallet != null ? wallet.eth: 0,
            addressIn: '0xe094f69b5b9687b532867a0f29cd17c7d1acd2d65eae2d010755f896617cdbbd',
            amount: 0,
            balance: wallet != null ? wallet.lvt: 0,
            minerGap: 0,
            minGap: 0,
            maxGap:0,
            remarks: '',
            showModal: false,
            openSelectWallet: false,
            showQrScanModal: false,
            alertMessage: '',
            inputPwd: '',
            userHasSetGap: false,
        }
    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.balanceChanged, this.handleWalletChange);
        this.refreshWalletDatas();
    }

    async tryFetchParams() {
        const {wallet, amount, addressIn} = this.state;
        if (wallet && amount && addressIn && TransferUtils.isValidAddress(addressIn)) {
            let params = await LVNetworking.fetchTransactionParam(wallet.address, addressIn, amount * Math.pow(10, 18));
            TransferUtils.log('tryFetchParams request = ' + JSON.stringify({from: wallet.address, to: addressIn, value: amount * Math.pow(10, 18)}));
            let range = TransferUtils.getMinerGapRange(params);
            TransferUtils.log('tryFetchParams result = ' + JSON.stringify(params)
            + ' minGap = ' +  range.min
            + ' maxGap = ' +  range.max);
            this.setState({
                transactionParams : params,
                minerGap: TransferUtils.convertHex2Eth(params.gasPrice, params.gasLimit),
                minGap: range.min,
                maxGap: range.max,
            });
        } else {
            this.setState({transactionParams: null})
        }
    }

    handleWalletChange = async () => {
        await this.refreshWalletDatas();
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }

   async  onAddressChanged(address: string) {
        await this.setState({addressIn: address});
        this.tryFetchParams();
    }

    async onAmountChanged(newAmountText:string) {
        if (!TransferUtils.isBlank(newAmountText) && !TransferUtils.isValidAmount(newAmountText)) {
            this.setState({
                alertMessage:LVStrings.transfer_amount_format_hint,
             });
            this.refs.alert.show();
            return;
        } else {
            await this.setState({amount: parseInt(newAmountText)})
            this.tryFetchParams();
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
        const { addressIn, amount, minerGap, balance} = this.state;

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
            // this.setState({alertMessage:LVStrings.transfer_eth_insufficient });
            // this.refs.alert.show();
            this.props.navigation.navigate("ReceiveTip")
            
            return;
        }
        this.refs.inputPwdDialog.show();
    }

    onPwdConfirmed() {
        const {wallet, inputPwd} = this.state;
        if (wallet && wallet.password !== inputPwd) {
            this.setState({alertMessage:LVStrings.wallet_password_incorrect });
            this.refs.alert.show();
            return;
        }
        this.setState({showModal: true})
    }

    onGapChanged(newGap: number) {
        if (newGap !== this.state.minerGap) {
            this.setState({
                minerGap: newGap,
                userHasSetGap: true,
            })
        }
    }

    resetStateAfterSuccesss() {
        this.refs.refAddressIn.onPressClear();
        this.refs.refAmount.onPressClear();
        this.refs.refRemarks.onPressClear();
        this.setState({
            transactionParams: null
        })
    }

    async onTransfer() {
        this.setState({ showModal: false });
        const {wallet, addressIn, amount, minerGap, balance, transactionParams, userHasSetGap} = this.state;
        if (!transactionParams) {
            TransferUtils.log('transaction params is null');
            this.setState({alertMessage:LVStrings.transfer_fail });
            this.refs.alert.show();
            return;
        }
        this.refs.loading.show();
        setTimeout(async ()=> {
            let gasPrice = userHasSetGap ? TransferUtils.getSetGasPriceHexStr(minerGap, transactionParams.gasLimit) : transactionParams.gasPrice;
            let rst = await TransferLogic.transaction(addressIn, amount, transactionParams.nonce,
                transactionParams.gasLimit, gasPrice, transactionParams.token, transactionParams.chainID, wallet);
            this.refs.loading.dismiss();
            let success = rst && rst.result;
            if (success) {  
                await this.refreshWalletDatas(); 
                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
                LVNotificationCenter.postNotification(LVNotification.transcationCreated, {
                    transactionHash: rst.transactionHash,
                    from: wallet.address,
                    to: addressIn,
                    value: 0,
                    timestamp: Moment().format('X'),
                });
            }
            setTimeout(() => {
                this.setState({alertMessage: success ? LVStrings.transfer_success : LVStrings.transfer_fail });
                this.refs.alert.show();
                this.resetStateAfterSuccesss();
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
                    minerGap= {this.state.minerGap}
                    remarks= {this.state.remarks}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {this.onTransfer.bind(this)}
                />}
                <TouchableOpacity  style={ styles.container } activeOpacity={1} onPress={Keyboard.dismiss} >
                    <LVQrScanModal
                        barcodeReceived={(event)=>{this.setState({addressIn: event.data})}}
                        isOpen= {this.state.showQrScanModal}
                        onClosed = {()=>{this.setState({ showQrScanModal: false })}}/>
                    <TransferHeader
                        eth={this.state.curETH}
                        balance={this.state.balance}
                        onPressSelectWallet={()=>{this.setState({ openSelectWallet: true })}}
                    ></TransferHeader>
                    <View style= { styles.headerBelow }>
                        
                        <MXCrossTextInput 
                            ref={'refAddressIn'}
                            style={styles.textInput} 
                            placeholder={LVStrings.transfer_payee_address}
                            defaultValue={this.state.addressIn}
                            rightComponent={
                                <View style={{flexDirection:'row', justifyContent: 'space-between', width: 55}}>
                                    <MXTouchableImage source={addImg} onPress={() => {this.props.navigation.navigate('ContactList')}}/>
                                    <MXTouchableImage source={scanImg} onPress={() => {this.setState({ showQrScanModal: true })}}/>
                                </View>
                            }
                            onTextChanged= {this.onAddressChanged.bind(this)}/>
                        <MXCrossTextInput 
                            ref={'refAmount'}
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_amount}
                            keyboardType = {'numeric'}
                            onTextChanged={this.onAmountChanged.bind(this)}/>
                        <MXCrossTextInput
                            ref={'refRemarks'} 
                            style= {styles.textInput} 
                            placeholder={LVStrings.transfer_remarks}
                            onTextChanged={(newText) => {this.setState({remarks: newText})}}/>
                        <TransferMinerGapSetter 
                            enable={this.state.transactionParams !== null}
                            minimumValue={this.state.minGap}
                            maximumValue={this.state.maxGap}
                            onGapChanged={this.onGapChanged.bind(this)}
                            style = {styles.setter}/>
                        <View style= { styles.curEth }>
                            <Text style = {styles.text}>{LVStrings.transfer_current_eth}</Text>
                            <Text style = {styles.textCurEth}>{StringUtils.convertAmountToCurrencyString(this.state.curETH, ',', 8)}</Text>
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
                    <LVConfirmDialog
                        ref={'inputPwdDialog'}
                        title={LVStrings.wallet_create_password_required}
                        onConfirm={this.onPwdConfirmed.bind(this)}>
                        <MXCrossTextInput
                            secureTextEntry={true}
                            withUnderLine={false}
                            onTextChanged={(newText)=>{this.setState({inputPwd: newText})}}
                            placeholder={LVStrings.wallet_create_password_required}/>
                    </LVConfirmDialog>
                </TouchableOpacity>
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