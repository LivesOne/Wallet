/*
 * Project: Venus
 * File: src/views/Assets/WalletBalanceView.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import { StringUtils } from '../../utils';
import { LVBalanceShowView } from '../Common/LVBalanceShowView';

const lvtIcon = require('../../assets/images/lvt.png');
const ethIcon = require('../../assets/images/eth.png');

const isIOS = Platform.OS === 'ios';

export default class WalletBalanceView extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        lvt: PropTypes.number,
        eth: PropTypes.number
    };

    render() {
        const { lvt, eth } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                {((isIOS &&  lvt > 0) || !isIOS) && <View style={styles.rows}>
                    <BalanceItemHeader icon={lvtIcon} title="LVT" />
                    <BalanceValueView value={lvt} num={0} keepZero={false} />
                </View>}
                <View
                    style={{ width: '90%', height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }}
                />
                <View style={styles.rows}>
                    <BalanceItemHeader icon={ethIcon} title="ETH" />
                    <BalanceValueView value={eth} num={8} keepZero={true} />
                </View>
            </View>
        );
    }
}

const BalanceItemHeader = ({ icon, title }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={{ marginRight: 10 }} source={icon} />
        <Text style={{ fontSize: LVSize.large, fontWeight: '400', color: LVColor.text.grey2 }}>{title}</Text>
    </View>
);

const BalanceValueView = ({ value, num, keepZero }) => {
    const valueString = StringUtils.convertAmountToCurrencyString(value, ',', num, keepZero);
    return (
        <View>
            <LVBalanceShowView 
                balanceStr={value}
                textStyle={{ fontSize: 24, textAlign: 'right', fontWeight: '600', color: LVColor.text.grey1 }}>
            </LVBalanceShowView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: LVColor.white
    },
    rows: {
        flex: 1,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
