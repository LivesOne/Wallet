/*
 * Project: Venus
 * File: src/views/Assets/WalletBalanceList.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, View, ViewPropTypes, FlatList, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import { StringUtils } from '../../utils';
import LVBalanceShowView from '../Common/LVBalanceShowView';

const left_shadow = require('../../assets/images/assets_card_left_shadow.png');
const right_shadow = require('../../assets/images/assets_card_right_shadow.png');

const tokenImageIcons = {
    lvt: require('../../assets/images/lvt.png'),
    eth: require('../../assets/images/eth.png')
};

type Props = {
    style?: ViewPropTypes.style,
    balances: ?Array<Object>,
    refreshing: boolean,
    onRefresh: Function,
    onPressItem: Function
};

export default class WalletBalanceList extends React.Component<Props> {

    constructor() {
        super();
    }

    _onRefresh = () => {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    };

    _keyExtractor = (item, index) => index.toString();

    _onPressItem = (item: Object) => {
        if (this.props.onPressItem) {
            this.props.onPressItem(item);
        }
    };

    _renderItem = ({ item }) => (
        <LVWalletBalanceCard
            token={item.token}
            balance={item.value}
            onPressItem={() => {
                this._onPressItem(item);
            }}
        />
    );

    render() {
        const { style, balances } = this.props;

        return (
            <FlatList
                ref={'list'}
                style={style}
                data={balances}
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
    balance: Object,
    onPressItem: Function
};

class LVWalletBalanceCard extends React.Component<BalanceCardProps> {
    render() {
        const { token, balance } = this.props;
        const tokenImage = tokenImageIcons[token];
        const balanceString = StringUtils.convertAmountToCurrencyString(balance, ',', 4, true);
        return (
            <View style={styles.record}>
                <Image source={left_shadow} />
                <TouchableOpacity style={styles.card} activeOpacity={0.6}>
                    <View style={styles.left}>
                        <Image style={styles.image} source={tokenImage} resizeMode="contain" />
                        <Text style={styles.token}>{token.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.balance}>{balanceString}</Text>
                </TouchableOpacity>
                <Image source={right_shadow} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,

        elevation: 20,
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
