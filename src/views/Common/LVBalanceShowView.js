// @flow

'use strict'

import React, { Component } from 'react'
import {
    Text,
    View,
    ViewPropTypes,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Modal
} from 'react-native';
import PropTypes from 'prop-types';
import LVDialog from './LVDialog';
import LVStrings from './../../assets/localization';
import LVColor from '../../styles/LVColor';
import console from 'console-browserify';

const MAX_BALANCE_LENGTH_LIMIT = 13;
const FRAGMENT_LENGTH = 2;

export class LVBalanceShowView extends Component {

    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        balanceStr: PropTypes.number.isRequired,
    };

    convertBalance() {
        const original = this.props.balanceStr + '';
        console.log('origin = ' + original);
        const arr = original.split('.');
        let totalLength = 0;
        for (var i = 0; i < arr.length; i++) {
            totalLength += arr[i].length;
        }
        if (totalLength <= MAX_BALANCE_LENGTH_LIMIT) {
            return original;
        } else {
            if (arr.length > 1) {
                const num = arr[0];
                const decimal = arr[1];
                if (num.length < MAX_BALANCE_LENGTH_LIMIT) {
                    if (num.length === MAX_BALANCE_LENGTH_LIMIT - 1) {
                        return num;
                    } else {
                        return num + '.' + decimal.slice(0, MAX_BALANCE_LENGTH_LIMIT - num.length - 1);
                    }
                } else {
                    const numHead = num.slice(0, FRAGMENT_LENGTH);
                    const numTail = num.slice(num.length - FRAGMENT_LENGTH + 1);
                    let leftLength = MAX_BALANCE_LENGTH_LIMIT - 2 - 2 * FRAGMENT_LENGTH;
                    leftLength = Math.min(decimal.length, leftLength);
                    const decimalPart = decimal.slice(0, leftLength + 1);
                    return [numHead, '...', numTail, '.', decimalPart].join('');
                }
            } else {
                const sepLength = (MAX_BALANCE_LENGTH_LIMIT - 2) / 2;
                const num = original;
                const numHead = num.slice(0, sepLength);
                const numTail = num.slice(num.length - sepLength + 1);
                return [numHead, '...', numTail].join('');
            }
        }
    }

    render() {
        return (
            <TouchableOpacity style = {this.props.style} activeOpacity={0.8} onPress = {()=>{
                this.refs.alert.show()
                }} >
                <LVDialog 
                    ref={'alert'} 
                    height={200}
                    title={LVStrings.alert_hint} 
                    buttonTitle={LVStrings.alert_ok}>
                    <TextInput  
                        textAlign={'center'}             
                        underlineColorAndroid = {'transparent'}
                        multiline= {true}
                        editable={false} 
                        selectTextOnFocus={false}
                        style={ [styles.textInput, {paddingHorizontal: 20}] }>{ this.props.balanceStr }
                    </TextInput>

                </LVDialog>
                <Text style={[styles.text, this.props.textStyle]}> { this.convertBalance() } </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "#f8f9fb", 
        width: '100%',
        fontSize: 16,
        marginLeft: 20, 
        marginRight: 20,
        color: LVColor.text.grey2,
        borderRadius: 3,
    },
    text : {
        color: LVColor.text.grey2,
        fontSize: 16,
    }
});

export default LVBalanceShowView