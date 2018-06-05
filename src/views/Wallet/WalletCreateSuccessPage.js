/*
 * Project: Venus
 * File: src/views/Assets/WalletCreateSuccessPage.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { Dimensions, View, Share, Image, StatusBar, Text, NativeModules, Platform, ActionSheetIOS, BackHandler } from 'react-native';
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

type Props = {
    navigation: Object,
    screenProps: Object
};

type State = {
    alertMessage: string
};

export default class WalletCreateSuccessPage extends Component<Props,State> {
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

    componentDidMount() {
        StatusBar.setBarStyle('default', true);
        LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("hardwareBackPress", this.handleBack.bind(this));
        }
    }

    handleBack = () => {
        LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
    };

    onVerifyResult(success: boolean, password: string) {
        this.refs.passwordConfirm.dismiss();
        if(!success) {
            setTimeout(() => {
                this.setState({
                    alertMessage: !password ? LVStrings.password_verify_required : LVStrings.inner_error_password_mismatch
                });
                this.refs.alert.show();
            }, 500);
            return;
        }
        const wallet = this.props.navigation.state.params.wallet;
        setTimeout(async ()=>{
            try {
                await backupWallet(wallet, password);
                this.goBack();
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
        this.refs.disclaimer.show();
    }

    onPressBackupLaterButton() {
        this.goBack();
    }

    goBack() {
        if (this.props.screenProps.dismiss) {
            this.props.screenProps.dismiss();
        } else {
            this.props.navigation.goBack();
        }
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
                        if (this.props.screenProps.dismiss) {
                            this.props.screenProps.dismiss();
                        } else {
                            this.props.navigation.goBack();
                        }
                    }}
                />
                <View style={styles.contentContainer}>
                    <Image source={createSuccessImage} style={styles.image} />
                    <Text style={styles.text}>{LVStrings.wallet_create_success}</Text>
                    <Text style={styles.detailText}>{LVStrings.wallet_create_success_comment}</Text>
                    <MXButton
                        rounded
                        title={LVStrings.profile_wallet_backup}
                        onPress={this.onPressWalletBackupButton.bind(this)}
                        style={styles.backupButton}
                        isEmptyButtonType={true}
                    />
                    <MXButton
                        rounded
                        title={LVStrings.profile_wallet_backup_later}
                        onPress={this.onPressBackupLaterButton.bind(this)}
                        style={styles.backupButton}
                        isEmptyButtonType={true}
                    />
                    <LVDialog
                    ref={'disclaimer'}
                    height={230}
                    title={LVStrings.wallet_disclaimer}
                    titleStyle={{ color: LVColor.text.grey2,fontSize: 18,fontWeight: '500' }}
                    message={LVStrings.wallet_disclaimer_content}
                    buttonTitle={LVStrings.common_confirm}
                    onPress={() => {
                        this.refs.disclaimer.dismiss();
                        setTimeout(() => {
                            this.refs.passwordConfirm.show();
                        }, 300);
                    }}
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
            </View>
        );
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = LVStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 91
    },
    image: {
        width: 90,
        height: 90
    },
    text: {
        fontSize: 18,
        color: '#667383',
        marginTop: 5
    },
    detailText: {
        fontSize: 12,
        color: '#667383',
        marginTop: Window.width < 500 ? 20 : 55,
        marginLeft: 34,
        marginRight: 34,
        lineHeight: 20
    },
    backupButton: {
        marginTop: 20
    }
});
