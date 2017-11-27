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
import {  beautifyBalanceShow } from '../../utils/MXStringUtils';

const MAX_BALANCE_LENGTH_LIMIT = 13;
const FRAGMENT_LENGTH = 2;

export class LVBalanceShowView extends Component {

    static propTypes = {
        symble: PropTypes.string,
        unit: PropTypes.string,
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        balance: PropTypes.object.isRequired,
    };

    render() {
        let v = beautifyBalanceShow(this.props.balance, this.props.unit);
        const {symble} = this.props;
        const values = symble ? symble + v.result : v.result; 
        return (
            <TouchableOpacity style = {this.props.style} activeOpacity={0.8} onPress = {()=>{
                if (v.hasShrink) {
                    this.refs.alert.show();
                }
                }} >
                <LVDialog 
                    ref={'alert'} 
                    height={200}
                    title={LVStrings.total_amount} 
                    buttonTitle={LVStrings.alert_ok}>
                    <TextInput  
                        textAlign={'center'}             
                        underlineColorAndroid = {'transparent'}
                        multiline= {true}
                        editable={false} 
                        selectTextOnFocus={false}
                        style={ [styles.textInput, {paddingHorizontal: 20, alignSelf: 'center'}] }>{ this.props.balance.toFixed() }
                    </TextInput>

                </LVDialog>
                <Text style={[styles.text, this.props.textStyle]}> { values } </Text>
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