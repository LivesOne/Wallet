
/*
 * Project: Venus
 * File: src/views/Common/LVFullScreenModalView.js
 * Author: Charles Liu
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Easing, BackHandler, Keyboard, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import WalletUtils from '../Wallet/WalletUtils';

export default class LVFullScreenModalView extends Component {

    state: {
        KeyboardShow: boolean,
    }

    constructor() {
        super();
        this.state = {
            KeyboardShow: false,
        }
    }
    show() {
        this.refs.dialog.open();
    }

    dismiss() {
        this.refs.dialog.close();
    }

    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.backHandler.bind(this));
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
        Keyboard.removeListener('keyboardDidShow');
        Keyboard.removeListener('keyboardDidHide');
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
            isOpen={false}
            style={{width: '100%', height:'100%'}}
            entry={'bottom'}
            position={'center'}
            coverScreen={true}
            backButtonClose={false}
            backdropOpacity={0.5}
            animationDuration={300}
            swipeToClose={false}
            backdropPressToClose={false}
            keyboardTopOffset={0}
            easing={Easing.elastic(0.75)}
        >
            {this.props.children}
        </Modal>
        );
    }
}