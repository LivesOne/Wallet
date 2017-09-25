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

 export default class AssetsImportPage extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
      leftPressed: boolean
    }

    constructor() {
      super();
      this.state = {
        leftPressed: true
      }
    }

    _onHeaderPressed = (leftPressed: boolean) => {
      this.setState({ leftPressed: leftPressed })
    }

    render() {
      return (
        <View style = {styles.container}>
          <MXNavigatorHeader
            title = {LVStrings.assets_import_header}
            onLeftPress = {() => {
              this.props.navigation.goBack();
            }}
            right={ require("../../assets/images/qrScan.png") }
            onRightPress = {
              () => { alert('click Qr')}
            }
            />
            <MXSwitchTab
              leftText={ LVStrings.assets_import_keyStore }
              rightText={ LVStrings.assets_import_private_key }
              onTabSwitched={this._onHeaderPressed.bind(this)}
            />
            {this.state.leftPressed && this._renderKeystore()}
            {!this.state.leftPressed && this._renderPrivateKey()}
        </View>
      )
    }

    _renderKeystore = ()=> {
      return (
        <View style={{ flex: 1}}>
          <TextInput
            textAlignVertical={'top'}
            multiline= {true}
            placeholder={ LVStrings.assets_import_keystore_hint }
            underlineColorAndroid = {'transparent'}
            style={ styles.textInput }
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 35}}
            placeholder={LVStrings.assets_import_keystore_password_hint}
          />
          <MXButton
            rounded
            style={{alignSelf: 'center'}}
            title={LVStrings.assets_import}
            onTextChanged={ ()=> {alert("hello")} }
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
            placeholder={ LVStrings.assets_import_plain_private_key_hint }
            underlineColorAndroid = {'transparent'}
            style={ styles.textInput }
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 10}}
            placeholder={LVStrings.assets_import_private_password_hint}
          />
          <MXCrossTextInput
            style={{marginTop: 15, marginBottom: 35}}
            placeholder={LVStrings.assets_import_private_pwd_confirm_hint}
          />
          <MXButton
            rounded
            style={{alignSelf: 'center'}}
            title={LVStrings.assets_import}
            onTextChanged={ ()=> {alert("hello")} }
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