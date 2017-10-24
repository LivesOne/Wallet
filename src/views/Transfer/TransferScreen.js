/*
 * Project: Venus
 * File: src/views/Transfer/TransferScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Platform
} from 'react-native';
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
import { LVPasswordDialog } from '../Common/LVPasswordDialog';
import LVGradientPanel from '../Common/LVGradientPanel';
import Toast from 'react-native-simple-toast';

const addImg = require('../../assets/images/transfer_add_contracts.png');
const scanImg = require('../../assets/images/transfer_scan.png');

const isAndroid = Platform.OS === 'android';

class TransferScreen extends Component {
    static navigationOptions = {
        header: null
    };

    onSelectedContact: Function;

    state: {
        wallet: ?Object,
        password: string,
        transactionParams: ?Object;
        curETH: number,
        addressIn: string,
        amount: number,
        //minerGap: number,
        minGap: number,
        maxGap:number,
        balance: number,
        remarks: string,
        showModal: boolean,
        openSelectWallet: boolean,
        showQrScanModal: boolean,
        alertMessage: string,
        inputPwd: string,
        //userHasSetGap: boolean, 
    }

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        console.log(JSON.stringify(wallet));
        this.state = {
            wallet: wallet,
            password: '',
            transactionParams: null,
            curETH: wallet != null ? wallet.eth: 0,
            addressIn: '',
            amount: 0,
            balance: wallet != null ? wallet.lvt: 0,
            //minerGap: 0,
            minGap: 0,
            maxGap:0,
            remarks: '',
            showModal: false,
            openSelectWallet: false,
            showQrScanModal: false,
            alertMessage: '',
            inputPwd: '',
            //userHasSetGap: false,
        }
        this.onSelectedContact = this.onSelectedContact.bind(this);
    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.transcationRecordsChanged, this.refreshWalletDatas);
        this.refreshWalletDatas();
        this.fixAndroidPaste();
    }

    fixAndroidPaste() {
        // android 上首次进来无法粘贴，直到输入文字后可以，可能是平台的bug
        // https://github.com/react-community/react-navigation/issues/1992
        if (Platform.OS === 'android') {
            this.refs.refAddressIn.setText('android');
            this.refs.refAmount.setText('0');
            this.refs.refRemarks.setText('android');
            setTimeout(async () => {
                this.refs.refAddressIn.onPressClear();
                this.refs.refAmount.onPressClear();
                this.refs.refRemarks.onPressClear();
            }, 1);
        }
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
            this.minerGap = TransferUtils.convertHex2Eth(params.gasPrice, params.gasLimit),
            this.setState({
                transactionParams : params,
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
        setTimeout(() => {
            this.tryFetchParams();
        }, 100);
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
            setTimeout(() => {
                this.tryFetchParams();
            }, 100);
        }
    }

    refreshWalletDatas = async () => {
        await LVWalletManager.updateWalletBalance();
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            this.setState({
                wallet: wallet,
                curETH: wallet.eth,
                balance: wallet.lvt,
            });
        }
    }

    onTransferPresse() {
        const { wallet, addressIn, amount, balance} = this.state;

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

        if (balance < amount || (wallet && wallet.eth < this.minerGap)) {
            this.refs.insufficientDialog.show();
            return;
        }
        this.refs.inputPwdDialog.show();
    }

    onSelectedContact(address: string) {
        this.refs.refAddressIn.setText(address);
    }

    minerGap = 0;
    userHasSetGap = false;
    
    onGapChanged(newGap: number) {
        if (newGap !== this.state.minerGap) {
            this.minerGap = newGap;
            this.userHasSetGap = true;
        }
    }

    resetStateAfterSuccesss() {
        this.refs.refAddressIn.onPressClear();
        this.refs.refAmount.onPressClear();
        this.refs.refRemarks.onPressClear();
        this.minerGap = 0;
        this.userHasSetGap = false;
        this.setState({
            transactionParams: null
        })
    }

    async onTransfer() {
        const {wallet, password, addressIn, amount, balance, transactionParams} = this.state;
        if (!transactionParams) {
            TransferUtils.log('transaction params is null');
            this.setState({alertMessage:LVStrings.transfer_fail });
            this.refs.alert.show();
            return;
        }
        if (isAndroid) {
            await this.refs.loading.show();
        } else {
            setTimeout(()=> {
                this.refs.loading.show();
            }, 500);
        }
        setTimeout(async ()=> {
            let gasPrice = this.userHasSetGap ? TransferUtils.getSetGasPriceHexStr(this.minerGap, transactionParams.gasLimit) : transactionParams.gasPrice;
            let rst = await TransferLogic.transaction(addressIn, password, amount, transactionParams.nonce,
                transactionParams.gasLimit, gasPrice, transactionParams.token, transactionParams.chainID, wallet);
            let success = rst && rst.result;
            if (success) {  
                LVNotificationCenter.postNotification(LVNotification.transcationCreated, {
                    transactionHash: rst.transactionHash,
                    from: wallet.address,
                    to: addressIn,
                    lvt: amount,
                    eth: this.minerGap,
                    timestamp: Moment().format('X'),
                });
            }
            await this.refs.loading.dismiss();
            await this.resetStateAfterSuccesss();
            setTimeout(() => {
                this.setState({alertMessage: success ? LVStrings.transfer_success : LVStrings.transfer_fail });
                Toast.show(success ? LVStrings.transfer_success : LVStrings.transfer_fail, Toast.Long);
            }, 500);
        },500);
    }

    async verifyPassword(inputPwd: string) {
        return await LVWalletManager.verifyPassword(inputPwd, this.state.wallet.keystore);
    }

    async onVerifyResult(success: boolean, password: string) {
        if (success) {
            setTimeout(() => {
                this.setState({password: password, showModal: true});
            }, isAndroid ? 300 : 500);
        } else {
            await this.setState({
                password: '',
                alertMessage: !password ? LVStrings.password_verify_required : LVStrings.inner_error_password_mismatch
            });
            setTimeout(() => {
                this.refs.alert.show();
            }, isAndroid ? 300 : 500);
        }
    }

    num = 0;

    render() {
        TransferUtils.log('render ---> ' + this.num++);
        TransferUtils.log('minnerGap = ' + this.minerGap + " userHasSet = " + this.userHasSetGap.toString());
        const {transactionParams} = this.state;
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
            <ScrollView
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator = {false}
                bounces={false}
                contentContainerStyle={ styles.container }>
                {this.state.showModal && <TransferDetailModal
                    isOpen= {this.state.showModal}
                    address= {this.state.addressIn}
                    amount= {this.state.amount}
                    minerGap= {this.minerGap}
                    remarks= {this.state.remarks}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {()=> {
                        this.setState({ showModal: false });
                        this.onTransfer() }}
                />}
                <TouchableOpacity  style={ styles.container } activeOpacity={1} onPress={Keyboard.dismiss} >
                    <LVQrScanModal
                        barcodeReceived={(event)=>{
                            this.setState({addressIn: event.data});
                            this.refs.refAddressIn.setText(event.data);
                            }}
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
                                    <MXTouchableImage source={addImg} onPress={() => {this.props.navigation.navigate('ContactList',{readonly:true, callback:this.onSelectedContact})}}/>
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
                            ref={'gapSetter'}
                            enable={this.state.transactionParams !== null}
                            minimumValue={this.state.minGap}
                            maximumValue={this.state.maxGap}
                            defaultValue={transactionParams !== null ?
                            TransferUtils.convertHex2Eth(transactionParams.gasPrice, transactionParams.gasLimit) : 0}
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
                    <LVPasswordDialog
                        ref={'inputPwdDialog'}
                        verify={this.verifyPassword.bind(this)}
                        onVerifyResult={this.onVerifyResult.bind(this)} />
                    <LVConfirmDialog
                        ref={'insufficientDialog'}
                        title={LVStrings.alert_hint}  
                        message={LVStrings.transfer_insufficient} 
                        onConfirm={()=>{this.props.navigation.navigate("ReceiveTip")}} />

                </TouchableOpacity>
            </ScrollView>
            </View>
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