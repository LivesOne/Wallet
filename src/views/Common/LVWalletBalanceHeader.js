/*
 * Project: Venus
 * File: src/views/Common/LVWalletBalanceHeader.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image } from 'react-native';
import { StringUtils } from '../../utils';
import Big from 'big.js';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVBalanceShowView from '../Common/LVBalanceShowView';

const walletIcon = require('../../assets/images/assets_wallet.png');

const tokenImageIcons = {
    lvt: require('../../assets/images/lvt_large.png'),
    eth: require('../../assets/images/eth_large.png')
};

const totalAmountStrings = {
    lvt: LVStrings.total_lvt,
    eth: LVStrings.total_eth
}

type Props = {
    style?: ViewPropTypes.style,
    token: string,
    balance: Big,
    tokenIcon?: number | React.Element<any>
};

export default class LVWalletBalanceHeader extends React.Component<Props> {
    render() {
        const { token, balance } = this.props;
        const tokenIcon = tokenImageIcons[token];
        const totalAmountTitle = totalAmountStrings[token];

        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={this.props.tokenIcon || tokenIcon} style={styles.image} resizeMode="contain" />
                <View style={styles.bottom}>
                    <LVBalanceShowView
                        title={totalAmountTitle}
                        unit={token.toUpperCase()}
                        balance={balance}
                        textStyle={styles.balance}
                        showSeparator={true}
                    />
                    <Text style={styles.token}>{token.toUpperCase()}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        marginTop: 13
    },
    bottom: {
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    balance: {
        paddingLeft: 14,
        fontSize: 29,
        fontFamily: 'DINAlternate-Bold',
        textAlign: 'center',
        color: LVColor.text.white
    },
    token: {
        marginTop: 5,
        fontSize: 12,
        color: LVColor.text.white,
    }
});