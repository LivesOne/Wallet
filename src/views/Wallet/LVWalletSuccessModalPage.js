/*
 * Project: Venus
 * File: src/views/Wallet/LVWalletSuccessModalPage.js
 * Author: Charles Liu
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Easing } from 'react-native';
import LVWalletSuccessNavigator from './LVWalletSuccessNavigator';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';

export default class LVWalletSuccessModalPage extends Component {
    static propTypes = {
        dismissCallback: PropTypes.func
    };

    show() {
        this.refs.dialog.open();
    }

    dismiss() {
        this.refs.dialog.close();
    }

    render() {
        const { dismissCallback } = this.props;        
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
            backdropPressToClose={false}
            easing={Easing.elastic(0.75)}
        >
            <LVWalletSuccessNavigator screenProps={{dismiss: ()=> {
                    this.dismiss();
                    if(dismissCallback) {
                        dismissCallback();
                    }
                } 
            }}/>
        </Modal>
        );
    }
}