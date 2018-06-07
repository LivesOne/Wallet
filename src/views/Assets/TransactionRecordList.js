/*
 * Project: Venus
 * File: src/views/Assets/TransactionRecordList.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    ViewPropTypes,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import Big from 'big.js';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import PLUtils, { DateUtils, StringUtils } from '../../utils';
import * as LVContactManager from '../../logic/LVContactManager';

const inImg = require('../../assets/images/transfer_in.png');
const outImg = require('../../assets/images/transfer_out.png');

type Props = {
    style: ViewPropTypes.style,
    records: ?Array<Object>,
    refreshing: boolean,
    onRefresh: Function,
    onPressItem: Function
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
        if (LVContactManager.instance.contacts.length === 0) {
            LVContactManager.instance.loadLocalContacts();
        }
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
            balance={item.amount}
            address={item.type == 'in' ? item.from : item.to}
            datetime={item.datetime}
            state={item.state}
            selected={!!this.state.selected.get(item.hash)}
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
        const { records, style } = this.props;

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
                ListEmptyComponent={() => <LVEmptyListComponent />}
                refreshControl={
                    <RefreshControl refreshing={this.props.refreshing} onRefresh={this._onRefresh.bind(this)} />
                }
            />
        );
    }
}

const LVEmptyListComponent = () => {
    const img = require('../../assets/images/no_transactions.png');
    const wh = Dimensions.get('window').height;
    const size = wh < 500 ? 44 : 60;
    const font = wh < 500 ? LVSize.small : LVSize.default;
    const height = wh - (PLUtils.isIphoneX() ? 295 + 50 + 89 : 195 + 50 + 55);

    return (
        <View style={{ flex: 1, height: height, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ marginTop: 0, width: size, height: size }} resizeMode="contain" source={img} />
            <Text style={{ marginTop: 10, fontSize: font, color: LVColor.text.grey1 }}>
                {LVStrings.transaction_records_no_data}
            </Text>
        </View>
    );
};

type ItemProps = {
    type: string,
    token: string,
    balance: Big,
    address: string,
    datetime: string,
    state: ?string,
    onPressItem: ?Function
};

class LVTransactionRecordItem extends React.PureComponent<ItemProps> {
    render() {
        const { type, token, balance, address, datetime, state } = this.props;
        const typeIcon = type === 'in' ? inImg : outImg;
        const typeString = type === 'in' ? LVStrings.receive : LVStrings.transfer;

        const prefix = type === 'in' ? '+' : '-';
        const amountString = prefix + StringUtils.beautifyBalanceShow(balance).result;
        const timePast = DateUtils.getTimePastFromNow(datetime);
        const addressText = StringUtils.converAddressToDisplayableText(address, 3, 4);

        const contact = LVContactManager.instance.contacts.find(c => c.address.toUpperCase() === '0X' + address.toUpperCase());
        const nickName = contact ? contact.name : '';

        return (
            <TouchableOpacity style={[styles.record]} activeOpacity={0.7} onPress={this.props.onPressItem}>
                <View style={styles.recordType}>
                    <Image style={styles.typeIcon} source={typeIcon} resizeMode="contain" />
                    <Text style={styles.typeText}>{typeString}</Text>
                </View>
                <View style={styles.recordInfo}>
                    <View style={[styles.recordInfoLine, { height: 26 }]}>
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{addressText}</Text>
                        {state === 'ok' ? (
                            <View style={styles.amountView}>
                                <Text style={styles.amountText} numberOfLines={1}>{amountString}</Text>
                                <Text style={styles.tokenText} numberOfLines={1}>{ ' ' + token}</Text>
                            </View>
                        ) : state === 'waiting' ? (
                            <Text style={styles.statusText}>{LVStrings.transaction_waiting}</Text>
                        ) : state === 'failed' ? (
                            <Text style={styles.statusText}>{LVStrings.transaction_failed}</Text>
                        ) : state === 'notexist' ? (
                            <Text style={styles.statusText}>{LVStrings.transaction_does_not_exist}</Text>
                        ) : (
                            <View />
                        )}
                    </View>
                    <View style={styles.recordInfoLine}>
                        <Text style={styles.nicknameText} numberOfLines={1} ellipsizeMode="middle">{nickName}</Text>
                        <Text style={styles.timeText}>{timePast}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    record: {
        height: 80,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: LVColor.white
    },
    recordType: {
        height: 26,
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    recordInfo: {
        flex: 1,
        marginLeft: 5,
        marginTop: 16,
        marginBottom: 16
    },
    recordInfoLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    typeIcon: {
        width: 26,
        height: 26
    },
    typeText: {
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
        color: LVColor.text.grey1
    },
    addressText: {
        marginRight: 5,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'left',
        color: LVColor.text.grey1
    },
    amountView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    amountText: {
        flex: 1,
        color: LVColor.text.grey2,
        fontSize: 15,
        fontFamily: 'DINAlternate-Bold',
        textAlign: 'right'
    },
    tokenText: {
        color: LVColor.text.grey2,
        fontSize: 14,
        fontFamily: 'DINAlternate-Bold',
        textAlign: 'right'
    },
    statusText: {
        flex: 1,
        color: LVColor.text.red,
        fontSize: 12,
        textAlign: 'right'
    },
    nicknameText: {
        flex: 3,
        fontSize: 12,
        textAlign: 'left',
        color: LVColor.text.placeHolder
    },
    timeText: {
        flex: 2,
        fontSize: 12,
        textAlign: 'right',
        color: LVColor.text.placeHolder
    }
});
