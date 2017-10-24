/*
 * Project: Venus
 * File: src/views/Assets/TransactionDetailsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';
import LVUtils, { StringUtils } from '../../utils';

const failureImg = require('../../assets/images/transaction_failure.png');
const waitingImg = require('../../assets/images/transaction_wating.png');
const receiptImg = require('../../assets/images/transaction_receipt.png');
const transferImg = require('../../assets/images/transaction_transfer.png');

export default class TransactionDetailsScreen extends Component {
    static lock = false;

    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    componentWillUnmount() {
        TransactionDetailsScreen.lock = false;
    }

    render() {
        const { transactionRecord } = this.props.navigation.state.params;
        const { block, hash, type, amount, payer, receiver, minnerFee, datetime, state } = transactionRecord;

        const is_failed = false;
        const symble = type === 'in' ? '+' : '-';
        const amountString = symble + StringUtils.convertAmountToCurrencyString(amount, ',', 8);
        const feeString = StringUtils.convertAmountToCurrencyString(minnerFee, ',', 8) + ' ETH';
        const remarks = transactionRecord.remarks || LVStrings.transaction_na;

        const typeImg = state === 'ok' ? (symble === '+' ? receiptImg : transferImg) : state === 'waiting' ? waitingImg : failureImg;

        //console.log(receiver);
        //9224A9f81Ac30F0E3B568553bf9a7372EE49548C

        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    left={require('../../assets/images/back_grey.png')}
                    title={LVStrings.transaction_details}
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ fontSize: LVSize.large, color: LVColor.text.grey1 }}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={typeImg} />
                        <Text style={styles.amount}>{amountString}</Text>
                    </View>
                    <View style={styles.details}>
                        <View style={{ width: '100%', paddingLeft: 15, paddingRight: 15 }}>
                            <LVSubTitleCell title={LVStrings.transaction_payer} value={'0x' + payer} />
                            <LVSubTitleCell title={LVStrings.transaction_receiver} value={'0x' + receiver} />
                            <LVSubTitleCell title={LVStrings.transaction_minner_fee} value={minnerFee + ' ETH'} />
                            <LVSubTitleCell title={LVStrings.transaction_remarks} value={remarks} />
                            {state === 'failed' && (
                                <Text style={styles.failureText}>{LVStrings.transaction_failure_message}</Text>
                            )}
                        </View>
                        {state === 'ok' && (
                            <View style={{ width: '100%', paddingLeft: 15, paddingRight: 15, marginBottom: 10 }}>
                                <LVRightDetailCell title={LVStrings.transaction_block_number} value={block} />
                                <LVRightDetailCell
                                    title={LVStrings.transaction_hash}
                                    value={StringUtils.converAddressToDisplayableText(hash, 7, 7)}
                                />
                                <LVRightDetailCell title={LVStrings.transaction_time} value={datetime} />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const LVSubTitleCell = ({ title, value }) => (
    <View style={{ height: 69, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ height: 8 }} />
        <Text style={{ fontSize: 14, textAlign: 'left', color: LVColor.primary }}>{title}</Text>
        <Text style={{ fontSize: 13, textAlign: 'left', color: LVColor.text.grey1 }}>{value}</Text>
        <View style={{ width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />
    </View>
);

const LVRightDetailCell = ({ title, value }) => (
    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, textAlign: 'left', color: LVColor.text.grey3 }}>{title}</Text>
        <Text style={{ fontSize: 12, textAlign: 'right', color: LVColor.text.grey3 }}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    header: {
        width: '100%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    details: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    image: {
        marginLeft: 15
    },
    amount: {
        marginLeft: 46,
        fontSize: LVSize.xxlarge,
        textAlign: 'right',
        fontWeight: '600',
        color: LVColor.text.grey1
    },
    failureText: {
        fontSize: LVSize.xsmall,
        textAlign: 'left',
        color: LVColor.text.red
    }
});
