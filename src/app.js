/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
import LVStrings from './assets/localization';
import LVConfiguration from './logic/LVConfiguration';
import AppGuideScreen from './views/AppLaunch/AppGuideScreen';
import AppTabNavigator from './containers/AppTabNavigator';
import WalletNavigator from './views/Wallet/WalletNavigator';
import LVWalletManager from './logic/LVWalletManager';
import LVNotification from './logic/LVNotification';
import LVNotificationCenter from './logic/LVNotificationCenter';

class VenusApp extends Component {
    state: {
        loading: boolean,
        needShowGuide: boolean,
        hasAnyWallets: boolean
    };

    constructor() {
        super();
        this.state = {
            loading: true,
            needShowGuide: false,
            hasAnyWallets: false
        };
        this.handleAppGuideCallback = this.handleAppGuideCallback.bind(this);
        this.handleWalletImportOrCreateSuccess = this.handleWalletImportOrCreateSuccess.bind(this);
    }

    componentWillMount() {
        StatusBar.setBarStyle('light-content', false);
        LVNotificationCenter.addObserver(this, LVNotification.walletImported, this.handleWalletImportOrCreateSuccess);
        LVNotificationCenter.addObserver(this, LVNotification.walletsChanged, this.handleWalletImportOrCreateSuccess);
    }

    componentDidMount() {
        LVConfiguration.hasAppGuidesEverDisplayed()
            .then(everDisplayed => {
                this.setState({ needShowGuide: !everDisplayed });
            })
            .catch(err => {
                this.setState({ needShowGuide: false });
            });

        this.appDidFinishLaunching();
    }

    async appDidFinishLaunching() {
        // init wallets from local disk storage.
        await LVWalletManager.loadLocalWallets();

        // App has been launched
        await LVConfiguration.setAppHasBeenLaunched();

        const hasWallets = await LVConfiguration.isAnyWalletAvailable();
        this.setState({ loading: false, hasAnyWallets: hasWallets });
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
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

        if (needShowGuide) {
            return <AppGuideScreen callback={this.handleAppGuideCallback} />;
        } else if (loading) {
            return <LVAppLoadingView />;
        } else if (hasAnyWallets) {
            return <AppTabNavigator />;
        } else {
            return <WalletNavigator />;
        }
    }
}

const LVAppLoadingView = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/images/create_wallet.png')} />
        </View>
    );
};

export default VenusApp;
