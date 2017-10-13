//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor'
import MXCrossTextInput from './../../../components/MXCrossTextInput';
import WalletUtils from '../../Wallet/WalletUtils';

export class ModifyWalletPwd extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
        curPwd: string,
        newPwd: string,
        newConfirmPwd: string,
    }

    constructor() {
        super();
        this.state = {
            curPwd: '',
            newPwd: '',
            newConfirmPwd: ''
        }
    }

    onSavePressed() {
        alert(this.state.newPwd)
    }

    onCurPwdChanged(curPwd: string) {
        this.setState({curPwd: curPwd})
    }

    onNewPwdChanged(newPwd: string) {
        this.setState({newPwd: newPwd})
    }

    onConfirmPwdChanged(newConfirmPwd: string) {
        this.setState({newConfirmPwd: newConfirmPwd})
    }

    onImportRightNow() {
        this.props.navigation.navigate("WalletImportPage", {from: WalletUtils.OPEN_IMPORT_FROM_MODIFY_PASSWORD})
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1}}>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_wallet_modify_password }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right = { LVStrings.profile_wallet_save }
                    rightTextColor = { LVColor.primary }
                    onRightPress={ this.onSavePressed.bind(this) }/>
                <View style= {{ paddingHorizontal:12.5}}>
                    <Text style={styles.text}>  
                    { LVStrings.profile_wallet_cur_password }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.profile_wallet_cur_password }
                        onTextChanged={ this.onCurPwdChanged.bind(this) }
                    />
                    <Text style={styles.text}>
                    { LVStrings.profile_wallet_new_password }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.wallet_import_private_password_hint }
                        onTextChanged={ this.onNewPwdChanged.bind(this) }
                    />
                    <Text style={styles.text}>
                    { LVStrings.profile_wallet_password_confirm }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.wallet_import_private_pwd_confirm_hint }
                        onTextChanged={ this.onConfirmPwdChanged.bind(this) }
                    />
                    <View style={{ marginTop: 25, flexDirection: 'row'}}>
                        <Text style={{color: LVColor.text.editTextContent}}>{ LVStrings.profile_wallet_password_hint }
                            <Text style={{marginLeft: 10, color: '#1f7fff'}}
                                onPress={this.onImportRightNow.bind(this)}>
                                { LVStrings.profile_wallet_import_right_now }
                            </Text>
                        </Text>
                    </View>
                </View>
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    text: {
        marginTop: 15, 
        marginBottom:5, 
        color: LVColor.primary, 
        fontSize: 16
    },
    textInput: {
        width: '100%'
    }
});
export default ModifyWalletPwd