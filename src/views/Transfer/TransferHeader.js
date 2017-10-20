// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import MXTouchableImage from '../../components/MXTouchableImage';
import * as MXUtils from "../../utils/MXUtils";
import LVGradientPanel from '../Common/LVGradientPanel';
import { StringUtils } from '../../utils';

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

    render() {
        const { balance, eth } = this.props;
        const lvtValString = StringUtils.convertAmountToCurrencyString(balance, ',', 0);
        const ethValString = StringUtils.convertAmountToCurrencyString(eth, ',', 8);
        return (
            <LVGradientPanel style = {[styles.container, this.props.style]}>
                <View style={styles.nav}>
                        <View style={{ width: 30 }} />
                        <Text style={styles.navTitle}>{ LVStrings.transfer_title }</Text>
                        <View style={{ width: 30 }} />
                </View>
                <View style= {styles.columnContainer}>
                    <Text style= {[styles.textCommon]}>{ LVStrings.transfer_purse_balance }</Text>
                    <Text style= {[styles.textCommon, {fontSize: 36}]}>{ lvtValString }</Text>
                    <Text style= {[styles.textCommon]}>{ '≈￥' + ethValString}</Text>
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
        height: '25%',
        backgroundColor: 'transparent'
    },
    nav: {
        width: Window.width,
        height: 64,
        paddingTop: Platform.OS === 'ios' ? 22 : 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    columnContainer: {
        flex: 1, 
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