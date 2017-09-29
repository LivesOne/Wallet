/*
 * Project: Venus
 * File: src/views/Assets/TransferRecordsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVGradientPanel from '../Common/LVGradientPanel';

class TransferRecordsScreen extends Component {
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

    static navigationOptions = {
        header: null
    };

    state: {
        walletId: string,
        transferRecords: ?Array<Object>
    };

    render() {
        return (
            <View />
        );
        // const { walletName, walletAddress, lvt, eth, lvtRmb, ethRmb, transferRecords } = this.state;

        // return (
        //     <View style={styles.container}>
        //         <LVGradientPanel style={styles.gradient}>
        //             <WalletInfoView style={styles.walletInfo} title={walletName} address={walletAddress} />
        //             <WalletBalanceView style={styles.balance} lvt={lvt} eth={eth} extLvt={lvtRmb} extEth={ethRmb} />
        //         </LVGradientPanel>

        //         <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />

        //         <TransferRecordList style={styles.list} records={transferRecords} />
        //     </View>
        // );
    }
}

export default TransferRecordsScreen;