// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, ActivityIndicator, Keyboard } from 'react-native';
import { LVConfirmDialog } from './LVDialog';
import MXCrossTextInput from './../../components/MXCrossTextInput';
import LVStrings from '../../assets/localization';
import PropTypes from 'prop-types';
import WalletUtils from '../Wallet/WalletUtils';

export class LVPasswordDialog extends LVConfirmDialog {

    state: {
        inputPwd: string,
        verifying: boolean, 
    }

    static propTypes = {
        verify: PropTypes.func.isRequired,
        onVerifyResult: PropTypes.func
    };

    constructor() {
        super();
        this.state = {
            inputPwd: '',
            verifying: false,
        }
    }

    show() {
        this.setState({inputPwd: ''})
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
            await this.setState({verifying: false})
            this.dismiss();
            if (onVerifyResult) {
                setTimeout(function() {
                    onVerifyResult(vefirySuccess, inputPwd)
                }, 100);
            }
        } else {
            this.dismiss();
            if (onVerifyResult) {
                setTimeout(function() {
                    onVerifyResult(false, inputPwd)
                }, 100);
            }
        }
    }

    render() {
        const {inputPwd, verifying} = this.state;
        return (
            <LVConfirmDialog
                ref={'dialog'} {...this.props}
                title={verifying ? LVStrings.password_verify_title : LVStrings.wallet_create_password_required}
                onConfirm={this.onInputConfirm.bind(this)}
                dismissAfterConfirm={false}
                enableConfirm={!verifying}
                >
                    <View>
                        {!verifying && 
                        <MXCrossTextInput
                            style={{width: 200, alignSelf: 'center'}}
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