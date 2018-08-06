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
    Platform,
    NativeModules,
    AppState
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
import codePush from "react-native-code-push";
import LVNetworking  from './logic/LVNetworking';
import Toast from 'react-native-root-toast';
import AppUpdate from './utils/MxAppUpdate';
import LVAuthView from './views/Common/LVAuthView'
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])



let codePushOptions = { 
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, 
    installMode: codePush.InstallMode.ON_NEXT_RESUME  
};

type State = {
    loading: boolean,
    needShowGuide: boolean,
    needShowAuth : boolean ,
    selectWallet : ?Object,
    hasAnyWallets: boolean,
    update: ?AppUpdate,
    needUpdate: ?Object

};

type Props = {
};

class VenusApp extends Component<Props, State> {
    appPauseTime = 0;

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
            downloadApkStart: () => { 
                Toast.show(LVStrings.update_download_tip);
                console.log("Start") 
            },

            downloadApkProgress: (progress) => { console.log(`Downloading ${progress}%...`) },
            downloadApkEnd: () => { console.log("End") },
            onError: () => { console.log("downloadApkError") }
          }); 
    
        this.state = {
            loading: true,
            needShowGuide: false,
            needShowAuth : false,
            selectWallet : null,
            hasAnyWallets: false,
            update: appUpdate,
            needUpdate: this.initUpdateApp,
        };
        this.handleAppGuideCallback = this.handleAppGuideCallback.bind(this);
        this.handleWalletImportOrCreateSuccess = this.handleWalletImportOrCreateSuccess.bind(this);
        this.needShowAuthChange = this.needShowAuthChange.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        // this.initUpdateApp = this.initUpdateApp.bind(this);
        // this.initUpdateApp();
        
        if (this.state.update) {
            this.state.update.checkUpdate();   
        }
    }

    async componentWillMount() {
        StatusBar.setBarStyle('light-content', false);
        LVNotificationCenter.addObserver(this, LVNotification.walletImported, this.handleWalletImportOrCreateSuccess);
        LVNotificationCenter.addObserver(this, LVNotification.walletCreateSuccessPageDismiss, this.handleWalletImportOrCreateSuccess);
        // 解决Android修改语言后无法立即生效问题
        if(Platform.OS === "android"){
            const isZh = await NativeModules.LVReactExport.isLanguageZh();
            if(isZh){
                LVStrings.setLanguage('zh');
            }else{
                LVStrings.setLanguage('en');
            }
        }
        AppState.addEventListener('change', this._handleAppStateChange);
    }


    _handleAppStateChange = async (appState) => {
        if(appState === "active"){
            const needAuthLogin = await LVConfiguration.getNeedAuthlogin();
            if(this.appPauseTime !== 0 && needAuthLogin){
                var currentTime = new Date().getTime();
                var duration = currentTime - this.appPauseTime;
                console.log("appPauseTime :" + this.appPauseTime  + "--currentTime:" + currentTime + "--duration:" + duration);
                if(duration > 1000*60*1){

                    const wallet = LVWalletManager.getSelectedWallet();
                    this.setState({
                        needShowAuth : true,
                        selectWallet : wallet,
                    });
                }
            }
            this.appPauseTime = 0;
        }else if(appState === "background"){
            this.appPauseTime = new Date().getTime();
        }
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
        const wallet = LVWalletManager.getSelectedWallet();

        const needAuthLogin = await LVConfiguration.getNeedAuthlogin();
        this.setState({ loading: false, hasAnyWallets: hasWallets , needShowAuth : (wallet !== null && needAuthLogin) ? true : false , selectWallet : wallet});
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleNetStatus);
        LVNotificationCenter.removeObservers(this);
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
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

    needShowAuthChange = (needShow) => {
        this.setState({
            needShowAuth : needShow,
        });
    }

    render() {
        const { loading, needShowGuide, hasAnyWallets } = this.state;
        return Platform.OS === 'android' ? 
            this.renderAndroidMainScreen() : this.renderIOSMainScreen();
    }

    renderAndroidMainScreen() {
        return <View style={{flex: 1}}>
                {this.getMainScreen()}
                <LVConfirmDialog
                    ref={'exitDialog'}
                    title={LVStrings.alert_hint}  
                    confirmTitle = {LVStrings.common_confirm}
                    cancelTitle = {LVStrings.common_cancel}
                    onConfirm={()=> {BackHandler.exitApp()}} >
                        <Text style={{color: '#697585', fontSize: 16,}}>{LVStrings.exit_app_prompt}</Text>
                </LVConfirmDialog>
                <LVConfirmDialog
                    ref={'update'}
                    title={LVStrings.update_title}  
                    confirmTitle = {LVStrings.update_ok}
                    cancelTitle = {LVStrings.update_cancel}
                    onConfirm={()=> {
                        this.state.needUpdate(true);
                        this.refs.update.dismiss();
                    }} >
                        <Text style={{color: '#697585', fontSize: 16,}}>{LVStrings.update_text}</Text>
                </LVConfirmDialog>
                {this.state.needShowAuth && this.state.selectWallet && <LVAuthView 
                needShowAuthChange = {this.needShowAuthChange}
                selectWallet = {this.state.selectWallet}/>}
            </View>
    }

    renderIOSMainScreen() {
        return <View style={{ flex: 1 }}>
            {this.getMainScreen()}
            {this.state.needShowAuth && this.state.selectWallet && <LVAuthView
                needShowAuthChange={this.needShowAuthChange}
                selectWallet={this.state.selectWallet} />}
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
        <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' && <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image style={{ marginTop: 210 }} source={require('./assets/images/logo.png')} />
            </View>}
            {Platform.OS === 'android' && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Image source={require('./assets/images/logo.png')} />
                    <View style={{ width: '100%', height: 200 }} />
                </View>
            </View>}
        </View>
    );
};

VenusApp = codePush(codePushOptions)(VenusApp);

export default VenusApp;
