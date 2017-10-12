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
    }

    componentWillMount() {
        StatusBar.setBarStyle('light-content', false);
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

    componentWillUnmount() {}

    handleAppGuideCallback = () => {
        this.setState({ needShowGuide: false });
        LVConfiguration.setAppGuidesHasBeenDisplayed();
    };

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
