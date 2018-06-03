// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, Platform, PixelRatio,ViewPropTypes } from 'react-native';
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
import { LVBalanceShowView } from '../Common/LVBalanceShowView';

type Props = {
    balance: number,
    onPressSelectWallet: Function,
    style: ViewPropTypes.style
};

export class TransferHeader extends Component<Props> {
    onPressSelectPurse = () => {
        if (this.props.onPressSelectWallet) {
            this.props.onPressSelectWallet();
        }
    };

    getBalanceSize() {
        let v = 12 * pixelRatio;
        if (v < 32) {
            return 32;
        } else if (v > 40) {
            return 40;
        } else {
            return v;
        }
    }

    num = 0;

    render() {
        //TransferUtils.log('num ---> = ' + this.num++);
        const { balance } = this.props;
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
                    <Text style= {[styles.textCommon,]}>{ LVStrings.transfer_purse_balance }</Text>
                    <LVBalanceShowView
                        title={LVStrings.show_LVT_balance} 
                        unit={'LVTC'}
                        balance = {balance}
                        textStyle= {[styles.textCommon, {fontSize: this.getBalanceSize(), fontWeight: '600'}]}>
                    </LVBalanceShowView>
                </View>
            </LVGradientPanel>
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const pixelRatio = PixelRatio.get();

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    },
    columnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginLeft: 7 * pixelRatio,
    },
    textCommon: {
        color: 'white',
        fontSize: Math.min(6 * pixelRatio, 15),
    }
});

export default TransferHeader