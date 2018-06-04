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
    Platform,
    PixelRatio,
    NetInfo,
    StatusBar
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
import Toast from 'react-native-root-toast';
import Transaction from 'ethereumjs-tx';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';

var Big = require('big.js');
import LVBig from '../../logic/LVBig';
import LVWallet from '../../logic/LVWallet';

const addImg = require('../../assets/images/transfer_add_contracts.png');
const scanImg = require('../../assets/images/transfer_scan.png');

const isAndroid = Platform.OS === 'android';

type Props = {
    navigation: Object 
};

type State = {
    wallet: LVWallet,
    password: string,
    transactionParams: ?Object;
    curETH: Big,
    token: string, // 这里指 type (LVTC 或者 ETC)
    addressIn: string,
    amount: Big,
    minGap: number,
    maxGap:number,
    curLVTC: Big,
    showModal: boolean,
    openSelectWallet: boolean,
    showQrScanModal: boolean,
    alertMessage: string,
    inputPwd: string,
    balanceTip:string,
    amountText: string,
};

class TransferScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onSelectedContact: Function;

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        console.log(JSON.stringify(wallet));
        this.state = {
            wallet: wallet || LVWallet.emptyWallet(),
            password: '',
            token: '',
            transactionParams: null,
            curETH: LVBig.getInitBig(),
            curLVTC: LVBig.getInitBig(),
            addressIn: '',
            amount: LVBig.getInitBig(),
            amountText: '',
            minGap: 0,
            maxGap:0,
            showModal: false,
            openSelectWallet: false,
            showQrScanModal: false,
            alertMessage: '',
            inputPwd: '',
            balanceTip:'',
        }
        this.onSelectedContact = this.onSelectedContact.bind(this);
    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.balanceChanged, this.handlerBalanceChange);
        LVNotificationCenter.addObserver(this, LVNotification.transcationRecordsChanged, this.refreshWalletDatas);
        LVNotificationCenter.addObserver(this, LVNotification.networkStatusChanged, this.handleNeworkChange);
        
        // this.fixAndroidPaste();
        const { address, token } = this.props.navigation.state.params;
        if (address != null || address != undefined) {
            // 从联系人进入转账界面
            this.refs.refAddressIn.setText(address);
            this.setState({ addressIn: address, token: token});
        } else {
            this.setState({ token: token});
        }
        this.refreshWalletDatas();
    }

    fixAndroidPaste() {
        // android 上首次进来无法粘贴，直到输入文字后可以，可能是平台的bug
        // https://github.com/react-community/react-navigation/issues/1992
        if (Platform.OS === 'android') {
            this.refs.refAddressIn.setText('android');
            this.refs.refAmount.setText('test');
            setTimeout(async () => {
                this.refs.refAddressIn.onPressClear();
                this.refs.refAmount.onPressClear();
            }, 1);
        }
    }

    async tryFetchParams() {
        const {wallet, amount, addressIn, token} = this.state;
        console.log("token = " + token);
        if (wallet && amount.gt(0) && addressIn && TransferUtils.isValidAddress(addressIn)) {
            try {
                let params = await TransferLogic.fetchTransactionParam(wallet.address, addressIn, amount, token);
                let range = TransferUtils.getMinerGapRange(params);
                TransferUtils.log('tryFetchParams result = ' + JSON.stringify(params)
                + ' minGap = ' +  range.min
                + ' maxGap = ' +  range.max);
                this.minerGap = TransferUtils.convertHex2Eth(params.gasPrice, params.gasLimit),
                this.userHasSetGap = false;
                this.setState({
                    transactionParams : params,
                    minGap: range.min,
                    maxGap: range.max,
                });
            } catch (error) {
                this.setState({transactionParams: null})
                this.minerGap = 0;
                this.userHasSetGap = false;
            }
        } else {
            this.setState({transactionParams: null})
            this.minerGap = 0;
            this.userHasSetGap = false;
        }
    }

    handleWalletChange = async () => {
        this.resetUiWhenSelectWallet();
        await this.refreshWalletDatas();
    }

    handleNeworkChange = async (isConnected: boolean) => {
        if (isConnected && !this.state.transactionParams) {
            this.tryFetchParams();
        }
    }
    
    resetUiWhenSelectWallet() {
        const {wallet} = this.state;
        let oldWallet = wallet;
        const newWallet = LVWalletManager.getSelectedWallet();
        const isSelect = oldWallet && newWallet && oldWallet.address !== newWallet.address;
        if (isSelect) {
            TransferUtils.log('wallet selected, new address = ' + (newWallet ? newWallet.address : '') );
            this.resetUIState();
        }
    }

    handlerBalanceChange = async () => {
        TransferUtils.log('balance change');
        await this.refreshWalletDatas(false)
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
        
        await this.setState({
            amountText: newAmountText})
        if (!TransferUtils.isBlank(newAmountText) && TransferUtils.isValidAmountStr(newAmountText)) {
            let amount = new Big(newAmountText);
            this.setState({amount: amount})
            const wallet = this.state.wallet;
            if (wallet && amount.gt(wallet.lvtc) && Platform.OS === 'ios') {
                this.setState({alertMessage:LVStrings.transfer_amount_insufficient });
                this.refs.refAmount.clearFocus();
                this.refs.alert.show();
                return;
            }
            if (TransferUtils.isAmountOverLimit(newAmountText)) {
                this.setState({alertMessage:LVStrings.over_limit_hint,
                transactionParams: null });
                this.refs.refAmount.clearFocus();
                this.refs.alert.show();
                return;
            }
            setTimeout(() => {
                this.tryFetchParams();
            }, 100);
        } else {
            this.minerGap = 0;
            this.userHasSetGap = false;
            this.setState({transactionParams: null})
        }
    }

    refreshWalletDatas = async (needUpdateBalance: boolean = true) => {
        if (needUpdateBalance) {
            await LVWalletManager.updateWalletBalance();
        }
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            this.setState({
                wallet: wallet,
                curETH: wallet.eth,
                curLVTC: wallet.lvtc,
            });
        }
    }

    async onTransferPresse() {
        const { wallet, addressIn, amount, curLVTC, curETH, amountText, token} = this.state;

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

        if (TransferUtils.isSameAddress(addressIn, wallet.address)) {
            this.setState({alertMessage:LVStrings.transfer_to_self_not_allowed});
            this.refs.alert.show();
            return;
        }

        if (!amountText) {
            this.setState({alertMessage:LVStrings.transfer_amount_required });
            this.refs.alert.show();
            return;
        }

        if (!TransferUtils.isValidAmount(amount)) {
            this.setState({alertMessage:LVStrings.transfer_amount_format_hint });
            this.refs.alert.show();
            return;
        }

        if (TransferUtils.isAmountOverLimit(amountText)) {
            this.setState({alertMessage:LVStrings.over_limit_hint });
            this.refs.alert.show();
            return;
        }

        let isInsufficient = "LVTC" === token.toUpperCase() ? (curLVTC.lt(amount)) : (curETH.lt(amount));
        if (wallet && curETH.lt(this.minerGap)) {
            this.setState({balanceTip:LVStrings.transfer_eth_insufficient});
            this.refs.insufficientDialog.show();
            return;
        } else if (isInsufficient) {
            this.setState({balanceTip: "LVTC" === token.toUpperCase() ? 
            LVStrings.transfer_lvt_insufficient : LVStrings.transfer_eth_insufficient});
            this.refs.insufficientDialog.show();
            return;
        }

        if (this.minerGap === 0) {
            this.setState({alertMessage:LVStrings.transfer_miner_gap_not_access });
            this.refs.alert.show();
            return;
        }

        let isConnected = await NetInfo.isConnected.fetch();
        
        if (!isConnected) {
            this.setState({alertMessage:LVStrings.network_error_network_lost});
            this.refs.alert.show();
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

    resetUIState() {
        this.refs.refAddressIn.onPressClear();
        this.refs.refAmount.onPressClear();
        this.minerGap = 0;
        this.userHasSetGap = false;
        this.setState({
            transactionParams: null
        })
    }

    async onTransfer() {
        const {wallet, password, addressIn, amount, balance, transactionParams, token} = this.state;
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
                transactionParams.gasLimit, gasPrice, transactionParams.token, transactionParams.chainID, wallet, token);
            let success = rst && rst.result;
            if (success) {  
                LVNotificationCenter.postNotification(LVNotification.transcationCreated, {
                    transactionHash: rst.transactionHash,
                    from: wallet.address,
                    to: addressIn,
                    amount: amount,
                    token:token,
                    fee: this.minerGap,
                    timestamp: Moment().format('X'),
                });
                await this.resetUIState();
            }
            await this.refs.loading.dismiss();
            setTimeout(() => {
                this.setState({alertMessage: success ? LVStrings.transfer_success : LVStrings.transfer_fail });
                Toast.show(success ? LVStrings.transfer_success : LVStrings.transfer_fail, { duration: Toast.durations.LONG });
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
        //alert(PixelRatio.get());
        //TransferUtils.log('minerGap = ' + this.minerGap + " userHasSet = " + this.userHasSetGap.toString());
        const {transactionParams} = this.state;
        return (
            <View style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between'}}>
                <StatusBar barStyle="dark-content"/>
                {this.state.showModal && <TransferDetailModal
                    isOpen= {this.state.showModal}
                    address= {this.state.addressIn}
                    type={this.state.token}
                    amount= {parseFloat(this.state.amount.toFixed())}
                    minerGap= {this.minerGap}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {()=> {
                        this.setState({ showModal: false });
                        this.onTransfer() }}
                />}
                <TouchableOpacity  style={ styles.container } activeOpacity={1} onPress={Keyboard.dismiss} >
                    <LVQrScanModal
                        barcodeReceived={(data)=>{
                            this.setState({addressIn: data});
                            this.refs.refAddressIn.setText(data);
                            }}
                        isOpen= {this.state.showQrScanModal}
                        onClosed = {()=>{this.setState({ showQrScanModal: false })}}/>

                    <MXNavigatorHeader
                        style={{ backgroundColor: LVColor.white }}
                        title={LVStrings.transaction_details}
                        titleStyle={{color: LVColor.text.grey2, fontSize: LVSize.large}}
                        onLeftPress={() => {
                            this.props.navigation.goBack();
                        }}
                        />
                    <View style= { styles.headerBelow }>
                        <MXCrossTextInput 
                            ref={'refAddressIn'}
                            style={styles.textInput} 
                            titleText={LVStrings.transfer_payee_address}
                            placeholder={LVStrings.transfer_payee_address}
                            defaultValue={this.state.addressIn}
                            boarderLineHeight={1}
                            withUnderLine={false}
                            rightComponent={
                                <View style={{flexDirection:'row', justifyContent: 'space-between', width: 65}}>
                                    <MXTouchableImage source={addImg} onPress={() => {this.props.navigation.navigate('ContactList',{readonly:true, callback:this.onSelectedContact})}}/>
                                    <MXTouchableImage source={scanImg} onPress={async() => {
                                        if (Platform.OS === 'android') {
                                            await Keyboard.dismiss();
                                        }
                                        this.setState({ showQrScanModal: true 
                                        })}}/>
                                </View>
                            }
                            onTextChanged= {this.onAddressChanged.bind(this)}/>
                            <MXCrossTextInput 
                                ref={'refAmount'}
                                style= {[styles.textInput, {marginTop: 10}]} 
                                titleText={LVStrings.transfer_amount}
                                placeholder={LVStrings.transfer_amount}
                                keyboardType = {'numeric'}
                                withUnderLine={false}
                                inputContainerStyle={{marginTop:isAndroid ? 0 : 15}}
                                boarderLineHeight={Platform.OS === 'android' ? 1 : 0}
                                onTextChanged={this.onAmountChanged.bind(this)}/>
                            
                            <View style={styles.curEth} />
                            <TransferMinerGapSetter 
                                ref={'gapSetter'}
                                enable={this.state.transactionParams !== null}
                                minimumValue={this.state.minGap}
                                maximumValue={this.state.maxGap}
                                defaultValue={transactionParams !== null?
                                TransferUtils.convertHex2Eth(transactionParams.gasPrice, transactionParams.gasLimit) : 0}
                                onGapChanged={this.onGapChanged.bind(this)}
                                style = {styles.setter}/>
                        <View style= { styles.curEth }>
                            <Text style = {styles.text}>{LVStrings.transfer_current_eth}</Text>
                            <Text style = {styles.textCurEth}>{StringUtils.convertAmountToCurrencyString(this.state.curETH, ',', 8)}</Text>
                        </View>   
                        <Text style = {styles.textHint}>{LVStrings.transfer_hint}</Text>
                        <View style = {styles.btnContainer}>
                            <MXButton 
                                rounded = {true} 
                                style ={styles.btn} 
                                onPress = {this.onTransferPresse.bind(this)}
                                title={LVStrings.common_next}>
                            </MXButton>
                        </View>
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
                        dismissAfterConfirm = {true}
                        onConfirm={()=>{this.props.navigation.navigate("ReceiveTip")}} >
                        <Text>{this.state.balanceTip}</Text>
                    </LVConfirmDialog>

                </TouchableOpacity>
            </View>
        )
    }
}

const pixelRatio = PixelRatio.get();
const styles = StyleSheet.create({
    container: {
        height: MXUtils.getDeviceHeight(),
        backgroundColor: 'white',
    },
    textInput: {
        width: '100%',
    },
    header: {
        flex: 2,
    },
    headerBelow: {
        flex: 7,
        marginTop: 17,
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
        borderWidth: StyleSheet.hairlineWidth, 
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
    btnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20* pixelRatio,
    },
    btn: {
        alignSelf: 'center',
        width: '100%'
    }
});

export default TransferScreen;