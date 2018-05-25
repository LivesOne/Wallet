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
const backImg = require('../../assets/images/back.png');

type Props = {
    navigation: Object,
    screenProps: Object
};
type State = {
    name : ?string,
    password: ?string,
    confirmPassword: ?string,
    alertMessage: ?string
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
            alertMessage: ''
        };
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
            this.setState({alertMessage:LVStrings.wallet_import_private_password_hint });
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
            setTimeout(()=>this.props.navigation.navigate('SuccessPage', {wallet: wallet}),300);
        },500);
    }

    render() {
        return (
            <LVKeyboardDismissView style={styles.container}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.wallet_create_wallet }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {
                        if(this.props.screenProps.dismiss) {
                            this.props.screenProps.dismiss();
                        } else {
                            this.props.navigation.goBack();
                        }
                     }}
                />
                <View style={styles.content}>
                    <View style={styles.textInputContainer}>
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_name_hint}
                            titleText={LVStrings.wallet_create_name}
                            textAlignCenter={true}
                            withUnderLine={false}
                            onTextChanged= {(text) => this.setState({name: text})}/>
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password}
                            titleText={LVStrings.wallet_create_password_label}
                            textAlignCenter={true}
                            secureTextEntry
                            withUnderLine={false}
                            onTextChanged = {(text) => this.setState({password : text})}/>
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password_verify}
                            titleText={LVStrings.wallet_create_confirm_password_label}
                            textAlignCenter={true}
                            secureTextEntry
                            withUnderLine = {true}
                            onTextChanged = {(text) => this.setState({confirmPassword : text})}/>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.descriptionTextStyle}>{LVStrings.wallet_create_explaination}</Text>
                        <MXButton
                            rounded                
                            title={LVStrings.wallet_create}
                            onPress = {() => {
                                this.createWallet();
                            }}
                            themeStyle={"active"}
                            style={styles.createButton}
                        />
                    </View>
                </View>
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_creating_wallet}/>
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} message={this.state.alertMessage || ''} buttonTitle={LVStrings.alert_ok}/>
            </LVKeyboardDismissView>
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
    nav: {
        backgroundColor : LVColor.profileNavBack
    },
    navTitle: {
        color : '#6d798a',
        fontSize: LVFontSize.large
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
    },
    bottomContainer: {
        flexDirection: 'column'
    },
    descriptionTextStyle: {
        fontSize: LVFontSize.xsmall,
        color: LVColor.text.editTextNomal,
        marginTop: 16
    },
    createButton: {
        marginTop: 93.5,
        width: MXUtils.getDeviceWidth() - 30
    },
});