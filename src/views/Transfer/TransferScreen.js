/*
 * Project: Venus
 * File: src/views/Transfer/TransferScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import {
    Alert,
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
    StatusBar,
    BackHandler
} from 'react-native';
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
import Permissions from 'react-native-permissions';
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
import TransferMinerTips from './TransferMinerTips';

var Big = require('big.js');
import LVBig from '../../logic/LVBig';
import LVWallet from '../../logic/LVWallet';
import { LVBalanceShowView } from '../Common/LVBalanceShowView';
import * as _ from 'lodash'

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
        if (this.props.navigation.state.key === null) {
            this.props.navigation.state.key = 'keyTransfer';
        }
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

    async onPressScanButton() {
        if (Platform.OS === 'android') {
            await Keyboard.dismiss();
            setTimeout(() => {
                this.setState({ showQrScanModal: true });
            }, 100);
        }
        else if (Platform.OS === 'ios') {
            const response = await Permissions.request('camera');
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response === 'authorized') {
                this.setState({ showQrScanModal: true });
            } else {
                Alert.alert(
                    LVStrings.can_not_access_camera,
                    LVStrings.please_set_camera_author,
                    [
                        {
                            text: LVStrings.common_cancel,
                            onPress: () => console.log('Permission denied'),
                            style: 'cancel',
                        },
                        { text: LVStrings.common_open_ettings, onPress: Permissions.openSettings },
                    ],
                )
            }
        }
    }

    async tryFetchParams() {
        const {wallet, amount, addressIn, token} = this.state;
        TransferUtils.log("token = " + token + " amount = " + amount);
        if (wallet && amount.gt(0) && addressIn && TransferUtils.isValidAddress(addressIn)) {
            try {
                let params = await TransferLogic.fetchTransactionParam(wallet.address, addressIn, amount, token);
                let range = TransferUtils.getMinerGapRange(params);
                TransferUtils.log('tryFetchParams result = ' + JSON.stringify(params)
                + ' minGap = ' +  range.min
                + ' maxGap = ' +  range.max);
                this.setState({
                    transactionParams : params,
                    minGap: range.min,
                    maxGap: range.max,
                });
            } catch (error) {
                this.setState({transactionParams: null})
            }
        } else {
            this.setState({transactionParams: null})
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
        await this.setState({addressIn: address.trim()});
        setTimeout(() => {
            TransferUtils.log('onAddressChanged tryFetchParams');
            this.tryFetchParams();
        }, 100);
    }

    debouncePress = (onTextChanged:Function) =>  {
        return _.debounce(onTextChanged, 500, {leading: false, trailing: true})
    }

    async onAmountChanged(newAmountText:string) {
        
        await this.setState({
                    amountText: newAmountText})
        
        if (!TransferUtils.isBlank(newAmountText) && TransferUtils.isValidAmountStr(newAmountText)) {
            let amount = new Big(newAmountText);
            this.setState({amount: amount})
            const wallet = this.state.wallet;

            if (TransferUtils.isAmountOverLimit(newAmountText)) {
                this.setState({alertMessage:LVStrings.over_limit_hint,
                transactionParams: null });
                this.refs.refAmount.clearFocus();
                this.refs.alert.show();
                return;
            }
            this.tryFetchParams();
        } else {
            this.setState({transactionParams: null, amount:LVBig.getInitBig()})
        }
    }

    componentWillMount() {
        StatusBar.setBarStyle('default', true);
    }

    refreshWalletDatas = async (needUpdateBalance: boolean = true) => {
        if (needUpdateBalance) {
            await LVWalletManager.updateSelectedWalletBalance();
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
        
        TransferUtils.log("trueValue = " + this.refs.gapSetter.getValue()
            + " userHasSet = " + this.refs.gapSetter.getUserHasChanged());
        
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
        if (wallet && curETH.lt(this.refs.gapSetter.getValue())) {
            this.setState({balanceTip:LVStrings.transfer_eth_insufficient});
            this.refs.insufficientDialog.show();
            return;
        }else if (token.toUpperCase() === 'ETH' && wallet && curETH.lt(this.refs.gapSetter.getValue() + Number(amountText))){
            this.setState({balanceTip:LVStrings.transfer_eth_insufficient});
            this.refs.insufficientDialog.show();
            return;
        } else if (isInsufficient) {
            this.setState({balanceTip: "LVTC" === token.toUpperCase() ? 
            LVStrings.transfer_lvt_insufficient : LVStrings.transfer_eth_insufficient});
            this.refs.insufficientDialog.show();
            return;
        }

        if (this.refs.gapSetter.getValue() === 0) {
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
        
        if (this.refs.gapSetter.getAdvancedSwitchedValue() && this.refs.gapSetter.getAdvancedFailValue()) {
            return;
        }

        this.refs.inputPwdDialog.show();
    }

    onSelectedContact(address: string) {
        this.refs.refAddressIn.setText(address);
    }
    
    resetUIState() {
        this.refs.refAddressIn.onPressClear();
        this.refs.refAmount.onPressClear();
        this.setState({
            transactionParams: null
        })
    }

    async onTransfer() {
        const {wallet, password, addressIn, amount, transactionParams, token} = this.state;
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
            let gasPrice = TransferUtils.getSetGasPriceHexStr(this.refs.gapSetter.getValue(), transactionParams.gasLimit);
            let gasLimit =  transactionParams.gasLimit;
            if (this.refs.gapSetter.getAdvancedSwitchedValue()) {
                gasPrice = this.refs.gapSetter.getGasPriceValue + '0x'; //转化成16进制
                gasLimit = this.refs.gapSetter.getGasValue + '0x';
            }
            let rst = await TransferLogic.transaction(addressIn, password, amount, transactionParams.nonce,
                gasLimit, gasPrice, transactionParams.token, transactionParams.chainID, wallet, token);
            let success = rst && rst.result;
            if (success) {  
                LVNotificationCenter.postNotification(LVNotification.transcationCreated, {
                    transactionHash: rst.transactionHash,
                    from: wallet.address,
                    to: addressIn,
                    amount: amount,
                    token:token,
                    fee: this.refs.gapSetter.getValue(),
                    timestamp: Moment().format('X'),
                });
                const isFromAsset = this.props.navigation.state.params.from === 'assets';
                console.log('------ from assets = ');
                console.log(isFromAsset);
                if (isFromAsset) {
                    this.props.navigation.goBack(null, {
                        token: token
                    });
                } else {
                    this.props.navigation.navigate("AssetsDetails", {
                        token: token, keyTransfer: this.props.navigation.state.key
                    });
                }
                await this.resetUIState();
            }
            await this.refs.loading.dismiss();
            setTimeout(() => {
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

    onMinerTipsPress = ()=>{
        this.props.navigation.navigate("TransferMinerTips");
    }

    num = 0;

    render() {
        const {transactionParams} = this.state;
        return (
            <View style={{flexDirection: 'column', flex: 1, justifyContent: 'space-between',backgroundColor:LVColor.white}}>
                {this.state.showModal && <TransferDetailModal
                    ref={'detailModal'}
                    isOpen= {this.state.showModal}
                    address= {this.state.addressIn}
                    type={this.state.token}
                    amount= {parseFloat(this.state.amount.toFixed(18))}
                    minerGap= {this.refs.gapSetter.getValue()}
                    onClosed = {()=>{this.setState({ showModal: false })}}
                    onTransferConfirmed = {()=> {
                        this.setState({ showModal: false });
                        this.refs.detailModal.dismiss();
                        this.onTransfer() }}
                />}

                    <MXNavigatorHeader
                        style={{ backgroundColor: LVColor.white }}
                        title={LVStrings.transfer}
                        titleStyle={{color: LVColor.text.grey2, fontSize: LVSize.large}}
                        onLeftPress={() => {
                            this.props.navigation.goBack();
                        }}
                        />
                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                <TouchableOpacity  style={ styles.container } activeOpacity={1} onPress={Keyboard.dismiss} >
                    <LVQrScanModal
                        barcodeReceived={(data)=>{
                                if (!TransferUtils.isValidAddress(data)) {
                                    this.setState({alertMessage:LVStrings.transfer_address_invalid });
                                    setTimeout(()=> {
                                        this.refs.alert.show();
                                    }, 500);
                                    return;
                                } else {
                                    this.setState({addressIn: data});
                                    this.refs.refAddressIn.setText(data);
                                }
                            }}
                        isOpen= {this.state.showQrScanModal}
                        onClosed = {()=>{this.setState({ showQrScanModal: false })}}/>
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
                                    <MXTouchableImage source={scanImg} onPress={this.onPressScanButton.bind(this)}/>
                                </View>
                            }
                            onTextChanged= {this.onAddressChanged.bind(this)}/>
                            <MXCrossTextInput 
                                ref={'refAmount'}
                                style= {[styles.textInput, {marginTop: 8}]} 
                                titleText={LVStrings.transfer_amount}
                                placeholder={LVStrings.transfer_amount}
                                keyboardType = {'numeric'}
                                withUnderLine={false}
                                inputContainerStyle={{marginTop:isAndroid ? 0 : 15}}
                                boarderLineHeight={Platform.OS === 'android' ? 1 : 0}
                                onTextChanged={this.debouncePress(this.onAmountChanged.bind(this))}/>
                            
                            <View style={styles.curEth} />
                            <TransferMinerGapSetter 
                                ref={'gapSetter'}
                                enable={this.state.transactionParams !== null}
                                minimumValue={this.state.minGap}
                                maximumValue={this.state.maxGap}
                                curETH={this.state.curETH.toFixed()}
                                minerTipsCallBack = {this.onMinerTipsPress.bind(this)}
                                defaultValue={transactionParams !== null?
                                TransferUtils.convertHex2Eth(transactionParams.gasPrice, transactionParams.gasLimit) : 0}
                                style = {styles.setter}/>
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
                        <Text style={{color: '#697585',fontSize: 16, padding: 4 , textAlign : 'center'}}>{this.state.balanceTip}</Text>
                    </LVConfirmDialog>

                </TouchableOpacity>
                </ScrollView>
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
        marginTop: 20,
        marginBottom: 15 * pixelRatio,
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