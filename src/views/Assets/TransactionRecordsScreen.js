/*
 * Project: Venus
 * File: src/views/Assets/TransactionRecordsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-native-datepicker';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVGradientPanel from '../Common/LVGradientPanel';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVConfiguration from '../../logic/LVConfiguration';
import LVWalletManager from '../../logic/LVWalletManager';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';

import WalletInfoView from './WalletInfoView';
import TransactionRecordList from './TransactionRecordList';

class TransactionRecordsScreen extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
        startDate: string,
        endDate: string,
        transactionList: ?Array<LVTransactionRecord>
    };

    constructor(props: any) {
        super(props);
        this.state = {
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
        const startDate = await LVConfiguration.lastTransactionRecordsFilterStartDate();
        const endDate = await LVConfiguration.lastTransactionRecordsFilterEndDate();
        this.setState({ startDate: startDate, endDate: endDate });
    };

    onStartDateChange = (date: string) => {
        this.setState({ startDate: date });
        LVConfiguration.setLastTransactionRecordsFilterStartDate(date);
    };

    onEndDateChange = (date: string) => {
        this.setState({ endDate: date });
        LVConfiguration.setLastTransactionRecordsFilterEndDate(date);
    };

    onPressRecord = (record: Object) => {
        this.props.navigation.navigate('TransactionDetails', {
            transactionRecord: record
        });
    };

    render() {
        const wallet = LVWalletManager.getSelectedWallet();
        const walletName = wallet && wallet.name;
        const walletAddress = wallet && wallet.address;
        const { startDate, endDate, transactionList } = this.state;

        const startTimestamp = Moment(startDate, 'YYYY-MM-DD').format('X');
        const endTimestamp = Moment(endDate, 'YYYY-MM-DD').add(1, 'days').format('X');

        const filteredList = transactionList
            ? transactionList.filter(item => item.timestamp >= startTimestamp && item.timestamp <= endTimestamp)
            : null;

        return (
            <View style={styles.container}>
                <LVGradientPanel style={styles.gradient}>
                    <MXNavigatorHeader
                        title={LVStrings.transaction_records}
                        style={{ backgroundColor: 'transparent' }}
                        titleStyle={{ fontSize: LVSize.large, color: LVColor.text.white }}
                        onLeftPress={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <WalletInfoView style={styles.walletInfo} title={walletName} address={walletAddress} />
                </LVGradientPanel>

                <View style={styles.datePanel}>
                    <View style={styles.dateLeft}>
                        <Text style={styles.text}>{LVStrings.transaction_records_time}</Text>
                        <View style={{ marginLeft: 15, height: 20, width: 1, backgroundColor: '#ccc' }} />
                    </View>

                    <View style={styles.dateRight}>
                        <LVDataPicker date={startDate} onDateChange={this.onStartDateChange} />
                        <Text style={[styles.text, { marginLeft: 15, marginRight: 15 }]}>
                            {LVStrings.transaction_records_to}
                        </Text>
                        <LVDataPicker date={endDate} onDateChange={this.onEndDateChange} />
                    </View>
                </View>

                <TransactionRecordList style={styles.list} records={filteredList} onPressItem={this.onPressRecord} />
            </View>
        );
    }
}

const LVDataPicker = ({ date, onDateChange }) => {
    return (
        <DatePicker
            style={{ width: 100 }}
            customStyles={datePickerStyles}
            date={date}
            mode="date"
            format="YYYY-MM-DD"
            minDate="2010-01-01"
            maxDate={Moment().format('YYYY-MM-DD')}
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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    gradient: {
        width: '100%',
        height: 160,
        justifyContent: 'space-between',
        alignItems: 'center'
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

export default TransactionRecordsScreen;
