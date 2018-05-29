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
import Toast from 'react-native-root-toast';
import { LVKeyboardDismissView } from '../../Common/LVKeyboardDismissView';
import MXButton from './../../../components/MXButton';

type Props = {
    navigation: Object
};

type State = {
    wallet: ?Object,
    name: ?string,
    alertMessage: string,
};

export class ModifyWalletName extends React.Component<Props, State> {

    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onSavePressed: Function;

    constructor() {
        super();
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            name: '',
            alertMessage: ''
        }
        this.onSavePressed = this.onSavePressed.bind(this);
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

        if (WalletUtils.getLength(name) > 40) {
            this.setState({alertMessage:LVStrings.wallet_name_exceeds_limit });
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
            Toast.show(LVStrings.wallet_edit_save_success, { duration: Toast.durations.LONG });
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
            <LVKeyboardDismissView style={{ backgroundColor: 'white', flex: 1}}>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_wallet_modify_name }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {
                        Keyboard.dismiss(); 
                        this.props.navigation.goBack() 
                        }}/>
                    <View style= {styles.container}>
                        <MXCrossTextInput
                            ref={'textinput'}
                            titleText={LVStrings.profile_wallet_name }
                            //setFocusWhenMounted = {true}
                            style={styles.textInput}
                            placeholder= { LVStrings.wallet_name_hint }
                            onTextChanged={ this.onTextChanged.bind(this) }
                        />
                        <MXButton
                            rounded                
                            title={LVStrings.profile_wallet_save}
                            onPress = {this.onSavePressed}
                            themeStyle={"active"}
                            style={styles.saveButton}/>
                    </View>
                    <LVDialog ref={'alert'} 
                        title={LVStrings.alert_hint} 
                        message={this.state.alertMessage} 
                        buttonTitle={LVStrings.alert_ok}/>
            </LVKeyboardDismissView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: 15, 
        marginRight:15
    },
    text: {
        color: LVColor.primary, 
        fontSize: 16,
    },
    textInput: {
        width: '100%'
    },
    saveButton: {
        marginTop: 126,
        width: '100%'
    }
});

export default ModifyWalletName