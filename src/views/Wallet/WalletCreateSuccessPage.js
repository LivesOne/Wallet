/*
 * Project: Venus
 * File: src/views/Assets/WalletCreateSuccessPage.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { View, Share, Image, Text, NativeModules, Platform, ActionSheetIOS } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVDialog, { LVConfirmDialog } from '../Common/LVDialog';
const createSuccessImage = require('../../assets/images/create_wallet_success.png');
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVNotification from '../../logic/LVNotification';
import MXCrossTextInput from '../../components/MXCrossTextInput';
import LVLoadingToast from '../Common/LVLoadingToast';
import LVPasswordDialog from '../Common/LVPasswordDialog';
import { backupWallet } from '../../utils/MXUtils';
import LVWalletManager from '../../logic/LVWalletManager';

export default class WalletCreateSuccessPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onVerifyResult: Function;

    constructor() {
        super();

        this.state = {
            alertMessage: ''
        };
    }

    state: {
        alertMessage: string
    };

    onVerifyResult(success: boolean, password: string) {
        if(!success) {
            setTimeout(() => {
                this.setState({
                    alertMessage: !password ? LVStrings.password_verify_required : LVStrings.inner_error_password_mismatch
                });
                this.refs.alert.show();
            }, 500);
            return;
        }
        this.refs.passwordConfirm.dismiss();
        const wallet = this.props.navigation.state.params.wallet;
        setTimeout(async ()=>{
            try {
                await backupWallet(wallet, password);
                this.refs.disclaimer.show();
            } catch (error) {
                if(error === 'cancelled') {
                    return;
                }
                setTimeout(() => {
                    this.setState({
                        alertMessage: LVStrings.wallet_backup_failed
                    });
                    this.refs.alert.show();
                }, 500);
            }
        }, 500);
    }

    onPressWalletBackupButton() {
        this.refs.passwordConfirm.show();
    }

    async verifyPassword(inputPwd: string) {
        const wallet = this.props.navigation.state.params.wallet;
        return await LVWalletManager.verifyPassword(inputPwd, wallet.keystore);
    }

    _shareResult(result) {
        this.refs.disclaimer.show();
    }

    render() {
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title={LVStrings.wallet_create_wallet}
                    onLeftPress={() => {
                        LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
                        if (this.props.screenProps.dismiss) {
                            this.props.screenProps.dismiss();
                        } else {
                            this.props.navigation.goBack();
                        }
                    }}
                />
                <Image source={createSuccessImage} style={styles.image} />
                <Text style={styles.text}>{LVStrings.wallet_create_success}</Text>
                <Text style={styles.detailText}>{LVStrings.wallet_create_success_comment}</Text>
                <MXButton
                    rounded
                    title={LVStrings.profile_wallet_backup}
                    onPress={this.onPressWalletBackupButton.bind(this)}
                    themeStyle={'active'}
                    style={styles.backupButton}
                />
                <LVDialog
                    ref={'disclaimer'}
                    height={230}
                    title={LVStrings.wallet_disclaimer}
                    titleStyle={{ color: 'red' }}
                    message={LVStrings.wallet_disclaimer_content}
                    buttonTitle={LVStrings.common_confirm}
                    onPress={() => this.refs.disclaimer.dismiss()}
                />
                <LVPasswordDialog
                    ref={'passwordConfirm'}
                    verify={this.verifyPassword.bind(this)}
                    onVerifyResult={this.onVerifyResult.bind(this)}
                />
                <LVDialog
                    ref={'alert'}
                    title={LVStrings.alert_hint}
                    message={this.state.alertMessage}
                    buttonTitle={LVStrings.alert_ok}
                />
            </View>
        );
    }
}

const styles = LVStyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    image: {
        marginTop: 50,
        width: 145,
        height: 145
    },
    text: {
        fontSize: 18,
        color: '#667383',
        marginTop: 5
    },
    detailText: {
        fontSize: 12,
        color: '#667383',
        marginTop: 55,
        marginLeft: 34,
        marginRight: 34,
        lineHeight: 20
    },
    backupButton: {
        marginTop: 20
    }
});
