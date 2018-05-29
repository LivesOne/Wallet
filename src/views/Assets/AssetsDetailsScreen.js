/*
 * Project: Venus
 * File: src/views/Assets/AssetsDetailsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import { PullView } from 'react-native-rk-pull-to-refresh';
import Moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-native-datepicker';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVUtils from '../../utils';
import LVStrings from '../../assets/localization';
import LVWalletBalanceHeader from '../Common/LVWalletBalanceHeader';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVConfiguration from '../../logic/LVConfiguration';
import LVWallet from '../../logic/LVWallet';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';

import TransactionRecordList from './TransactionRecordList';
import TransactionDetailsScreen from './TransactionDetailsScreen';

type Props = { navigation: Object };
type State = {
    wallet: LVWallet,
    startDate: string,
    endDate: string,
    transactionList: ?Array<LVTransactionRecord>
};

class AssetsDetailsScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet() || LVWallet.emptyWallet();
        this.state = {
            wallet: wallet,
            startDate: '',
            endDate: '',
            transactionList: LVTransactionRecordManager.records
        };
        this.onStartDateChange = this.onStartDateChange.bind(this);
        this.onEndDateChange = this.onEndDateChange.bind(this);
    }

    componentDidMount() {
        this.initFilterDate();
    }

    initFilterDate = async () => {
        const startDate = Moment().add(-2, 'days').format('YYYY-MM-DD');
        const endDate = Moment().format('YYYY-MM-DD');
        this.setState({ startDate: startDate, endDate: endDate });
    };

    onStartDateChange = (date: string) => {
        this.setState({ startDate: date });
    };

    onEndDateChange = (date: string) => {
        this.setState({ endDate: date });
    };

    onPressRecord = (record: Object) => {
        if (TransactionDetailsScreen.lock == false) {
            TransactionDetailsScreen.lock = true;
            this.props.navigation.navigate('TransactionDetails', {
                transactionRecord: record
            });
        }
    };

    async onPullRelease() {
        await LVTransactionRecordManager.refreshTransactionRecords();
        this.setState({ transactionList: LVTransactionRecordManager.records });
        this.refs.pull && this.refs.pull.resolveHandler();
    }

    render() {
        const { wallet, startDate, endDate, transactionList } = this.state;
        const { token } = this.props.navigation.state.params;

        const startTimestamp = Moment(startDate, 'YYYY-MM-DD').format('X');
        const endTimestamp = Moment(endDate, 'YYYY-MM-DD')
            .add(1, 'days')
            .format('X');

        const filteredList = transactionList
            ? transactionList.filter(item => item.timestamp >= startTimestamp && item.timestamp <= endTimestamp)
            : null;

        return (
            <View style={styles.container}>
                <View style={styles.topPanel}>
                    <MXNavigatorHeader
                        title={wallet.name}
                        style={{ backgroundColor: 'transparent' }}
                        titleStyle={{ fontSize: LVSize.large, color: LVColor.text.white }}
                        onLeftPress={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <LVWalletBalanceHeader style={styles.walletInfo} token={token} balance={wallet.getBalance(token)} />
                </View>

                <View style={styles.datePanel}>
                    <View style={styles.dateLeft}>
                        <Text style={styles.text}>{LVStrings.transaction_records_time}</Text>
                        <View style={{ marginLeft: 15, height: 20, width: 1, backgroundColor: '#ccc' }} />
                    </View>

                    <View style={styles.dateRight}>
                        <LVDataPicker date={startDate} min={null} max={endDate} onDateChange={this.onStartDateChange} />
                        <Text style={[styles.text, { marginLeft: 15, marginRight: 15 }]}>
                            {LVStrings.transaction_records_to}
                        </Text>
                        <LVDataPicker date={endDate} min={startDate} max={null} onDateChange={this.onEndDateChange} />
                    </View>
                </View>

                <TransactionRecordList style={styles.list} records={filteredList} onPressItem={this.onPressRecord} />
            </View>
        );
    }
}

const LVDataPicker = ({ date, min, max, onDateChange }) => {
    return (
        <DatePicker
            style={{ width: 100 }}
            customStyles={datePickerStyles}
            date={date}
            mode="date"
            format="YYYY-MM-DD"
            minDate={min || "2010-01-01"}
            maxDate={max || Moment().format('YYYY-MM-DD')}
            showIcon={false}
            confirmBtnText={LVStrings.common_confirm}
            cancelBtnText={LVStrings.common_cancel}
            onDateChange={onDateChange}
        />
    );
};

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Window.width,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topPanel: {
        width: Window.width,
        height: LVUtils.isIphoneX() ? 219 : 195,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.primary
    },
    walletInfo: {
        marginBottom: 15,
        width: Window.width - 25
    },
    datePanel: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.background.datePanel
    },
    dateLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12.5
    },
    dateRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 15,
        color: LVColor.text.grey1,
        backgroundColor: 'transparent'
    },
    list: {
        width: '100%',
        backgroundColor: LVColor.white
    }
});

const datePickerStyles = StyleSheet.create({
    dateInput: {
        borderWidth: 0
    },
    dateText: {
        color: LVColor.primary
    },
    btnTextConfirm: {
        color: LVColor.primary
    }
});

export default AssetsDetailsScreen;
