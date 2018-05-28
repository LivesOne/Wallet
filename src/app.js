/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    NetInfo,
    Alert,
    BackHandler,
    Platform
} from 'react-native';
import LVStrings from './assets/localization';
import LVConfiguration from './logic/LVConfiguration';
import AppGuideScreen from './views/AppLaunch/AppGuideScreen';
import AppTabNavigator from './containers/AppTabNavigator';
import WalletCreateOrImportPage from './views/Wallet/WalletCreateOrImportPage';
import LVWalletManager from './logic/LVWalletManager';
import LVNotification from './logic/LVNotification';
import LVNotificationCenter from './logic/LVNotificationCenter';
import SplashScreen from "react-native-splash-screen";
import console from 'console-browserify';
import { LVConfirmDialog } from './views/Common/LVDialog';
import { loadavg } from 'react-native-os';
import LVNetworking  from './logic/LVNetworking';

type State = {
    loading: boolean,
    needShowGuide: boolean,
    hasAnyWallets: boolean,
    update: ?Object,
    needUpdate: ?Object

};

type Props = {
};

class VenusApp extends Component<Props, State> {
       
   


    constructor() {
        super();

        const appUpdate = new AppUpdate({
            iosAppId: '123456',
            apkVersionUrl: LVNetworking.getAppConfigURL(),
            needUpdateApp: (needUpdate) => {
               this.setState({needUpdate:needUpdate});
               this.refs.update.show();
            },
            forceUpdateApp: () => {
              console.log("Force update will start")
            },
            notNeedUpdateApp: () => {
              console.log("App is up to date")
            },
            downloadApkStart: () => { console.log("Start") },
            downloadApkProgress: (progress) => { console.log(`Downloading ${progress}%...`) },
            downloadApkEnd: () => { console.log("End") },
            onError: () => { console.log("downloadApkError") }
          }); 
    
        this.state = {
            loading: true,
            needShowGuide: false,
            hasAnyWallets: false,
            update: appUpdate,
            needUpdate: this.initUpdateApp

        };
        this.handleAppGuideCallback = this.handleAppGuideCallback.bind(this);
        this.handleWalletImportOrCreateSuccess = this.handleWalletImportOrCreateSuccess.bind(this);
        // this.initUpdateApp = this.initUpdateApp.bind(this);
        // this.initUpdateApp();
        this.state.update.checkUpdate();
    }

    componentWillMount() {
        StatusBar.setBarStyle('light-content', false);
        LVNotificationCenter.addObserver(this, LVNotification.walletImported, this.handleWalletImportOrCreateSuccess);
        LVNotificationCenter.addObserver(this, LVNotification.walletsNumberChanged, this.handleWalletImportOrCreateSuccess);
    }


   

    handleBack = () => {
        const { loading, needShowGuide, hasAnyWallets } = this.state;
        if (!loading && !needShowGuide) {
            this.refs.exitDialog.show();
            return true;
        }
      };

    componentDidMount() {
        SplashScreen.hide();
        LVConfiguration.hasAppGuidesEverDisplayed()
            .then(everDisplayed => {
                this.setState({ needShowGuide: !everDisplayed });
            })
            .catch(err => {
                this.setState({ needShowGuide: false });
            });

        this.appDidFinishLaunching();
        NetInfo.isConnected.addEventListener('connectionChange', this._handleNetStatus);
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("hardwareBackPress", this.handleBack.bind(this));
        }
    }

    _handleNetStatus = (isConnected) => {
        console.log('Network is ' + (isConnected ? 'online' : 'offline'));
        LVNotificationCenter.postNotification(LVNotification.networkStatusChanged, isConnected);
    };

    async appDidFinishLaunching() {
        // init wallets from local disk storage.
        await LVWalletManager.loadLocalWallets();

        // App has been launched
        await LVConfiguration.setAppHasBeenLaunched();

        const hasWallets = await LVConfiguration.isAnyWalletAvailable();
        this.setState({ loading: false, hasAnyWallets: hasWallets });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleNetStatus);
        LVNotificationCenter.removeObservers(this);
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
        }
    }

    initUpdateApp = () => {
        
        //   this.setState({ update: appUpdate});
    }

    handleAppGuideCallback = () => {
        this.setState({ needShowGuide: false });
        LVConfiguration.setAppGuidesHasBeenDisplayed();
    };

    handleWalletImportOrCreateSuccess = async () => {
        const hasWallets = await LVConfiguration.isAnyWalletAvailable();
        this.setState({ hasAnyWallets: hasWallets });
    }

    render() {
        const { loading, needShowGuide, hasAnyWallets } = this.state;
        return Platform.OS === 'android' ? 
            this.renderAndroidMainScreen() : this.renderIOSMainScreen();
    }

    renderAndroidMainScreen() {
        return <View style={{flex: 1}}>
                <LVConfirmDialog
                    ref={'exitDialog'}
                    title={LVStrings.alert_hint}  
                    message={LVStrings.exit_app_prompt} 
                    onConfirm={()=> {BackHandler.exitApp()}} />
                    {this.getMainScreen()}
                  <LVConfirmDialog
                    ref={'update'}
                    title={LVStrings.update_title}  
                    message={LVStrings.update_text} 
                    confirmTitle = {LVStrings.update_ok}
                    cancelTitle = {LVStrings.update_cancel}
                    onConfirm={()=> {
                        this.state.needUpdate(true);
                        this.refs.update.dismiss();
                    }} />
            </View>
    }

    renderIOSMainScreen() {
        return <View style={{flex: 1}}>
       
          <LVConfirmDialog
            ref={'update'}
            title={LVStrings.update_title}  
            message={LVStrings.update_text} 
            confirmTitle = {LVStrings.update_ok}
            cancelTitle = {LVStrings.update_cancel}
            onConfirm={()=> {
                this.state.needUpdate(true);
            }} />
            {this.getMainScreen()}
    </View> 
    }
    getMainScreen() {
        const { loading, needShowGuide, hasAnyWallets } = this.state;
        if (needShowGuide) {
            return <AppGuideScreen callback={this.handleAppGuideCallback} />;
        } else if (loading) {
            return <LVAppLoadingView />;
        } else if (hasAnyWallets) {
            return <AppTabNavigator/>
        } else {
            return <WalletCreateOrImportPage />;
        }
    }
}

const LVAppLoadingView = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        </View>
    );
};
import AppUpdate from './utils/MxAppUpdate';



export default VenusApp;
