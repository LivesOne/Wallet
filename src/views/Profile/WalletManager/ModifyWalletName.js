//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor'
import MXCrossTextInput from './../../../components/MXCrossTextInput';
import LVWalletManager from '../../../logic/LVWalletManager';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
import LVDialog from '../../Common/LVDialog';
import WalletUtils from '../../Wallet/WalletUtils';

export class ModifyWalletName extends Component {

    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
        wallet: ?Object,
        name: ?string,
        alertMessage: string,
    }

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            name: '',
            alertMessage: ''
        }
    }

    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            wallet: params.wallet,
        })
    }

    componentDidMount = () => {
        const {params} = this.props.navigation.state
        if (params !== null) {
            this.refs.textinput.setText(params.wallet.name);
        }
    }
    

    onTextChanged(newName: string) {
        this.setState({name: newName})
    }

    async onSavePressed() {
        Keyboard.dismiss();
        const {name, wallet} = this.state;
        if (!wallet) {
            this.setState({alertMessage:LVStrings.wallet_edit_save_failed });
            this.refs.alert.show();
            return;
        }
        if (!name) {
            this.setState({alertMessage:LVStrings.wallet_edit_new_name_required });
            this.refs.alert.show();
            return;
        }

        if (name === wallet.name) {
            this.setState({alertMessage:LVStrings.wallet_edit_equal_to_old });
            this.refs.alert.show();
            return;
        } 

        if (!WalletUtils.isNameValid(name)) {
            this.setState({alertMessage:LVStrings.wallet_name_invalid });
            this.refs.alert.show();
            return;
        } 

        if(!LVWalletManager.isWalletNameAvailable(name)) {
            this.setState({alertMessage:LVStrings.wallet_create_name_unavailable });
            this.refs.alert.show();
            return;
        }
        
        wallet.name = name;
        try {
            await LVWalletManager.updateWallet(wallet);
            await LVWalletManager.saveToDisk();
            LVNotificationCenter.postNotification(LVNotification.walletChanged);
            this.props.navigation.goBack();
        } catch(e) {
            this.setState({alertMessage:LVStrings.wallet_edit_save_failed });
            this.refs.alert.show();
            return;
        }
    }
    
    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1}}>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_wallet_modify_name }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {
                        Keyboard.dismiss(); 
                        this.props.navigation.goBack() 
                        }}
                    right = { LVStrings.profile_wallet_save }
                    rightTextColor = { LVColor.primary }
                    onRightPress={this.onSavePressed.bind(this)}/>
                    <View style= {{ paddingHorizontal:12.5}}>
                        <Text style={styles.text}>
                        { LVStrings.profile_wallet_name }</Text>
                        <MXCrossTextInput
                            ref={'textinput'}
                            setFocusWhenMounted = {true}
                            style={styles.textInput}
                            placeholder= { LVStrings.wallet_name_hint }
                            onTextChanged={ this.onTextChanged.bind(this) }
                        />
                    </View>
                    <LVDialog ref={'alert'} 
                        title={LVStrings.alert_hint} 
                        message={this.state.alertMessage} 
                        buttonTitle={LVStrings.alert_ok}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginTop: 15, 
        marginBottom:5, 
        color: LVColor.primary, 
        fontSize: 16,
    },
    textInput: {
        width: '100%'
    }
});

export default ModifyWalletName