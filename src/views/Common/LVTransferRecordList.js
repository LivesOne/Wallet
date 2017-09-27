/*
 * Project: Venus
 * File: src/views/Common/LVTransferRecordList.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import { DateUtils } from '../../utils';
import * as Progress from 'react-native-progress';

/*
transferRecord: {
    id: string,                     // id of the record
    transfer_type: string,          // type of this transfer record, 'in' or 'out'    
    transfer_unit: string,          // 'LVT' or 'ETH'
    transfer_amount: number,
    transfer_address: string,
    transfer_datetime: string,
    transfer_completed: bool,
    transfer_checked_peers: number,
    transfer_total_check_peers: number,
}
*/

export const testRecores = [
    {
        id: 1,
        transfer_type: 'in',
        transfer_unit: 'LVT',
        transfer_amount: 50000,
        transfer_address: 'edc107416fc0be8c9de8751e02da21ca198fb25d',
        transfer_datetime: '2017-09-22 15:30',
        transfer_completed: false,
        transfer_checked_peers: 4,
        transfer_total_check_peers: 10
    },
    {
        id: 2,
        transfer_type: 'in',
        transfer_unit: 'LVT',
        transfer_amount: 70000,
        transfer_address: '379896a5474360a6dcedea906e5eb2975e50b702',
        transfer_datetime: '2017-09-21 12:30',
        transfer_completed: true
    },
    {
        id: 3,
        transfer_type: 'out',
        transfer_unit: 'LVT',
        transfer_amount: 3000,
        transfer_address: '517f64c8669b0dd375490f7f1ae9a36fb8cb2cf7',
        transfer_datetime: '2017-09-20 09:21',
        transfer_completed: true
    }
];

const inImg = require('../../assets/images/transfer_in.png');
const outImg = require('../../assets/images/transfer_out.png');

class LVTransferRecordItem extends React.PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        address: PropTypes.string.isRequired,
        datetime: PropTypes.string,
        completed: PropTypes.bool,
        checked_peers: PropTypes.number,
        total_check_peers: PropTypes.number,
        onPressItem: PropTypes.func
    };

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {
        const { type, unit, amount, address, datetime, completed, checked_peers, total_check_peers } = this.props;
        const typeImage = type === 'in' ? inImg : outImg;

        const prefix = type === 'in' ? '+' : '-';
        const amountString = prefix + amount + ' ' + unit;

        //const
        const t = DateUtils.getTimePastFrom(datetime);
        const timePast = t.years
            ? t.years + ' ' + LVStrings.time_pass_years_ago
            : t.months
              ? t.months + ' ' + LVStrings.time_pass_months_ago
              : t.days
                ? t.days === 1 ? LVStrings.time_pass_yesterday : t.days + ' ' + LVStrings.time_pass_days_ago
                : t.hours
                  ? t.hours + ' ' + LVStrings.time_pass_hours_ago
                  : t.minutes ? t.minutes + ' ' + LVStrings.time_pass_minutes_ago : LVStrings.time_pass_a_moment_ago;

        const progressRate = total_check_peers > 0 ? checked_peers / total_check_peers : 0;

        return (
            <TouchableOpacity
                style={[styles.record, completed ? styles.normalRecord : styles.uncompletedRecord]}
                activeOpacity={0.7}
                onPress={this._onPress}
            >
                <View style={styles.info}>
                    <View style={styles.infoInner}>
                        <Image source={typeImage} />
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                            {address.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.infoInner}>
                        {completed ? (
                            <Text style={styles.amountText}>{amountString}</Text>
                        ) : (
                            <Text style={styles.statusText}>{LVStrings.transfer_waiting}</Text>
                        )}
                    </View>
                </View>

                <Text style={styles.timeText}>{timePast}</Text>

                {completed || (
                    <View style={styles.progress}>
                        <Progress.Bar
                            style={{ marginLeft: 30, width: '75%' }}
                            progress={progressRate}
                            height={4}
                            width={null}
                            color={LVColor.progressBar.fill}
                            unfilledColor={LVColor.progressBar.unfill}
                            borderWidth={0}
                        />
                        <LVSchedule value={checked_peers} total={total_check_peers} />
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}

const LVSchedule = ({ value, total }) => {
    const sstyles = StyleSheet.create({
        normal: {
            fontSize: 12,
            color: LVColor.text.grey3
        },
        active: {
            color: LVColor.text.grey1
        }
    });

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={sstyles.normal}>(</Text>
            <Text style={[sstyles.normal, sstyles.active]}>{value}</Text>
            <Text style={sstyles.normal}>/</Text>
            <Text style={sstyles.normal}>{total}</Text>
            <Text style={sstyles.normal}>)</Text>
        </View>
    );
};

class LVTransferRecordList extends React.PureComponent {
    static propTypes = {
        records: PropTypes.arrayOf(PropTypes.object)
    };

    state = { selected: (new Map(): Map<string, boolean>) };

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: string) => {
        this.setState(state => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return { selected };
        });
    };

    _itemSeparator = () => (
        <View
            style={{
                alignSelf: 'center',
                width: '90%',
                height: StyleSheet.hairlineWidth,
                backgroundColor: LVColor.separateLine
            }}
        />
    );

    _renderItem = ({ item }) => (
        <LVTransferRecordItem
            id={item.id}
            type={item.transfer_type}
            unit={item.transfer_unit}
            amount={item.transfer_amount}
            address={item.transfer_address}
            datetime={item.transfer_datetime}
            completed={item.transfer_completed}
            checked_peers={item.transfer_checked_peers}
            total_check_peers={item.transfer_total_check_peers}
            selected={!!this.state.selected.get(item.id)}
            onPressItem={this._onPressItem}
        />
    );

    render() {
        return (
            <FlatList
                style={this.props.style}
                data={this.props.records}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ItemSeparatorComponent={this._itemSeparator}
            />
        );
    }
}

const styles = StyleSheet.create({
    record: {
        marginLeft: 12.5,
        marginRight: 12.5,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    normalRecord: {
        height: 60
    },
    uncompletedRecord: {
        height: 70
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
        width: 110,
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

export default LVTransferRecordList;
