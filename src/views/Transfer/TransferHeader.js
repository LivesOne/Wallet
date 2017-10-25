// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import MXTouchableImage from '../../components/MXTouchableImage';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import * as MXUtils from "../../utils/MXUtils";
import LVGradientPanel from '../Common/LVGradientPanel';
import { StringUtils } from '../../utils';
import Transaction from 'ethereumjs-tx';
import TransferUtils from './TransferUtils';

export class TransferHeader extends Component {

    static propTypes = {
        eth: PropTypes.number,
        balance: PropTypes.number,
        onPressSelectWallet: PropTypes.func,
    };

    onPressSelectPurse = () => {
        if (this.props.onPressSelectWallet) {
            this.props.onPressSelectWallet();
        }
    };

    num = 0;

    render() {
        TransferUtils.log('num ---> = ' + this.num++);
        const { balance, eth } = this.props;
        const lvtValString = StringUtils.convertAmountToCurrencyString(balance, ',', 0);
        return (
            <LVGradientPanel style = {[styles.container, this.props.style]}>
                <MXNavigatorHeader
                    style={{ backgroundColor: 'transparent' }}
                    title={LVStrings.transfer_title}
                    titleStyle={{color: '#ffffff', fontSize: LVSize.large}}
                    hideLeft={true}
                />
                <View style= {styles.columnContainer}>
                    <Text style= {[styles.textCommon]}>{ LVStrings.transfer_purse_balance }</Text>
                    <Text style= {[styles.textCommon, {fontSize: 36}]}>{ lvtValString }</Text>
                </View>
            </LVGradientPanel>
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        //height: '23%',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    },
    columnContainer: {
        //flex: 1, 
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 30,
    },
    textCommon: {
        marginBottom: 5,
        color: 'white',
        fontSize: 12
    }
});

export default TransferHeader