/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { AppState, StyleSheet, Dimensions, Platform, StatusBar, ListView, RefreshControl, View, Text , NativeModules} from 'react-native';
import Toast from 'react-native-root-toast';
import Moment from 'moment';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVUtils from '../../utils';
import LVStrings from '../../assets/localization';
import LVDialog, { LVConfirmDialog } from '../Common/LVDialog';
import LVWalletHeader from '../Common/LVWalletHeader';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';
import LVTransactionRecordManager from '../../logic/LVTransactionRecordManager';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import MXTouchableImage from '../../components/MXTouchableImage';
import LVWallet from '../../logic/LVWallet';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNetworking from '../../logic/LVNetworking';
import LVPersistent from '../../logic/LVPersistent';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';

import AssetsBalanceList from './AssetsBalanceList';
import TransactionRecordList from './TransactionRecordList';
import TransactionDetailsScreen from './TransactionDetailsScreen';
import LVConfiguration from '../../logic/LVConfiguration';

const selectImg = require('../../assets/images/select_wallet.png');
const addTokenImg = require('../../assets/images/assets_add_token.png');
const LVLastAssetsRefreshTimeKey = '@Venus:LastAssetsRefreshTime';

const isIOS = Platform.OS === 'ios';

type Props = { navigation: Object };
type State = {
    appState: string,
    wallet: ?LVWallet,
    openSelectWallet: boolean,
    refreshing: boolean,
    authTypeString : string,
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
            openSelectWallet: false,
            refreshing: false,
            authTypeString : LVStrings.auth_mine_use_password,
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleWalletChange  = this.handleWalletChange.bind(this);
        this.handleBalanceChange = this.handleBalanceChange.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        LVNotificationCenter.addObserver(this, LVNotification.walletsNumberChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.balanceChanged, this.handleBalanceChange);

        this.refreshBalance();
        this.initSetAuthDialog();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        LVNotificationCenter.removeObservers(this);
    }

    handleAppStateChange = async (nextAppState: string) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');

            // refresh
            const lastRefreshTime = await LVPersistent.getNumber(LVLastAssetsRefreshTimeKey);
            const currentTime = Moment().format('X');
            if (currentTime - lastRefreshTime > 120) {
                this.refreshBalance();
            }
        }
        this.setState({ appState: nextAppState });
    };

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    handleWalletChange = () => {
        this.setState({ wallet: LVWalletManager.getSelectedWallet() });
    };

    handleBalanceChange = () => {
        this.setState({ wallet: LVWalletManager.getSelectedWallet() });
    };

    handleStartAuth = () => {
        LVConfiguration.setNeedAuthLogin(true);
    }

    onPressHeader = () => {
        if (LVUtils.isNavigating()) { return }
        this.props.navigation.navigate('Receive');
    }

    onPressAddTokenToAssets = () => {
        if (LVUtils.isNavigating()) { return }
        this.props.navigation.navigate('TokenList');
    }

    onPressAssetsDetail = (token: string) => {
        if (this.state.wallet) {
            this.props.navigation.navigate('AssetsDetails', { token: token });
        }
    };

    async initSetAuthDialog(){
        let hasSet = await LVConfiguration.getHasSetAuth();
        let authTypeString = "";
        try {
            const authSupportString = await NativeModules.LVReactExport.getAuthSupport();
            const authSupport = JSON.parse(authSupportString);
            if (authSupport.faceid === true) {
                authTypeString = LVStrings.auth_use_face_id;
            } else if (authSupport.touchid === true) {
                authTypeString = LVStrings.auth_use_finger;
            } else {
                authTypeString = LVStrings.auth_mine_use_password;
            }
        } catch (error) {

        }
        this.setState({
            authTypeString : authTypeString,
        });
        if(!hasSet){
            this.refs.startAuthDialog.show();
            LVConfiguration.setHasSetAuth(true);
        }
    }

    async refreshBalance() {
        this.setState({ refreshing: true });

        try {
            if (this.state.wallet && this.state.wallet.holding_list.length > 0) {
                if (LVTransactionRecordManager.records.length === 0) {
                    await LVTransactionRecordManager.loadRecordsFromLocal();
                }
    
                const tokens = this.state.wallet.balance_list.map(b => b.token);
                for (var token of tokens) {
                    await LVTransactionRecordManager.refreshInProgressTransactionRecords(token);
                }
            }
    
            const success = await LVWalletManager.updateSelectedWalletBalance();
            if (success) {
                await LVPersistent.setNumber(LVLastAssetsRefreshTimeKey, Moment().format('X'));
                
                setTimeout(async () => {
                    this.setState({ refreshing: false });
                }, 1000);
            } else {
                this.setState({ refreshing: false });
                Toast.show(LVStrings.network_error);
            }
            
        } catch (error) {
            this.setState({ refreshing: false });
            Toast.show(LVStrings.network_error);
        }
    }

    render() {
        const wallet = this.state.wallet || LVWallet.emptyWallet();
        const authDialogTitle = LVStrings.auth_do_start_auth + this.state.authTypeString;

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <View style={styles.topPanel}>
                    <MXNavigatorHeader
                        style={{ backgroundColor: 'transparent' }}
                        title={LVStrings.assets_title}
                        titleStyle={{ color: '#ffffff', fontSize: LVSize.large }}
                        hideLeft={true}
                        right={selectImg}
                        onRightPress={this.onPressSelectWallet}
                    />
                    <LVWalletHeader name={wallet.name} address={wallet.address} onPress={this.onPressHeader.bind(this)} />
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listHeaderText}>{LVStrings.wallet_details}</Text>
                    <MXTouchableImage style={styles.listHeaderIcon} source={addTokenImg} onPress={this.onPressAddTokenToAssets.bind(this)}/>
                </View>

                <AssetsBalanceList style={styles.list} wallet={wallet} refreshing={this.state.refreshing} onRefresh={this.refreshBalance.bind(this)} onPressItem={this.onPressAssetsDetail.bind(this)} />

                <LVSelectWalletModal isOpen={this.state.openSelectWallet} onClosed={this.onSelectWalletClosed} />

                <LVConfirmDialog 
                    ref={'startAuthDialog'}
                    title={authDialogTitle}  
                    confirmTitle = {LVStrings.common_confirm}
                    cancelTitle = {LVStrings.auth_dialog_cancel}
                    onConfirm={()=> {this.handleStartAuth()}}
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
        alignItems: 'center',
    },
    topPanel: {
        width: Window.width,
        height: LVUtils.isIphoneX() ? 219 : 195,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.primary
    },
    listHeader: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.background.assets
    },
    listHeaderText: {
        marginLeft: 15,
        fontFamily: 'SFProText-Medium',
        fontSize: LVSize.small,
        color: LVColor.text.grey2,
    },
    listHeaderIcon: {
        width: 26,
        height: 26,
        marginRight: 15
    },
    list: {
        flex: 1,
        width: '100%',
        backgroundColor: LVColor.background.assets
    }
});

export default AssetsScreen;
