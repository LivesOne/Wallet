// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { LVConfirmDialog } from './LVDialog';
import MXCrossTextInput from './../../components/MXCrossTextInput';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import WalletUtils from '../Wallet/WalletUtils';

type Props = {
    verify: Function,
    onVerifyResult: Function
};
type State = {
    inputPwd: string,
    verifying: boolean, 
    cancel: boolean,
}

export class LVPasswordDialog extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            inputPwd: '',
            verifying: false,
            cancel: false,
        }
    }

    show() {
        this.setState({inputPwd: '', cancel: false})
        this.refs.dialog.show();
    }

    dismiss() {
        this.refs.dialog.dismiss();
    }

    async innertVerify() {
        return await this.props.verify(this.state.inputPwd);
    }

    async onInputConfirm() {
        const {inputPwd, verifying} = this.state;
        const {verify, onVerifyResult} = this.props;
        if (inputPwd) {
            await this.setState({verifying: true})
            let vefirySuccess = await this.innertVerify();
            const cancel = this.state.cancel;
            this.setState({verifying: false})
            this.dismiss();
            if (onVerifyResult && !cancel) {
                setTimeout(function() {
                    if (!cancel) {
                        onVerifyResult(vefirySuccess, inputPwd)
                    }
                }, 100);
            }
        } else {
            const cancel = this.state.cancel;
            this.dismiss();
            if (onVerifyResult && !cancel) {
                setTimeout(function() {
                    if (!cancel) {
                        onVerifyResult(false, inputPwd)
                    }
                }, 100);
            }
        }
    }

    onCancel() {
        this.setState({cancel: true})
        this.dismiss();
    }

    onPressContent() {
        this.refs.textinput.focus();
    }

    render() {
        const {inputPwd, verifying} = this.state;
        const onVerifyResult = this.props.onVerifyResult;
        const isAndroid = Platform.OS === 'android';
        return (
            <LVConfirmDialog
                ref={'dialog'} {...this.props}
                title={verifying ? LVStrings.password_verify_title : LVStrings.wallet_create_password_required}
                onConfirm={()=>{
                    if (!this.state.inputPwd) {
                        Keyboard.dismiss();
                        onVerifyResult(false, inputPwd)
                        this.dismiss();
                    } else {
                        Keyboard.dismiss();
                    setTimeout(async ()=>{
                        this.onInputConfirm();
                    }, isAndroid ? 500 : 100)}
                    }}
                onCancel= {this.onCancel.bind(this)}
                onPressContent={this.onPressContent.bind(this)}
                dismissAfterConfirm={false}
                disableConfirm={verifying}
                disableCancel={verifying}
                confirmTitleStyle={verifying ? {color: LVColor.text.grey4} : null}
                cancelTitleStyle={verifying ? {color: LVColor.text.grey4} : null}
                width={300}
                >
                    <View style = {{height : 40}}>
                        {!verifying && 
                        <MXCrossTextInput
                            ref={'textinput'}
                            style={{width: 210, height: 50}}
                            inputContainerStyle = {{borderWidth : 1 , borderColor : "#C3C8D4" , padding : 5, borderRadius: 4}}
                            secureTextEntry={true}
                            withUnderLine={true}
                            onTextChanged={newText => {
                                this.setState({ inputPwd: newText.trim() });
                            }}
                            placeholder={LVStrings.wallet_create_password_required}
                        />}

                        {verifying && 
                        <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
                            <Text style={{marginRight: 10,  color: '#697485', fontSize: 16,}}>
                                {LVStrings.password_verifying}</Text>
                            <ActivityIndicator></ActivityIndicator>
                        </View>}
                    </View>
                </LVConfirmDialog>
        )
    }
}

export default LVPasswordDialog