/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform,
    ViewPropTypes,
    View,
    Text,
    Image,
    ScrollView,
    RefreshControl,
    PanResponder
} from 'react-native';
import PropTypes from 'prop-types';
import { PullView } from 'react-native-rk-pull-to-refresh';
import * as Progress from 'react-native-progress';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVGradientPanel from '../Common/LVGradientPanel';
import LVDetailTextCell from '../Common/LVDetailTextCell';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import MXTouchableImage from '../../components/MXTouchableImage';
import LVMarketInfo from '../../logic/LVMarketInfo';
import LVNetworking from '../../logic/LVNetworking';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';

import WalletInfoView from './WalletInfoView';
import WalletBalanceView from './WalletBalanceView';
import TransactionRecordList from './TransactionRecordList';

const selectImg = require('../../assets/images/select_wallet.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        wallet: ?Object,
        extEth: number,
        extLvt: number,
        reloading: boolean,
        transactionList: ?Array<LVTransactionRecord>,
        openSelectWallet: boolean
    };

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            extEth: 0,
            extLvt: 0,
            reloading: false,
            transactionList: null,
            openSelectWallet: false
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
        this.handleRecordsChanged = this.handleRecordsChanged.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.transcationRecordsChanged, this.handleRecordsChanged);
        LVNotificationCenter.addObserver(this, LVNotification.walletsNumberChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }

    refreshWalletDatas = async () => {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                const lvt = await LVNetworking.fetchBalance(wallet.address, 'lvt');
                const eth = await LVNetworking.fetchBalance(wallet.address, 'eth');

                // await LVMarketInfo.updateExchangeRateIfNecessary();
                // const extEth = eth * LVMarketInfo.usd_per_eth;
                // const extLvt = lvt / LVMarketInfo.lvt_per_eth * LVMarketInfo.usd_per_eth;

                wallet.lvt = lvt ? parseFloat(lvt) : 0;
                wallet.eth = eth ? parseFloat(eth) : 0;
                this.setState({ wallet: wallet, extEth: 0, extLvt: 0 });

                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
                LVWalletManager.saveToDisk();
            } catch (error) {
                console.log('error in refresh wallet datas : ' + error);
            }
        }
    };

    refreshTransactionList = async () => {
        await LVTransactionRecordManager.refreshTransactionRecords();
        this.setState({ transactionList: LVTransactionRecordManager.records });
    };

    handleWalletChange = async () => {
        await this.refreshWalletDatas();
        await this.refreshTransactionList();
    };

    handleRecordsChanged = () => {
        this.setState({ transactionList: null });
        this.setState({ transactionList: LVTransactionRecordManager.records });
    };

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    onPressShowAll = () => {
        if (this.state.wallet) {
            this.props.navigation.navigate('TransactionRecords');
        }
    };

    onPressRecord = (record: Object) => {
        this.props.navigation.navigate('TransactionDetails', {
            transactionRecord: record
        });
    };

    async onRefresh() {
        await this.refreshWalletDatas();
        await this.refreshTransactionList();
        this.setState({ reloading: false });
    }

    render() {
        const { transactionList, extEth, extLvt } = this.state;
        const wallet = this.state.wallet || {};

        return (
            <LVAssetsContainer style={{ flex: 1, width: Window.width }} onRefresh={this.onRefresh.bind(this)}>
                <LVGradientPanel style={styles.topPanel}>
                    <View style={styles.nav}>
                        <View style={{ width: 27 }} />
                        <Text style={styles.navTitle}>{LVStrings.assets_title}</Text>
                        <MXTouchableImage style={{ width: 27 }} source={selectImg} onPress={this.onPressSelectWallet} />
                    </View>
                    <WalletInfoView style={styles.walletInfo} title={wallet.name} address={wallet.address} />
                    <WalletBalanceView style={styles.balance} lvt={wallet.lvt} eth={wallet.eth} extLvt={0} extEth={0} />
                </LVGradientPanel>

                <View style={styles.bottomPanel}>
                    <LVDetailTextCell
                        style={styles.recent}
                        text={LVStrings.recent_records}
                        detailText={LVStrings.view_all_records}
                        onPress={this.onPressShowAll}
                    />

                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />

                    <TransactionRecordList
                        style={styles.list}
                        records={transactionList}
                        onPressItem={this.onPressRecord}
                    />
                </View>

                <LVSelectWalletModal isOpen={this.state.openSelectWallet} onClosed={this.onSelectWalletClosed} />
            </LVAssetsContainer>
        );
    }
}

const topIndicatorHeight = 100;

class LVAssetsContainer extends Component {
    static propTypes = {
        onRefresh: PropTypes.func
    };

    componentDidMount() {
        this.pull && this.pull.beginRefresh()
    }

    onPullRelease = async () => {
        await this.props.onRefresh();
        this.pull && this.pull.resolveHandler();
    };

    render() {
        if (Platform.OS === 'ios') {
            return (
                <PullView
                    ref={c => (this.pull = c)}
                    {...this.props}
                    onPullRelease={this.onPullRelease.bind(this)}
                    topIndicatorHeight={topIndicatorHeight}
                    topIndicatorRender={this.topIndicatorRender.bind(this)}
                >
                    {this.props.children}
                </PullView>
            );
        } else {
            return (
                <ScrollView
                    {...this.props}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshing}
                            onRefresh={this.props.onRefresh}
                            tintColor="#fff"
                            colors={[LVColor.primary]}
                            progressBackgroundColor="#fff"
                        />
                    }
                >
                    {this.props.children}
                </ScrollView>
            );
        }
    }

    topIndicatorRender() {
        return (
            <View style={indicatorStyles.container}>
                <View style={indicatorStyles.circle}>
                    <Progress.CircleSnail size={26} color={[LVColor.primary]} />
                </View>
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
    topPanel: {
        width: '100%',
        height: 315,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: Window.width - 25,
        height: 64,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
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
    bottomPanel: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LVColor.separateLine
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

const CIRCLE_SIZE = 36;

var indicatorStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: topIndicatorHeight
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: '#ACBFE5',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LVColor.white
    }
});

export default AssetsScreen;
