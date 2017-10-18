/*
 * Project: Venus
 * File: src/views/Assets/AssetsImportPage.js
 * @flow
 */

 import React, { Component } from 'react'
 import { Text, View, TouchableOpacity, TextInput } from 'react-native';

import * as LVStyleSheet from '../../styles/LVStyleSheet'
import LVColor from '../../styles/LVColor'
import MXNavigatorHeader from './../../components/MXNavigatorHeader';
import LVStrings from './../../assets/localization';
import MXCrossTextInput from './../../components/MXCrossTextInput';
import MXButton from './../../components/MXButton';
import { MXSwitchTab } from './../../components/MXSwitchTab';
import { LVQrScanModal } from '../Common/LVQrScanModal';
import LVWalletManager from '../../logic/LVWalletManager';
import LVLoadingToast from '../Common/LVLoadingToast';
import LVDialog from '../Common/LVDialog';
import WalletUtils from './WalletUtils';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import PropTypes from 'prop-types';
import console from 'console-browserify';
const foundation = require('../../foundation/wallet.js');

 export default class AssetsImportPage extends Component {
    static propTypes = {
      dismissCallback: PropTypes.func
    };

    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
      leftPressed: boolean,
      showModal: boolean,
      privateKey: string,
      privateKeyPwd: string,
      privateKeyPwdAgain: string,
      keyStore: string,
      keyStorePwd: string,
      alertMessage: ?string,
      fromPage: string,
    }

    constructor() {
      super();
      this.state = {
        leftPressed: true,
        showModal: false,
        privateKey: '',
        keyStore: '',
        privateKeyPwd: '',
        privateKeyPwdAgain: '',
        keyStorePwd: '',
        alertMessage: '',
        fromPage: WalletUtils.OPEN_IMPORT_FROM_LAUNCH,
      }
      this.exitWhenSuccess = this.exitWhenSuccess.bind(this);
    }

    componentWillMount = () => {
      LVNotificationCenter.addObserver(this, LVNotification.foundationError, this.onImportError.bind(this));
      let fromPage = WalletUtils.OPEN_IMPORT_FROM_LAUNCH;
      if (this.props.screenProps && this.props.screenProps.from) {
        fromPage = this.props.screenProps.from;
      } 
      console.log('from = ' + fromPage);
      this.setState({fromPage: fromPage});
    }

    componentWillUnmount() {
      LVNotificationCenter.removeObserver(this);
    }

    onImportError(errorObj: Object) {
      console.log(JSON.stringify(errorObj));
      this.refs.toast.dismiss();
      setTimeout(() => {
        let error = WalletUtils.getInnerError(errorObj.error, LVStrings.wallet_import_fail);
        this.setState({alertMessage: error });
        this.refs.alert.show();
      }, 500);
    }

    _onHeaderPressed = (leftPressed: boolean) => {
      this.setState({ leftPressed: leftPressed })
    }

    onModalClosed() {
      this.setState({ showModal: false })
    }

    onBarcodeReceived(event: any) {
      if (this.state.leftPressed) {
          this.setState({keyStore : event.data})
      } else {
          this.setState({privateKey: event.data});
      }
    }

    exitWhenSuccess = () => {
      const fromPage = this.state.fromPage;
      if (fromPage === WalletUtils.OPEN_IMPORT_FROM_LAUNCH) {
        LVNotificationCenter.postNotification(LVNotification.walletImported)
      } 

      if (this.props.screenProps.dismiss) {
        this.props.screenProps.dismiss();
      }
    }

    async onPrivateImportPress() {
      const { privateKey, privateKeyPwd,privateKeyPwdAgain}  = this.state;

      if(!privateKey) {
        this.setState({alertMessage:LVStrings.wallet_import_private_key_required });
        this.refs.alert.show();
        return;
    }

    if(!privateKeyPwd) {
        this.setState({alertMessage:LVStrings.wallet_create_password_required });
        this.refs.alert.show();
        return;
    }

    if(!WalletUtils.isPasswordValid(privateKeyPwd) || !WalletUtils.isPasswordValid(privateKeyPwdAgain)) {
        this.setState({alertMessage:LVStrings.wallet_import_private_password_hint });
        this.refs.alert.show();
        return;
    }    

    if(!privateKeyPwdAgain) {
        this.setState({alertMessage:LVStrings.wallet_create_confimpassword_required });
        this.refs.alert.show();
        return;
    }

    if(privateKeyPwd !== privateKeyPwdAgain) {
        this.setState({alertMessage:LVStrings.wallet_create_password_mismatch });
        this.refs.alert.show();
        return;
    }

    if (!WalletUtils.isPrivateKeyValid(privateKey)) {
      this.setState({alertMessage: LVStrings.wallet_import_private_key_error });
      this.refs.alert.show();
      return;
    }

    this.refs.toast.show();
    setTimeout(async ()=> {
      try {
        let defaultName = await WalletUtils.getDefaultName();
        let wallet = await LVWalletManager.importWalletWithPrivatekey(defaultName, privateKeyPwd, privateKey);
        this.refs.toast.dismiss();
        LVWalletManager.addWallet(wallet);
        LVWalletManager.saveToDisk();
        this.setState({alertMessage: LVStrings.wallet_import_success });
        this.refs.alert.show();
        setTimeout(()=>{
          this.exitWhenSuccess();
        },500);
      } catch(e) {
        this.refs.toast.dismiss();
        this.setState({alertMessage: LVStrings.wallet_import_fail });
        this.refs.alert.show();
      }
    },100);
  }


    async onKeystoreImportPress() {
      const { keyStore, keyStorePwd } = this.state;
      if (!keyStore || !keyStorePwd) {
        this.setState({alertMessage: LVStrings.wallet_import_keystore_or_pwd_empty });
        this.refs.alert.show();
        return;
      }

      if(!/(\d|\w){6,12}/i.test(this.state.keyStorePwd)) {
        this.setState({alertMessage: LVStrings.wallet_import_private_password_hint });
        this.refs.alert.show();
        return;
      }

      if (!WalletUtils.isValidKeyStoreStr(keyStore)) {
        this.setState({alertMessage: LVStrings.wallet_import_keystore_error });
        this.refs.alert.show();
        return;
      }

      this.refs.toast.show();
      setTimeout(async ()=> {
        try {
          let defaultName = await WalletUtils.getDefaultName();
          WalletUtils.log(JSON.stringify(JSON.parse(keyStore)));
          let wallet = await LVWalletManager.importWalletWithKeystore(defaultName, keyStorePwd, JSON.parse(keyStore));
          if (wallet) {
            LVWalletManager.addWallet(wallet);
            LVWalletManager.saveToDisk();
            this.refs.toast.dismiss();
            this.setState({alertMessage: LVStrings.wallet_import_success });
            this.refs.alert.show();
            setTimeout(()=>{this.exitWhenSuccess()},500);
          }
        } catch(e) {
          this.refs.toast.dismiss();
          this.setState({alertMessage: LVStrings.wallet_import_fail });
          this.refs.alert.show();
        }
      },500);

    }

    render() {
      return (
        <View style = {styles.container}>
          <LVQrScanModal
              barcodeReceived={this.onBarcodeReceived.bind(this)}
              isOpen= {this.state.showModal}
              onClosed = {this.onModalClosed.bind(this)}/>
          <MXNavigatorHeader
            title = {LVStrings.wallet_import_header}
            onLeftPress = {() => {
                if(this.props.screenProps.dismiss) {
                    this.props.screenProps.dismiss();
                } else if(this.props.navigation){
                    this.props.navigation.goBack();
                }
            }}
            right={ require("../../assets/images/qrScan.png") }
            onRightPress = {
              () => { this.setState({showModal: true}) }
            }
            />
            <MXSwitchTab
              leftText={ LVStrings.wallet_import_keyStore }
              rightText={ LVStrings.wallet_import_private_key }
              onTabSwitched={this._onHeaderPressed.bind(this)}
            />
            {this.state.leftPressed && this._renderKeystore()}
            {!this.state.leftPressed && this._renderPrivateKey()}
            <LVLoadingToast ref={'toast'} title={LVStrings.wallet_import_header}/>
            <LVDialog ref={'alert'} title={LVStrings.alert_hint} message={this.state.alertMessage} buttonTitle={LVStrings.alert_ok}/>
        </View>
      )
    }

    _renderKeystore = ()=> {
      return (
        <View style={{ flex: 1}}>
          <TextInput
            textAlignVertical={'top'}
            multiline= {true}
            value={this.state.keyStore}
            placeholder={ LVStrings.wallet_import_keystore_hint }
            underlineColorAndroid = {'transparent'}
            onChangeText={(newText)=>{this.setState({keyStore: newText})}}
            style={ styles.textInput }
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 35}}
            secureTextEntry={true}
            onTextChanged={(newText)=>{ this.setState({keyStorePwd: newText}) }}
            placeholder={LVStrings.wallet_import_keystore_password_hint}
          />
          <MXButton
            rounded
            style={{alignSelf: 'center'}}
            title={LVStrings.wallet_import}
            onPress={ this.onKeystoreImportPress.bind(this) }
          />
        </View>
      );
    }

    _renderPrivateKey = ()=> {
      return (
        <View style={{ flex: 1}}>
          <TextInput
            textAlignVertical={'top'}
            multiline= {true}
            value={this.state.privateKey}
            onChangeText={(newText)=>{this.setState({privateKey: newText})}}
            placeholder={ LVStrings.wallet_import_plain_private_key_hint }
            underlineColorAndroid = {'transparent'}
            style={ styles.textInput }
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 10}}
            secureTextEntry={true}
            onTextChanged={(newText)=>{this.setState({privateKeyPwd: newText})}}
            placeholder={LVStrings.wallet_import_private_password_hint}
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 35}}
            secureTextEntry={true}
            onTextChanged={(newText)=>{this.setState({privateKeyPwdAgain: newText})}}
            placeholder={LVStrings.wallet_import_private_pwd_confirm_hint}
          />
          <MXButton
            rounded
            style={{alignSelf: 'center'}}
            title={LVStrings.wallet_import}
            onPress={ this.onPrivateImportPress.bind(this) }
          />
        </View>
      );
    }



 }

  const styles = LVStyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: LVColor.white
    },
    importByContainer: {
      flexDirection: 'row',
      height: 70,
    },
    importByHeader: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: LVColor.white
    },
    textInput: {
      backgroundColor: "#f8f9fb",
      height: 110,
      marginTop: 20,
      borderRadius: 3,
    },

  });