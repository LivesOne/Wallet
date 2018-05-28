/*
 * Project: Venus
 * File: src/views/Assets/TransactionRecordList.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, ViewPropTypes, Image, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import { DateUtils, StringUtils } from '../../utils';
import * as Progress from 'react-native-progress';

const windowHeight = Dimensions.get('window').height;

const inImg = require('../../assets/images/transfer_in.png');
const outImg = require('../../assets/images/transfer_out.png');

type Props = {
    style: ViewPropTypes.style,
    loading?: bool,
    records: ?Array<Object>,
    onPressItem: Function,
};
type State = {
    selected: Map<string, boolean>
};

export default class TransactionRecordList extends React.PureComponent<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: (new Map(): Map<string, boolean>)
        };
    }

    _keyExtractor = (item, index) => index.toString();

    _onPressItem = (item: Object) => {
        this.setState(state => {
            const selected = new Map(state.selected);
            selected.set(item.hash, !selected.get(item.hash)); // toggle
            return { selected };
        });

        if (this.props.onPressItem) {
            this.props.onPressItem(item);
        }
    };

    _renderItem = ({ item }) => (
        <LVTransactionRecordItem
            type={item.type}
            token={item.token.toUpperCase()}
            balance={item.balance}
            address={item.type == 'in' ? item.payer : item.receiver}
            datetime={item.datetime}
            state={item.state}
            selected={!!this.state.selected.get(item.hash)}
            onPressItem={() => {
                this._onPressItem(item);
            }}
        />
    );

    getScrollMetrics = () => {
        return this.refs.list._listRef._scrollMetrics;
    };

    render() {
        const { loading, records, style } = this.props;

        if (loading === true) {
            return <LVLoadingComponent />;
        } else {
            return (
                <FlatList
                    ref={'list'}
                    style={style}
                    data={records}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Separator insetRight={15} tintColor={LVColor.separateLine} />}
                    ListEmptyComponent={() => <LVEmptyListComponent />}
                />
            );
        }
    }
}

const LVEmptyListComponent = () => {
    const img = require('../../assets/images/no_transactions.png');
    const wh = Dimensions.get('window').height;
    const top = wh < 500 ? 4 : 64;
    const size = wh < 500 ? 44 : 60;
    const sep = wh < 500 ? 0 : 10;
    const font = wh < 500 ? LVSize.small : LVSize.default;

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image style={{ marginTop: top, width: size, height: size }} resizeMode="contain" source={img} />
            <Text style={{ marginTop: sep, fontSize: font, color: LVColor.text.grey1 }}>
                {LVStrings.transaction_records_no_data}
            </Text>
        </View>
    );
};

const LVLoadingComponent = () => {
    return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <ActivityIndicator size='small' />
        </View>
    );
};

type ItemProps = {
    type: string,
    token: string,
    balance: Object,
    address: string,
    datetime: string,
    state: ?string,
    onPressItem: ?Function
};

class LVTransactionRecordItem extends React.PureComponent<ItemProps> {

    render() {
        const { type, token, balance, address, datetime, state } = this.props;
        const typeImage = type === 'in' ? inImg : outImg;

        const prefix = type === 'in' ? '+' : '-';
        const amountString = prefix + StringUtils.beautifyBalanceShow(balance, token).result;

        //const
        const t = DateUtils.getTimePastFromNow(datetime);
        const timePast =
            t.avaiable === false
                ? datetime
                : t.years
                  ? t.years + ' ' + LVStrings.time_pass_years_ago
                  : t.months
                    ? t.months + ' ' + LVStrings.time_pass_months_ago
                    : t.days
                      ? t.days === 1 ? LVStrings.time_pass_yesterday : t.days + ' ' + LVStrings.time_pass_days_ago
                      : t.hours
                        ? t.hours + ' ' + LVStrings.time_pass_hours_ago
                        : t.minutes
                          ? t.minutes + ' ' + LVStrings.time_pass_minutes_ago
                          : LVStrings.time_pass_a_moment_ago;

        return (
            <TouchableOpacity style={[styles.record]} activeOpacity={0.7} onPress={this.props.onPressItem}>
                <View style={styles.info}>
                    <View style={styles.infoInner}>
                        <Image source={typeImage} />
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                            {StringUtils.converAddressToDisplayableText(address)}
                        </Text>
                    </View>
                    <View style={styles.infoInner}>
                        {state === 'ok' ? (
                            <Text style={styles.amountText}>{amountString}</Text>
                        ) : state === 'waiting' ? (
                            <Text style={styles.statusText}>{LVStrings.transaction_waiting}</Text>
                        ) : state === 'failed' ? (
                            <Text style={styles.statusText}>{LVStrings.transaction_failed}</Text>
                        ) : null}
                    </View>
                </View>

                <Text style={styles.timeText}>{timePast}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    record: {
        marginLeft: 12.5,
        marginRight: 12.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 60
    },
    info: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addressText: {
        marginLeft: 10,
        color: LVColor.text.grey1,
        fontSize: 15,
        textAlign: 'left'
    },
    timeText: {
        marginTop: 3,
        marginLeft: 30,
        color: LVColor.text.grey3,
        fontSize: 12,
        textAlign: 'left'
    },
    statusText: {
        color: LVColor.text.red,
        fontSize: 12,
        textAlign: 'right'
    },
    amountText: {
        color: LVColor.text.grey2,
        fontSize: 15,
        textAlign: 'right'
    },
    progress: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
