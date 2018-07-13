/*
 * Project: Venus
 * File: src/views/Assets/AssetsImportPage.js
 * @flow
 */

 import React, { Component } from 'react'
 import {
    Alert,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Keyboard
} from 'react-native';

import type {ViewLayout, ViewLayoutEvent} from 'ViewPropTypes';

import * as LVStyleSheet from '../../styles/LVStyleSheet'
import LVColor from '../../styles/LVColor'
import MXNavigatorHeader from './../../components/MXNavigatorHeader';
import LVStrings from './../../assets/localization';
import MXCrossTextInput from './../../components/MXCrossTextInput';
import MXButton from './../../components/MXButton';
import { MXSwitchTab } from './../../components/MXSwitchTab';
import { LVQrScanModal } from '../Common/LVQrScanModal';
import Permissions from 'react-native-permissions';
import LVWalletManager from '../../logic/LVWalletManager';
import LVLoadingToast from '../Common/LVLoadingToast';
import LVDialog from '../Common/LVDialog';
import WalletUtils from './WalletUtils';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import PropTypes from 'prop-types';
import console from 'console-browserify';
import Toast from 'react-native-root-toast';
import { LVKeyboardDismissView } from '../Common/LVKeyboardDismissView';
import { MXCrossInputHeight } from '../../styles/LVStyleSheet';
import * as MXUtils from "../../utils/MXUtils";
import LVFontSize from '../../styles/LVFontSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const foundation = require('../../foundation/wallet.js');

type Props = {
  navigation: Object,
  dismissCallback: Function,
  screenProps: Object
};

type State = {
  leftPressed: boolean,
  showModal: boolean,
  privateKey: string,
  privateKeyPwd: string,
  privateKeyPwdAgain: string,
  keyStore: string,
  keyStorePwd: string,
  alertMessage: ?string,
  fromPage: string,
  keyboardHeight: number,
  keystoreErrorText: ?string,
  privateKeyErrorText: ?string
};

