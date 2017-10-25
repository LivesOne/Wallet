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
import { LVKeyboardDismissView } from '../Common/LVKeyboardDismissView';
const backImg = require('../../assets/images/back.png');

export default class WalletCreatePage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    createWallet : Function;

    state : {
        name : ?string,
        password: ?string,
        confirmPassword: ?string,
        alertMessage: ?string
    }

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
                <LVGradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <MXTouchableImage 
                            style={styles.navBack} 
                            source={backImg}
                            onPress={() => {
                                if(this.props.screenProps.dismiss) {
                                    this.props.screenProps.dismiss();
                                } else {
                                    this.props.navigation.goBack();
                                }
                            }}
                        />
                        <Text style={styles.navTitle}>{LVStrings.wallet_create_wallet}</Text>
                        <View style={styles.navRightPlaceholder} />
                    </View>
                </LVGradientPanel>
                <View style={styles.content}>
                    <View style={styles.textInputContainer}>
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_name_hint}
                            style={ styles.textInput }
                            textAlignCenter={true}
                            onTextChanged= {(text) => this.setState({name: text})}
                        />
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password}
                            style={ styles.textInput }
                            textAlignCenter={true}
                            secureTextEntry
                            onTextChanged = {(text) => this.setState({password : text})}
                        />
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password_verify}
                            style={ styles.textInput }
                            textAlignCenter={true}
                            secureTextEntry
                            withUnderLine = {false}
                            onTextChanged = {(text) => this.setState({confirmPassword : text})}
                        />
                    </View>
                    <Text style={styles.text}>{LVStrings.wallet_create_comment}</Text>
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
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_creating_wallet}/>
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} message={this.state.alertMessage} buttonTitle={LVStrings.alert_ok}/>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.white,
    },
    gradient: {
        width: '100%',
        height: 170,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    nav: {
        width: '100%',
        height: 64,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: -86,
        width: Window.width,
    },
    textInputContainer: {
        alignItems: 'center',
        shadowOffset: {width: 0, height: 3},
        shadowColor: "#bfc5d1",
        shadowOpacity: 0.2,
        shadowRadius: 15,
        borderRadius: 5,
        width: Window.width - 25,
    },
    textInput: {
        height: 60,
        width: Window.width - 65,
    },
    text: {
        marginTop: 15,
        width: Window.width - 25,
        fontSize: 12,
        color: "#667383",
        textAlign: "center",
    },
    createButton: {
        marginTop: 35,
    },
});