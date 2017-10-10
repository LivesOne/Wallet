/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVGradientPanel from '../Common/LVGradientPanel';
import LVDetailTextCell from '../Common/LVDetailTextCell';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import MXTouchableImage from '../../components/MXTouchableImage';

import WalletInfoView from './WalletInfoView';
import WalletBalanceView from './WalletBalanceView';
import TransferRecordList, { testRecores } from './TransferRecordList';

const selectImg = require('../../assets/images/select_wallet.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        walletId: string,
        walletName: string,
        walletAddress: string,
        openSelectWallet: boolean,
        lvt: number,
        eth: number,
        lvtRmb: number,
        ethRmb: number,
        transferRecords: ?Array<Object>
    };

    constructor(props: any) {
        super(props);
        this.state = {
            walletId: '3',
            walletName: '傲游LivesToken',
            walletAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            openSelectWallet: false,
            lvt: 2100000,
            eth: 26.035,
            lvtRmb: 20000,
            ethRmb: 52000,
            transferRecords: testRecores
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.onWalletSelected = this.onWalletSelected.bind(this);
    }

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
        //this.props.navigation.navigate('WalletImport');
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    onWalletSelected = (walletObj: Object) => {
        this.setState({
            walletId: walletObj.id,
            walletName: walletObj.name,
            walletAddress: walletObj.address,
            openSelectWallet: false
        });
    };

    onPressShowAll = () => {
        //alert('show all records');
        this.props.navigation.navigate('TransferRecords', {
            walletName: this.state.walletName,
            walletAddress: this.state.walletAddress
        });
    };

    render() {
        const { walletName, walletAddress, lvt, eth, lvtRmb, ethRmb, transferRecords } = this.state;

        return (
            <View style={styles.container}>
                <LVGradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <View style={{ width: 27 }} />
                        <Text style={styles.navTitle}>{LVStrings.assets_title}</Text>
                        <MXTouchableImage style={{ width: 27 }} source={selectImg} onPress={this.onPressSelectWallet} />
                    </View>
                    <WalletInfoView style={styles.walletInfo} title={walletName} address={walletAddress} />
                    <WalletBalanceView style={styles.balance} lvt={lvt} eth={eth} extLvt={lvtRmb} extEth={ethRmb} />
                </LVGradientPanel>

                <LVDetailTextCell
                    style={styles.recent}
                    text={LVStrings.recent_records}
                    detailText={LVStrings.view_all_records}
                    onPress={this.onPressShowAll}
                />

                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />

                <TransferRecordList style={styles.list} records={transferRecords} />

                <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
                    selectedWalletId={this.state.walletId}
                    onSelected={this.onWalletSelected}
                />
            </View>
        );
    }
}

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
        height: 315,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: Window.width - 25,
        height: 64,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    walletInfo: {
        width: Window.width - 25
    },
    balance: {
        width: Window.width - 25,
        height: 150,
        marginTop: 15
    },
    recent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: LVColor.white
    },
    list: {
        width: '100%',
        backgroundColor: LVColor.white
    }
});

export default AssetsScreen;
