/*
 * Project: Venus
 * File: src/views/Assets/PurseBalanceView.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import { StringUtils } from '../../utils';

const lvtIcon = require('../../assets/images/lvt.png');
const ethIcon = require('../../assets/images/eth.png');

export default class PurseBalanceView extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        lvt: PropTypes.number,
        eth: PropTypes.number,
        extLvt: PropTypes.number,
        extEth: PropTypes.number
    };

    render() {
        const { lvt, eth, extLvt, extEth } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.rows}>
                    <BalanceItemHeader icon={lvtIcon} title="LVT" />
                    <BalanceValueView value={lvt} extValue={extLvt} extUnit="￥" />
                </View>
                <View
                    style={{ width: '90%', height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }}
                />
                <View style={styles.rows}>
                    <BalanceItemHeader icon={ethIcon} title="ETH" />
                    <BalanceValueView value={eth} extValue={extEth} extUnit="￥" />
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

const BalanceValueView = ({ value, extValue, extUnit }) => {
    const valueString = StringUtils.convertAmountToCurrencyString(value, ',');
    const extValString = StringUtils.convertAmountToCurrencyString(extValue, ',');
    return (
        <View>
            <Text />
            <Text
                style={{ fontSize: LVSize.xxlarge, textAlign: 'right', fontWeight: '600', color: LVColor.text.grey1 }}
            >
                {valueString}
            </Text>
            <Text style={{ fontSize: LVSize.xsmall, textAlign: 'right', fontWeight: '400', color: LVColor.text.grey3 }}>
                {'≈' + extUnit + extValString}
            </Text>
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
