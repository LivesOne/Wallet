/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import LVStrings from './assets/localization';
import LVConfiguration from './logic/LVConfiguration';
import AppGuideScreen from './views/AppLaunch/AppGuideScreen';
import AppTabNavigator from './containers/AppTabNavigator';
import WalletNavigator from './views/Wallet/WalletNavigator';
import LVWalletManager from './logic/LVWalletManager';

const ignoreWallets = true;

class VenusApp extends Component {
    state: {
        needShowGuide: boolean,
        hasAnyWallets: boolean
    };

    constructor() {
        super();
        this.state = {
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
        const hasWallets = await LVConfiguration.isAnyWalletAvailable();
        this.setState({hasAnyWallets: hasWallets});

        // init wallets from local disk storage.
        await LVWalletManager.loadLocalWallets();

        // App has been launched
        await LVConfiguration.setAppHasBeenLaunched();
    }

    componentWillUnmount() {}

    handleAppGuideCallback = () => {
        this.setState({ needShowGuide: false });
        LVConfiguration.setAppGuidesHasBeenDisplayed();
    };

    render() {
        const { needShowGuide, hasAnyWallets } = this.state;

        if (needShowGuide) {
            return <AppGuideScreen callback={this.handleAppGuideCallback} />;
        } else if (ignoreWallets || hasAnyWallets) {
            return <AppTabNavigator />;
        } else {
            return <WalletNavigator />;
        }
    }
}

export default VenusApp;
