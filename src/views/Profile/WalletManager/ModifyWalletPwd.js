//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor'
import MXCrossTextInput from './../../../components/MXCrossTextInput';
import WalletUtils from '../../Wallet/WalletUtils';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
import LVWalletManager from '../../../logic/LVWalletManager';
import LVLoadingToast from '../../Common/LVLoadingToast';
import LVDialog from '../../Common/LVDialog';
import LVFullScreenModalView from '../../Common/LVFullScreenModalView';
import LVWalletImportNavigator from '../../Wallet/LVWalletImportNavigator';

export class ModifyWalletPwd extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
        wallet: ?Object,
        curPwd: string,
        newPwd: string,
        newConfirmPwd: string,
        alertMessage: string
    }

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            curPwd: '',
            newPwd: '',
            newConfirmPwd: '',
            alertMessage: ''
        }
    }

    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            wallet: params.wallet,
        })
    }

    async onSavePressed() {
        Keyboard.dismiss();

        
        const {wallet, curPwd, newPwd, newConfirmPwd} = this.state;
        if (!wallet) {
            this.setState({alertMessage:LVStrings.wallet_edit_save_failed });
            this.refs.alert.show();
            return;
        }

        if (!curPwd) {
            this.setState({alertMessage:LVStrings.wallet_edit_cur_pwd_required });
            this.refs.alert.show();
            return;
        }

        WalletUtils.log('pwd=' + wallet.password);
        if (curPwd !== wallet.password) {
            this.setState({alertMessage:LVStrings.wallet_edit_cur_pwd_error });
            this.refs.alert.show();
            return;
        }

        if (!newPwd || !newConfirmPwd) {
            this.setState({alertMessage:LVStrings.wallet_edit_new_pwd_required });
            this.refs.alert.show();
            return;
        }

        if (!WalletUtils.isPasswordValid(newPwd) || !WalletUtils.isPasswordValid(newConfirmPwd)) {
            this.setState({alertMessage:LVStrings.wallet_import_private_password_hint });
            this.refs.alert.show();
            return;
        }

        if (newPwd !== newConfirmPwd) {
            this.setState({alertMessage:LVStrings.wallet_create_password_mismatch });
            this.refs.alert.show();
            return;
        }

        if (newConfirmPwd === wallet.password) {
            this.setState({alertMessage:LVStrings.wallet_edit_password_same });
            this.refs.alert.show();
            return;
        }

        this.refs.toast.show();
        wallet.password = newPwd;
        setTimeout(async ()=> {
            try {
                const newWallet = await LVWalletManager.modifyPassword(wallet, curPwd, newPwd);
                await LVWalletManager.updateWallet(newWallet);
                await LVWalletManager.saveToDisk();
                this.refs.toast.dismiss();
                LVNotificationCenter.postNotification(LVNotification.walletChanged);
                this.props.navigation.goBack();
            } catch(e) {
                this.refs.toast.dismiss();
                this.setState({alertMessage:LVStrings.wallet_edit_save_failed });
                this.refs.alert.show();
                return;
            }
        },500);
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
        this.refs.importPage.show();
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
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_editing}/>
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} message={this.state.alertMessage} buttonTitle={LVStrings.alert_ok}/>
                <LVFullScreenModalView ref={'importPage'}>
                    <LVWalletImportNavigator screenProps={{dismiss: ()=> {
                        this.refs.importPage.dismiss()
                    } , from: WalletUtils.OPEN_IMPORT_FROM_MODIFY_PASSWORD
                }}/>
                </LVFullScreenModalView>
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