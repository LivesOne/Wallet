/*
 * Project: Venus
 * File: src/views/Assets/TransactionDetailsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';
import LVUtils, { StringUtils } from '../../utils';
import { LVBalanceShowView } from '../Common/LVBalanceShowView';
import Big from 'big.js';

const failureImg = require('../../assets/images/transaction_failure.png');
const waitingImg = require('../../assets/images/transaction_wating.png');
const receiptImg = require('../../assets/images/transaction_receipt.png');
const transferImg = require('../../assets/images/transaction_transfer.png');

type Props = { navigation: Object };

export default class TransactionDetailsScreen extends Component<Props> {
    static lock = false;

    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onPressCheckDetail = () => {
        const { transactionRecord } = this.props.navigation.state.params;
        const { hash } = transactionRecord;
        const url = 'https://etherscan.io/tx/' + hash;
        if (LVUtils.isNavigating()) { return; }
        this.props.navigation.navigate('WebView', { url: url, title: 'Transaction Information' });
    }

    render() {
        const { transactionRecord } = this.props.navigation.state.params;
        const { block, hash, type, token, amount, from, to, minnerFee, datetime, state } = transactionRecord;

        const is_failed = false;
        const prefix = type === 'in' ? '+' : '-';
        const hasShrink = StringUtils.beautifyBalanceShow(amount).hasShrink;
        const feeString = Big(minnerFee).toFixed() + ' ETH';
        const payerAddress = StringUtils.converAddressToDisplayableText(from, 9, 11);
        const receiverAddress = StringUtils.converAddressToDisplayableText(to, 9, 11);
        //const remarks = transactionRecord.remarks || LVStrings.transaction_na;

        const typeImg =
            state === 'ok'
                ? prefix === '+'
                    ? receiptImg
                    : transferImg
                : state === 'waiting'
                    ? waitingImg
                    : failureImg;

        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    left={require('../../assets/images/back_grey.png')}
                    title={LVStrings.transaction_details}
                    style={{ backgroundColor: LVColor.white }}
                    titleStyle={{ fontSize: LVSize.large, color: LVColor.text.grey2 }}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <LVTransDetailBalanceView prifix={prefix} balance={amount} token={token} hasShrink={hasShrink} />
                        <Image style={styles.image} source={typeImg} />
                    </View>
                    <View style={styles.details}>
                        <View style={{ width: '100%', paddingLeft: 15, paddingRight: 15 }}>
                            <LVSubTitleCell title={LVStrings.transaction_payer} value={payerAddress} />
                            <LVSubTitleCell title={LVStrings.transaction_receiver} value={receiverAddress} />
                            <LVSubTitleCell title={LVStrings.transaction_minner_fee} value={feeString} />
                            {state === 'failed' && (
                                <Text style={styles.failureText}>{LVStrings.transaction_failure_message}</Text>
                            )}
                            {state === 'notexist' && (
                                <Text style={styles.failureText}>{LVStrings.transaction_does_not_exist_message}</Text>
                            )}
                            {state === 'waiting' && (
                                <LVLinkText text={LVStrings.transaction_check_progress} onPress={this.onPressCheckDetail.bind(this)}/>
                            )}
                            {state === 'failed' && (
                                <LVLinkText text={LVStrings.transaction_check_detail} onPress={this.onPressCheckDetail.bind(this)}/>
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

const LVTransDetailBalanceView = ({ prifix, balance, token, hasShrink }) => (
    <View style={{ alignSelf: 'flex-end', marginLeft: 15, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
            <LVBalanceShowView
                title={LVStrings.show_detail_amount}
                unit={token.toUpperCase()}
                symble={prifix}
                balance={balance}
                textStyle={styles.balance}
                showSeparator={true}
            />
            {hasShrink && <Text style={styles.balance}>...</Text>}
            <Text style={styles.token}>{token.toUpperCase()}</Text>
        </View>
    </View>
);

const LVSubTitleCell = ({ title, value }) => (
    <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, textAlign: 'left', color: LVColor.text.grey2 }}>{title}</Text>
        <Text style={{ fontSize: 13, textAlign: 'right', color: LVColor.text.placeHolder }}>{value}</Text>
    </View>
);

const LVRightDetailCell = ({ title, value }) => (
    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, textAlign: 'left', color: LVColor.text.grey3 }}>{title}</Text>
        <Text style={{ fontSize: 12, textAlign: 'right', color: LVColor.text.grey3 }}>{value}</Text>
    </View>
);

const LVLinkText = ({ text, onPress }) => (
    <TouchableOpacity style={{marginTop: 16}} activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.transDetailLink}>{text}</Text>
    </TouchableOpacity>
)

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
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    header: {
        width: '100%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    details: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    image: {
        marginTop: 5,
        marginRight: 15
    },
    balance: {
        fontSize: LVSize.xxlarge,
        textAlign: 'right',
        fontFamily: 'DINAlternate-Bold',
        color: LVColor.text.grey2
    },
    token: {
        fontSize: LVSize.xsmall,
        fontFamily: 'DINAlternate-Bold',
        color: LVColor.text.grey1,
        alignSelf: 'flex-end',
        marginLeft: 5,
        marginBottom: 3
    },
    failureText: {
        fontSize: LVSize.xsmall,
        textAlign: 'left',
        color: LVColor.text.red
    },
    transDetailLink: {
        fontSize: 15,
        color: LVColor.text.yellow,
        textDecorationLine: 'underline'
    }
});
