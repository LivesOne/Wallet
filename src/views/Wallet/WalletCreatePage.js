/*
 * Project: Venus
 * File: src/views/Assets/WalletCreatePage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TextInput, Keyboard } from 'react-native';
import MXButton from '../../components/MXButton';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import WalletUtils from '../Wallet/WalletUtils'
import * as LVStyleSheet from '../../styles/LVStyleSheet';
import LVGradientPanel from '../Common/LVGradientPanel';
import MXTouchableImage from '../../components/MXTouchableImage';
import MXCrossTextInput from '../../components/MXCrossTextInput';
import LVWalletManager from '../../logic/LVWalletManager';
import LVLoadingToast from '../Common/LVLoadingToast';
import LVDialog from '../Common/LVDialog';
import MXNavigatorHeader from './../../components/MXNavigatorHeader';
import { greyNavigationBackIcon } from '../../assets/LVIcons';
import { LVKeyboardDismissView } from '../Common/LVKeyboardDismissView';
import LVFontSize from '../../styles/LVFontSize';
import * as MXUtils from "../../utils/MXUtils";
import { MXCrossInputHeight } from '../../styles/LVStyleSheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVNotification from '../../logic/LVNotification';
const backImg = require('../../assets/images/back.png');

type Props = {
    navigation: Object,
    screenProps: Object
};
type State = {
    name : ?string,
    password: ?string,
    confirmPassword: ?string,
    alertMessage: ?string,
    fromScreen: ?string,
};

export default class WalletCreatePage extends Component<Props,State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    createWallet : Function;

    constructor() {
        super();
        this.createWallet = this.createWallet.bind(this);
        this.state = {
            name: null,
            password: null,
            confirmPassword: null,
            alertMessage: '',
            fromScreen: null
        };
    }

    componentDidMount() {
        const navigation = this.props.navigation;
        if (navigation && navigation.state && navigation.state.params) {
            this.setState({ fromScreen: navigation.state.params.from });
        }
        this.refs.wallet_creation_alert.show();
    }

    async createWallet() {
        Keyboard.dismiss();
        
        if(!this.state.name) {
            this.setState({alertMessage:LVStrings.wallet_create_name_required });
            this.refs.alert.show();
            return;
        }

        if (WalletUtils.getLength(this.state.name) > 40) {
            this.setState({alertMessage:LVStrings.wallet_name_exceeds_limit });
            this.refs.alert.show();
            return;
        }

        if (!WalletUtils.isNameValid(this.state.name)) {
            this.setState({alertMessage:LVStrings.wallet_name_invalid });
            this.refs.alert.show();
            return;
        } 

        if(!LVWalletManager.isWalletNameAvailable(this.state.name)) {
            this.setState({alertMessage:LVStrings.wallet_create_name_unavailable });
            this.refs.alert.show();
            return;
        }

        if(!this.state.password) {
            this.setState({alertMessage:LVStrings.wallet_create_password_required });
            this.refs.alert.show();
            return;
        }

        if(!WalletUtils.isPasswordValid(this.state.password)) {
            this.setState({alertMessage:LVStrings.wallet_import_invalid_password_warning });
            this.refs.alert.show();
            return;
        }    

        if(!this.state.confirmPassword) {
            this.setState({alertMessage:LVStrings.wallet_create_confimpassword_required });
            this.refs.alert.show();
            return;
        }

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({alertMessage:LVStrings.wallet_create_password_mismatch });
            this.refs.alert.show();
            return;
        }

        this.refs.toast.show();
      
        setTimeout(async ()=> {
            const wallet = await LVWalletManager.createWallet(this.state.name, this.state.password);
            console.log(wallet);
            LVWalletManager.addWallet(wallet);
            LVWalletManager.saveToDisk();
            this.refs.toast.dismiss();

            LVNotificationCenter.postNotification(LVNotification.walletChanged);
            
            if (this.state.fromScreen === WalletUtils.OPEN_CREATE_FROM_WALLET_MANAGER) {
                setTimeout(()=>this.props.navigation.goBack(),300);
            } else {
                setTimeout(()=>this.props.navigation.navigate('SuccessPage', {wallet: wallet}),300);
            }
        },500);
    }

    render() {
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    left={greyNavigationBackIcon}
                    title={LVStrings.wallet_create_wallet}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: LVColor.white }} keyboardShouldPersistTaps={'handled'}>
                    <LVKeyboardDismissView style={styles.content}>
                        <View style={styles.textInputContainer}>
                            <MXCrossTextInput
                                style={styles.crossInputStyle}
                                placeholder={LVStrings.wallet_name_hint}
                                titleText={LVStrings.wallet_create_name}
                                textAlignCenter={true}
                                withUnderLine={false}
                                onTextChanged={(text) => this.setState({ name: text.trim() })} />
                            <MXCrossTextInput
                                style={styles.crossInputStyle}
                                placeholder={LVStrings.wallet_create_password}
                                titleText={LVStrings.wallet_create_password_label}
                                textAlignCenter={true}
                                secureTextEntry
                                withUnderLine={false}
                                onTextChanged={(text) => this.setState({ password: text })} />
                            <MXCrossTextInput
                                style={styles.crossInputStyle}
                                placeholder={LVStrings.wallet_create_password_verify}
                                titleText={LVStrings.wallet_create_confirm_password_label}
                                textAlignCenter={true}
                                secureTextEntry
                                withUnderLine={true}
                                onTextChanged={(text) => this.setState({ confirmPassword: text })} />
                        </View>
                        <View style={styles.bottomContainer}>
                            <Text style={styles.descriptionTextStyle}>{LVStrings.wallet_create_explaination}</Text>
                            <MXButton
                                rounded
                                title={LVStrings.wallet_create}
                                onPress={() => {
                                    this.createWallet();
                                }}
                                themeStyle={"active"}
                                style={styles.createButton}
                            />
                        </View>
                    </LVKeyboardDismissView>
                </KeyboardAwareScrollView>
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_creating_wallet} />
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} height={225} message={this.state.alertMessage || ''} buttonTitle={LVStrings.alert_ok} />
                <LVDialog ref={'wallet_creation_alert'}
                    message={LVStrings.wallet_create_hint_message}
                    buttonTitle={LVStrings.alert_ok}
                    messageStyle={{ color: LVColor.text.yellow, marginBottom: 13 }}
                    width={280}
                    height={210} />
            </View>
             
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = LVStyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: LVColor.white,
    },
    gradient: {
        width: '100%',
        height: 170,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    navBack: {
        paddingLeft: 12.5,
        width: 36.5,
    },
    navRightPlaceholder: {
        paddingRight: 12.5,
        width: 36.5,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'flex-start',
        marginLeft:15,
        marginRight:15
    },
    textInputContainer: {
        flexDirection: 'column',
        height:240,
        marginTop: 15
    },
    bottomContainer: {
        flexDirection: 'column'
    },
    descriptionTextStyle: {
        fontSize: LVFontSize.xsmall,
        color: LVColor.text.editTextNomal
    },
    createButton: {
        marginTop: 93.5,
        width: MXUtils.getDeviceWidth() - 30
    },
    crossInputStyle: {
        height: MXCrossInputHeight
    }
});