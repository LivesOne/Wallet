
/*
 * Project: Venus
 * File: src/views/Common/LVFullScreenModalView.js
 * Author: Charles Liu
 * @flow
 */
import * as React from 'react';
import { StyleSheet, View, Text, Easing, BackHandler, Keyboard, Platform,Modal } from 'react-native';;
import WalletUtils from '../Wallet/WalletUtils';

type Props = {
    children?: React.Node,
};
type State = {
    KeyboardShow: boolean,
    modalVisible: boolean
}

export default class LVFullScreenModalView extends React.Component<Props, State> {

    keyboardDidShowListener: Object;
    keyboardDidHideListener: Object;

    constructor() {
        super();
        this.state = {
            KeyboardShow: false,
            modalVisible: false
        }
    }
    show() {
        this.setState({
            modalVisible: true
        });
    }

    dismiss() {
        this.setState({
            modalVisible: false
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandler.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        this.setState({KeyboardShow: true});
        WalletUtils.log('Keyboard Shown');
      }
    
    _keyboardDidHide () {
        this.setState({KeyboardShow: false});
        WalletUtils.log('Keyboard Hidden');
    }
    
    backHandler() {
        if (Platform.OS === 'android') {
            if (this.state.KeyboardShow) {
                Keyboard.dismiss();
                return true;
            }
        }
    }
    
    render() {     
        return (
            <Modal
            ref={'dialog'}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={()=>{this.dismiss()}}
            style={{width: '100%', height:'100%'}}
        >
            {this.props.children}
        </Modal>
        );
    }
}