export default class AssetsImportPage extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

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
        keyboardHeight: 0,
        keystoreErrorText: null,
        privateKeyErrorText: null,
      }
      this.exitWhenSuccess = this.exitWhenSuccess.bind(this);
      this.onValidateKeyStorePassword = this.onValidateKeyStorePassword.bind(this);
      this.onValidatePrivateKeyPassword = this.onValidatePrivateKeyPassword.bind(this);
      this.onValidatePrivateKeyConfirmPassword = this.onValidatePrivateKeyConfirmPassword.bind(this);
    }

    keyboardDidShowListener: Object;
    keyboardDidHideListener: Object;
    onValidateKeyStorePassword: Function;
    onValidatePrivateKeyPassword: Function;
    onValidatePrivateKeyConfirmPassword: Function;

    componentWillMount = () => {
      let fromPage = WalletUtils.OPEN_IMPORT_FROM_LAUNCH;
      if (this.props.screenProps && this.props.screenProps.from) {
        fromPage = this.props.screenProps.from;
      } else if (this.props.navigation.state.params.from) {
        fromPage = this.props.navigation.state.params.from;
      }
      console.log('from = ' + fromPage);
      this.setState({fromPage: fromPage});
      if (Platform.OS === 'android') {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardHide.bind(this));
      }
    }

    componentWillUnmount() {
      LVNotificationCenter.removeObserver(this);
      if (Platform.OS === 'android') {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    }

    onKeyboardHide(event: any) {
      this.setState({keyboardHeight: 0})
    }
    
    onKeyboardShow(event: any) {
      if (!event) {
        this.setState({keyboardHeight: 0})
        return;
      }
  
      const {endCoordinates} = event;
      WalletUtils.log('height = '+ endCoordinates.height);
      this.setState({keyboardHeight: endCoordinates.height});
    }

    _onHeaderPressed = (leftPressed: boolean) => {
      this.setState({ leftPressed: leftPressed })
    }

    onModalClosed() {
      this.setState({ showModal: false })
    }

    onBarcodeReceived(data: string) {
      if (this.state.leftPressed) {
          this.setState({keyStore : data})
      } else {
          this.setState({privateKey: data});
      }
    }

    exitWhenSuccess = (wallet: Object) => {
      const fromPage = this.state.fromPage;
      if (fromPage === WalletUtils.OPEN_IMPORT_FROM_LAUNCH) {
          LVNotificationCenter.postNotification(LVNotification.walletImported)
      } 
      LVNotificationCenter.postNotification(LVNotification.walletChanged);
      LVNotificationCenter.postNotification(LVNotification.balanceChanged, wallet);
      if (this.props.screenProps && this.props.screenProps.dismiss) {
        this.props.screenProps.dismiss('success');
      } else {
        this.props.navigation.goBack();
      }
    }

    onValidatePrivateKeyPassword(): ?string {
      const { privateKeyPwd, privateKeyPwdAgain }  = this.state;

      if(!privateKeyPwd) {
        return LVStrings.wallet_create_password_required;
      }
      if(!WalletUtils.isPasswordValid(privateKeyPwd)) {
        return LVStrings.wallet_import_invalid_password_warning;
      } 
      if(privateKeyPwd !== privateKeyPwdAgain) {
        return LVStrings.wallet_create_password_mismatch;
      }
      this.refs.privateKeyPasswordInput.setErrorText(null);
      this.refs.privateKeyConfirmPasswordInput.setErrorText(null);
      return null;
    }

    onValidatePrivateKeyConfirmPassword(): ?string {
      const { privateKeyPwd, privateKeyPwdAgain }  = this.state;
      if(!privateKeyPwdAgain) {
        return LVStrings.wallet_create_confimpassword_required;
      }
      if(!WalletUtils.isPasswordValid(privateKeyPwdAgain)) {
        return LVStrings.wallet_import_invalid_password_warning;
      } 
      if(privateKeyPwd !== privateKeyPwdAgain) {
        return LVStrings.wallet_create_password_mismatch;
      }
      this.refs.privateKeyPasswordInput.setErrorText(null);
      this.refs.privateKeyConfirmPasswordInput.setErrorText(null);
      return null;
    }

  async onPrivateImportPress() {
    const { privateKey, privateKeyPwd,privateKeyPwdAgain}  = this.state;
    if(!privateKey) {
      this.setState({privateKeyErrorText:LVStrings.wallet_import_private_key_required });
      return;
    }

    if (!WalletUtils.isPrivateKeyValid(privateKey)) {
      this.setState({privateKeyErrorText: LVStrings.wallet_import_private_key_error });
      return;
    }

    this.setState({privateKeyErrorText: null });

    if(!this.refs.privateKeyPasswordInput.validate() 
        || !this.refs.privateKeyConfirmPasswordInput.validate()) {
        return;
    }

    Keyboard.dismiss();
    this.refs.toast.show();
    setTimeout(async ()=> {
      try {
        let defaultName = await WalletUtils.getDefaultName();
        let wallet = await LVWalletManager.importWalletWithPrivatekey(defaultName, privateKeyPwd, privateKey);
        await LVWalletManager.updateWalletBalance(wallet);
        this.refs.toast.dismiss();
        
        const success = LVWalletManager.addWallet(wallet);
        if(!success) {
          LVWalletManager.updateWallet(wallet);
        }

        LVWalletManager.saveToDisk();
        Toast.show(LVStrings.wallet_import_success);
        setTimeout(()=>{
          this.exitWhenSuccess(wallet);
        },500);
      } catch(e) {
        setTimeout(()=>{
          this.refs.toast.dismiss();
          this.setState({alertMessage: WalletUtils.getInnerError(e.message, LVStrings.wallet_import_fail) });
          this.refs.alert.show();
        },500);
      }
    },500);
  }

  onValidateKeyStorePassword(): ?string {
    const { keyStorePwd } = this.state;
    if(!keyStorePwd) {
      return LVStrings.password_verify_required;
    }

    if(!WalletUtils.isPasswordValid(keyStorePwd)) {
      return LVStrings.wallet_import_invalid_password_warning;
    }
    return null;
  }

    async onKeystoreImportPress() {
      const { keyStorePwd, keyStore } = this.state;
      if (!keyStore) {
        this.setState({
          keystoreErrorText: LVStrings.wallet_import_keystore_or_pwd_empty
        });
        return;
      }

      if (!WalletUtils.isValidKeyStoreStr(keyStore)) {
        this.setState({
          keystoreErrorText: LVStrings.wallet_import_keystore_error
        });
        return;
      }

      this.setState({
        keystoreErrorText: null
      });

      if(!this.refs.keystorePasswordInput.validate()){
        return;
      }

      Keyboard.dismiss();
      this.refs.toast.show();


      setTimeout(async ()=> {
        try {
          let isPwdCorrect = false;
          try {
            isPwdCorrect = await LVWalletManager.verifyPassword(keyStorePwd, JSON.parse(keyStore));
          } catch (error) {
          }
    
          if (isPwdCorrect == false) {
            this.refs.toast.dismiss();
            this.refs.keystorePasswordInput.setErrorText(LVStrings.inner_error_password_mismatch);
            return;
          }
          
          let defaultName = await WalletUtils.getDefaultName();
          WalletUtils.log(JSON.stringify(JSON.parse(keyStore)));
          let wallet = await LVWalletManager.importWalletWithKeystore(defaultName, keyStorePwd, JSON.parse(keyStore));
          if (wallet) {
            LVWalletManager.addWallet(wallet);
            LVWalletManager.saveToDisk();
            this.refs.toast.dismiss();
            Toast.show(LVStrings.wallet_import_success);
            setTimeout(()=>{this.exitWhenSuccess(wallet)},500);
          }
        } catch(e) {
          setTimeout(()=>{
            this.refs.toast.dismiss();
            this.setState({alertMessage: WalletUtils.getInnerError(e.message, LVStrings.wallet_import_fail) });
            this.refs.alert.show();
          },500);
        }
      },500);

    }

    async onPressScanButton() {
      if (Platform.OS === 'android') {
          await Keyboard.dismiss();
          setTimeout(() => {
            this.setState({ showModal: true });
          }, 100);
      }
      else if (Platform.OS === 'ios') {
          const response = await Permissions.request('camera');
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          if (response === 'authorized') {
              this.setState({ showModal: true });
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

    render() {
      const {keyboardHeight} = this.state;
      return (
        <KeyboardDismissView style = {[styles.container, 
        {marginTop: Platform.OS === 'android' ? (-keyboardHeight/2) : 0}]}>
          <LVQrScanModal
              barcodeReceived={this.onBarcodeReceived.bind(this)}
              isOpen= {this.state.showModal}
              onClosed = {this.onModalClosed.bind(this)}/>
          <MXNavigatorHeader
            title = {LVStrings.wallet_import_header}
            onLeftPress = {() => {
                if(this.props.screenProps && this.props.screenProps.dismiss) {
                    this.props.screenProps.dismiss('canceled');
                } else if(this.props.navigation){
                    this.props.navigation.goBack();
                }
            }}
            right={ require("../../assets/images/transfer_scan.png") }
            onRightPress = { this.onPressScanButton.bind(this) }
            />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps = {'handled'}>
              <View style={styles.contentContainer}>
                <MXSwitchTab
                  leftText={ LVStrings.wallet_import_keyStore }
                  rightText={ LVStrings.wallet_import_private_key }
                  onTabSwitched={this._onHeaderPressed.bind(this)}
                />
                {this.state.leftPressed && this._renderKeystore()}
                {!this.state.leftPressed && this._renderPrivateKey()}

                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_import_header}/>
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} height={225} message={this.state.alertMessage || ''} buttonTitle={LVStrings.alert_ok}/>
              </View>
            </KeyboardAwareScrollView>
        </KeyboardDismissView>
      )
    }

    _renderKeystore = ()=> {
      return (
        <KeyboardDismissView style={{ flex: 1}}>
          <TextInput
            textAlignVertical={'top'}
            multiline= {true}
			value={this.state.keyStore}
			keyboardType = {'ascii-capable'}
            placeholder={ LVStrings.wallet_import_keystore_hint }
            underlineColorAndroid = {'transparent'}
            onChangeText={(newText)=>{this.setState({keyStore: newText.trim()})}}
            style={ styles.textInput }
          />
          {this.state.keystoreErrorText && (
            <Text style={styles.errorLabelStyle} ref={'keystoreErrorMsg'}>{this.state.keystoreErrorText}</Text>
          )}
          
          <MXCrossTextInput
            ref={'keystorePasswordInput'}
            style={[styles.crossTextInputStyle, {marginTop: 15}]}
            secureTextEntry={true}
            onValidation={()=>this.onValidateKeyStorePassword()}
            titleText={LVStrings.wallet_import_keystore_password_label}
            onTextChanged={(newText)=>{ this.setState({keyStorePwd: newText}) }}
            placeholder={LVStrings.wallet_import_private_password_hint}
          />
          <MXButton
            rounded
            style={styles.importButtonStyle}
            title={LVStrings.wallet_import}
            onPress={ this.onKeystoreImportPress.bind(this) }/>
        </KeyboardDismissView>
      );
    }

    _renderPrivateKey = ()=> {
      return (
        <View style={{ flex : 1}}>
            <TextInput
              textAlignVertical={'top'}
              multiline= {true}
              value={this.state.privateKey}
              onChangeText={(newText)=>{this.setState({privateKey: newText.trim()})}}
              placeholder={ LVStrings.wallet_import_plain_private_key_hint }
              underlineColorAndroid = {'transparent'}
              style={ styles.textInput }
            />
            {this.state.privateKeyErrorText && (
              <Text style={styles.errorLabelStyle} ref={'privateKeyErrorMsg'}>{this.state.privateKeyErrorText}</Text>
            )}

            <MXCrossTextInput
              ref={'privateKeyPasswordInput'}
              style={[styles.crossTextInputStyle, {marginTop: 15}]}
              secureTextEntry={true}
              returnKeyType={'next'}
              withUnderLine={false}
              titleText={LVStrings.wallet_import_private_password_lable}
              onValidation={()=> this.onValidatePrivateKeyPassword()}
              onTextChanged={(newText)=>{this.setState({privateKeyPwd: newText})}}
              placeholder={LVStrings.wallet_import_private_password_hint}
            />

            <MXCrossTextInput
              ref={'privateKeyConfirmPasswordInput'}
              style={styles.crossTextInputStyle}
              secureTextEntry={true}
              onValidation={()=> this.onValidatePrivateKeyConfirmPassword()}
              titleText={LVStrings.wallet_import_private_password_repeat_lable}
              onTextChanged={(newText)=>{this.setState({privateKeyPwdAgain: newText})}}
              placeholder={LVStrings.wallet_import_private_pwd_confirm_hint}
            />
            <MXButton
              rounded
              style={styles.importButtonStyle}
              title={LVStrings.wallet_import}
              onPress={ this.onPrivateImportPress.bind(this) }
            />
        </View>
      );
    }
 }

 const KeyboardDismissView = (Platform.OS === 'ios') ? LVKeyboardDismissView : View;

const styles = LVStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: LVColor.white
    },
    contentContainer: {
      marginLeft: 15,
      marginRight: 15
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
      backgroundColor: "#F9F9FA",
      height: 110,
      marginTop: 20,
      borderRadius: 3,
      padding: 6,
      fontSize: 14,
    },
    textTip : {
      color : "#677384" ,
      fontSize : 12,
    },
    importButtonStyle: {
      width: MXUtils.getDeviceWidth() - 30,
      marginTop: 63
    },
    crossTextInputStyle: {
      height: MXCrossInputHeight
    },
    errorLabelStyle: {
      marginTop: 5,
      fontSize: 12,
      color: LVColor.text.red
    }
  });