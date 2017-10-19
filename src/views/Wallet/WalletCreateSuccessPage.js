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
import LVDialog from '../Common/LVDialog';
const createSuccessImage = require('../../assets/images/create_wallet_success.png');
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVNotification from '../../logic/LVNotification';

export default class WalletCreateSuccessPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onPressWalletBackupButton() {
        const wallet = this.props.navigation.state.params.wallet;

        if (wallet && wallet.keystore) {
            const title: string = wallet.name + ' ' + LVStrings.wallet_backup_title_suffix;
            const message: string = title + '\n' + JSON.stringify(wallet.keystore);

            const options = { title: title, message: message, subject: title };

            if (Platform.OS === 'ios') {
                ActionSheetIOS.showShareActionSheetWithOptions(
                    options,
                    error => console.log(error),
                    (success, activityType) => {
                        if (success) {
                            this.refs.disclaimer.show();
                        } else {
                            console.log('User did not share');
                        }
                    }
                );
            } else {
                Share.share(options)
                    .then(this._shareResult.bind(this))
                    .catch(error => console.log(error));
            }
        }
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
                    title={LVStrings.wallet_backup}
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
