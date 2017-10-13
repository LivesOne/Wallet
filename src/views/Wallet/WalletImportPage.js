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
import { QrScanner } from '../Common/QrScanner';
import LVWalletManager from '../../logic/LVWalletManager';
import LVLoadingToast from '../Common/LVLoadingToast';
import LVDialog from '../Common/LVDialog';
import WalletUtils from './WalletUtils';
const foundation = require('../../foundation/wallet.js');

 export default class AssetsImportPage extends Component {

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
      alertMessage: ?string
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
        alertMessage: ''
      }
    }

    _onHeaderPressed = (leftPressed: boolean) => {
      this.setState({ leftPressed: leftPressed })
    }

    onModalClosed() {
      this.setState({ showModal: false })
    }

    onBarcodeReceived(event: any) {
      alert("type = " + event.type + " data = " + event.data)
    }

    async onPrivateImportPress() {
      const privateKey = this.state.privateKey;
      const privateKeyPwd = this.state.privateKeyPwd;
      const privateKeyPwdAgain = this.state.privateKeyPwdAgain;

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
        let wallet = await LVWalletManager.importWalletWithPrivatekey('defaultName2', "niceToMeetYou", "0e9facdcd345415752f51d36687ce5490a9ccc5d9b4b94f70ccbc4cce5677eb5");
        LVWalletManager.addWallet(wallet);
        LVWalletManager.saveToDisk();
        this.refs.toast.dismiss();
        this.setState({alertMessage: LVStrings.wallet_import_success });
        this.refs.alert.show();
        setTimeout(()=>{this.props.navigation.goBack();},500);
      } catch(e) {
        this.refs.toast.dismiss();
        this.setState({alertMessage: LVStrings.wallet_import_fail });
        this.refs.alert.show();
      }
    },500);
  }


    async onKeystoreImportPress() {
      const keyStore = this.state.keyStore;
      const keyStorePwd = this.state.keyStorePwd;

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

      if (!WalletUtils.isValidWalletStr(keyStore)) {
        this.setState({alertMessage: LVStrings.wallet_import_keystore_error });
        this.refs.alert.show();
        return;
      }

      this.refs.toast.show();
      setTimeout(async ()=> {
        try {
          let wallet = await LVWalletManager.importWalletWithKeystore('defaultName1', keyStorePwd, JSON.parse(keyStore).keystore);
          LVWalletManager.addWallet(wallet);
          LVWalletManager.saveToDisk();
          this.refs.toast.dismiss();
          this.setState({alertMessage: LVStrings.wallet_import_success });
          this.refs.alert.show();
          setTimeout(()=>{this.props.navigation.goBack();},500);
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
          <QrScanner
              barcodeReceived={this.onBarcodeReceived}
              isOpen= {this.state.showModal}
              onClosed = {this.onModalClosed.bind(this)}/>
          <MXNavigatorHeader
            title = {LVStrings.wallet_import_header}
            onLeftPress = {() => {
              this.props.navigation.goBack();
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