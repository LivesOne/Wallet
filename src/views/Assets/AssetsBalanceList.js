/*
 * Project: Venus
 * File: src/views/Assets/AssetsBalanceList.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, View, ViewPropTypes, FlatList, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVTokens from '../../logic/LVTokens';
import LVWallet from '../../logic/LVWallet';
import { StringUtils } from '../../utils';
import LVBalanceShowView from '../Common/LVBalanceShowView';

import Big from 'big.js';

const left_shadow = require('../../assets/images/assets_card_left_shadow.png');
const right_shadow = require('../../assets/images/assets_card_right_shadow.png');

type Props = {
    style?: ViewPropTypes.style,
    wallet: LVWallet,
    refreshing: boolean,
    onRefresh: Function,
    onPressItem: Function
};

export default class AssetsBalanceList extends React.Component<Props> {
    constructor() {
        super();
    }

    _keyExtractor = (item, index) => index.toString();

    _processing_on_press_item = false;
    _onPressItem = (item: Object) => {
        if (this._processing_on_press_item) {
            return;
        }
        this._processing_on_press_item = true;

        if (this.props.onPressItem) {
            this.props.onPressItem(item.token);
        }

        setTimeout(() => {
            this._processing_on_press_item = false;
        }, 600);
    };

    _renderItem = ({ item }) => (
        <LVWalletBalanceCard
            token={item.token}
            amount={item.amount}
            onPressItem={() => {
                this._onPressItem(item);
            }}
        />
    );

    _onRefresh = () => {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    };

    render() {
        const { style, wallet } = this.props;

        const data = wallet.available_tokens.map(token => {
            return { token: token, amount: wallet.getBalance(token) };
        });

        return (
            <FlatList
                ref={'list'}
                style={style}
                data={data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => <View />}
                refreshControl={
                    <RefreshControl refreshing={this.props.refreshing} onRefresh={this._onRefresh.bind(this)} />
                }
            />
        );
    }
}

type BalanceCardProps = {
    token: string,
    amount: Big,
    onPressItem: Function
};

class LVWalletBalanceCard extends React.Component<BalanceCardProps> {
    render() {
        const { token, amount } = this.props;
        const tokenImage = LVTokens.icons.normal(token);
        const tokenName = (token === 'USDT') ? 'USDT(ERC20)' : token.toUpperCase();

        var balanceString = StringUtils.convertAmountToCurrencyString(amount, ',', 4, true);
        if (balanceString.endsWith('.0000')) {
            balanceString = balanceString.substr(0, balanceString.length - 5);
        }

        return (
            <View style={styles.record}>
                <Image style={{ marginBottom: 7.5 }} source={left_shadow} />
                <TouchableOpacity style={styles.card} activeOpacity={0.6} onPress={this.props.onPressItem}>
                    <View style={styles.left}>
                        <Image style={styles.image} source={tokenImage} resizeMode="contain" />
                        <Text style={styles.token}>{tokenName}</Text>
                    </View>
                    <Text style={styles.balance}>{balanceString}</Text>
                </TouchableOpacity>
                <Image style={{ marginBottom: 7.5 }} source={right_shadow} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    record: {
        height: 81,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    card: {
        flex: 1,
        height: 66,
        marginBottom: 7.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,

        elevation: 5,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: LVColor.primary,
        shadowOpacity: 0.05,
        shadowRadius: 7,

        backgroundColor: LVColor.white
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12
    },
    image: {
        width: 29,
        height: 29
    },
    token: {
        fontSize: 15,
        fontFamily: 'SFProText-Semibold',
        textAlign: 'left',
        marginLeft: 7,
        color: LVColor.text.grey2
    },
    balance: {
        fontSize: 17,
        fontFamily: 'DINAlternate-Bold',
        textAlign: 'right',
        marginRight: 12,
        color: LVColor.text.grey2
    }
});
