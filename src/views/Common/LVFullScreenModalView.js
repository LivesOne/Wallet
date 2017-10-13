
/*
 * Project: Venus
 * File: src/views/Common/LVFullScreenModalView.js
 * Author: Charles Liu
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Easing } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';

export default class LVFullScreenModalView extends Component {
    show() {
        this.refs.dialog.open();
    }

    dismiss() {
        this.refs.dialog.close();
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
            backdropPressToClose={false}
            easing={Easing.elastic(0.75)}
        >
            {this.props.children}
        </Modal>
        );
    }
}