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
import LVNetworking from '../../logic/LVNetworking';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';

import WalletInfoView from './WalletInfoView';
import WalletBalanceView from './WalletBalanceView';
import TransactionRecordList, { testRecores } from './TransactionRecordList';

const selectImg = require('../../assets/images/select_wallet.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        wallet: ?Object,
        openSelectWallet: boolean,
        transferRecords: ?Array<Object>
    };

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            openSelectWallet: false,
            transferRecords: testRecores
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        this.refetchWalletDatas();
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }

    refetchWalletDatas = async () => {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                const lvt = await LVNetworking.fetchBalance(wallet.address, 'lvt');
                const eth = await LVNetworking.fetchBalance(wallet.address, 'eth');

                console.log('lvt = ' + lvt + ', eth = ' + eth);

                wallet.lvt = lvt ? parseFloat(lvt) : 0;
                wallet.eth = eth ? parseFloat(eth) : 0;
                this.setState({wallet: wallet});

                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
                LVWalletManager.saveToDisk();
            } catch (error) {
                console.log('error in refetch wallet datas : ' + error);
            }
        }
        
    }

    handleWalletChange = () => {
        this.refetchWalletDatas();
    }

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    onPressShowAll = () => {
        this.props.navigation.navigate('TransactionRecords');
    };

    onPressRecord = (record: Object) => {
        this.props.navigation.navigate('TransactionDetails', {
            transactionRecord: record
        });
    };

    render() {
        const { transferRecords } = this.state;
        const wallet = this.state.wallet || {};

        return (
            <View style={styles.container}>
                <LVGradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <View style={{ width: 27 }} />
                        <Text style={styles.navTitle}>{LVStrings.assets_title}</Text>
                        <MXTouchableImage style={{ width: 27 }} source={selectImg} onPress={this.onPressSelectWallet} />
                    </View>
                    <WalletInfoView style={styles.walletInfo} title={wallet.name} address={wallet.address} />
                    <WalletBalanceView style={styles.balance} lvt={wallet.lvt} eth={wallet.eth} extLvt={0} extEth={0} />
                </LVGradientPanel>

                <LVDetailTextCell
                    style={styles.recent}
                    text={LVStrings.recent_records}
                    detailText={LVStrings.view_all_records}
                    onPress={this.onPressShowAll}
                />

                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />

                <TransactionRecordList style={styles.list} records={transferRecords} onPressItem={this.onPressRecord} />

                <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
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
