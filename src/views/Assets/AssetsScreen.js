/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { AppState, StyleSheet, Dimensions, Platform, View, Text } from 'react-native';
import { PullView } from 'react-native-rk-pull-to-refresh';
import Toast from 'react-native-root-toast';
import Moment from 'moment';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVDialog from '../Common/LVDialog';
import LVDetailTextCell from '../Common/LVDetailTextCell';
import LVRefreshIndicator from '../Common/LVRefreshIndicator';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVMarketInfo from '../../logic/LVMarketInfo';
import LVNetworking from '../../logic/LVNetworking';
import LVPersistent from '../../logic/LVPersistent';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import LVTransactionRecordManager, { LVTransactionRecord } from '../../logic/LVTransactionRecordManager';

import WalletInfoView from './WalletInfoView';
import WalletBalanceView from './WalletBalanceView';
import TransactionRecordList from './TransactionRecordList';
import TransactionDetailsScreen from './TransactionDetailsScreen';

const selectImg = require('../../assets/images/select_wallet.png');
const LVLastAssetsRefreshTimeKey = '@Venus:LastAssetsRefreshTime';

const isIOS = Platform.OS === 'ios';

type Props = { navigation: Object };
type State = {
    appState: string,
    wallet: ?Object,
    transactionList: ?Array<LVTransactionRecord>,
    openSelectWallet: boolean,
    showIndicator: boolean,
};

class AssetsScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null
    };

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            appState: AppState.currentState || 'inactive',
            wallet: wallet,
            transactionList: null,
            openSelectWallet: false,
            showIndicator: true,
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
        this.handleRecordsChanged = this.handleRecordsChanged.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        LVNotificationCenter.addObserver(this, LVNotification.transcationRecordsChanged, this.handleRecordsChanged);
        LVNotificationCenter.addObserver(this, LVNotification.walletsNumberChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);

        this.refs.pull && this.refs.pull.startRefresh();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        LVNotificationCenter.removeObservers(this);
    }

    async onPullRelease() {
        try {
            await LVTransactionRecordManager.refreshTransactionRecords();
            await LVWalletManager.updateWalletBalance();
            await LVPersistent.setNumber(LVLastAssetsRefreshTimeKey, Moment().format('X'));

            const wallet = LVWalletManager.getSelectedWallet();
            this.setState({ transactionList: LVTransactionRecordManager.records, wallet: wallet });
    
            this.refs.pull && this.refs.pull.finishRefresh();
    
            setTimeout(async () => {
                this.setState({ showIndicator: false });
            }, 500);

        } catch (error) {
            this.refs.pull && this.refs.pull.finishRefresh();
            Toast.show(error.message);
        }
    }

    handleAppStateChange = async (nextAppState: string) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');

            // refresh
            const lastRefreshTime = await LVPersistent.getNumber(LVLastAssetsRefreshTimeKey);
            const currentTime = Moment().format('X');
            if (currentTime - lastRefreshTime > 120) {
                this.refs.pull && this.refs.pull.startRefresh();
            }
        }
        this.setState({ appState: nextAppState });
    };

    handleWalletChange = async () => {
        await LVWalletManager.updateWalletBalance();

        const wallet = LVWalletManager.getSelectedWallet();
        const newAddress = wallet ? wallet.address : '';
        const curAddress = this.state.wallet ? this.state.wallet.address : '';

        this.setState({ wallet: wallet, showIndicator: true });

        if (curAddress != newAddress) {
            LVTransactionRecordManager.clear();
            this.setState({ transactionList: LVTransactionRecordManager.records });
            setTimeout(async () => {
                this.refs.pull && this.refs.pull.startRefresh();
            }, 500);
        }
    };

    handleRecordsChanged = () => {
        const wallet = LVWalletManager.getSelectedWallet();
        this.setState({ transactionList: null });
        this.setState({ transactionList: LVTransactionRecordManager.records, wallet: wallet });
    };

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    _processing_showall_pressed = false;
    onPressShowAll = () => {
        if (this._processing_showall_pressed) {
            return;
        }
        this._processing_showall_pressed = true;

        if (this.state.wallet) {
            this.props.navigation.navigate('TransactionRecords');
        }

        setTimeout(async () => {
            this._processing_showall_pressed = false;
        }, 200);
    };

    onPressRecord = (record: Object) => {
        if (TransactionDetailsScreen.lock == false) {
            TransactionDetailsScreen.lock = true;
            this.props.navigation.navigate('TransactionDetails', {
                transactionRecord: record
            });
        }
    };

    shouldAdjustForIOS() {
        const wallet = this.state.wallet || {};
        var b = isIOS && wallet.lvt.eq(0);
        console.log('should adjust = ' + wallet.lvt);
        return isIOS  && wallet.lvt.eq(0);
    }

    render() {
        const { transactionList } = this.state;
        const wallet = this.state.wallet || {};

        return (
            <View style={styles.container}>
                <View style={[styles.topPanel, {height: this.shouldAdjustForIOS() ? 250 : 315  }]}>
                    <PullView
                        ref={'pull'}
                        style={[styles.topPanel, {height: this.shouldAdjustForIOS() ? 250 : 315}]}
                        onPullRelease={this.onPullRelease.bind(this)}
                        topIndicatorHeight={LVRefreshIndicator.indicatorHeight}
                        topIndicatorRender={this.topIndicatorRender.bind(this)}
                        onPullStateChangeHeight={this.onPullStateChangeHeight.bind(this)}
                    >
                        <View style={styles.gradient}>
                            <MXNavigatorHeader
                                style={{ backgroundColor: 'transparent' }}
                                title={LVStrings.assets_title}
                                titleStyle={{color: '#ffffff', fontSize: LVSize.large}}
                                hideLeft={true}
                                right={selectImg}
                                onRightPress={this.onPressSelectWallet}
                            />
                            <WalletInfoView style={styles.walletInfo} title={wallet.name} address={wallet.address} />
                            <WalletBalanceView 
                                style={[styles.balance, {height: this.shouldAdjustForIOS() ? 150 /2 : 150,}]} 
                                lvt={wallet.lvt} eth={wallet.eth} />
                        </View>
                    </PullView>
                </View>

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
            </View>
        );
    }

    topIndicatorRender() {
        return this.state.showIndicator ? <LVRefreshIndicator /> : null;
    }

    onPullStateChangeHeight = (pulling: boolean, pullok: boolean, pullrelease: boolean, moveHeight: number) => {
        if (pulling) {
            if (this.state.showIndicator === false) {
                this.setState({ showIndicator: true });
            }
        } else if (pullok) {
        } else if (pullrelease) {
        }
    };
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
        width: Window.width,
        height: 315
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.primary
    },
    walletInfo: {
        width: Window.width - 25
    },
    balance: {
        width: Window.width - 25,
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

export default AssetsScreen;
