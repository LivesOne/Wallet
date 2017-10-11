/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import LVStrings from './assets/localization';
import LVConfiguration from './logic/LVConfiguration';
import AppGuideScreen from './views/AppLaunch/AppGuideScreen';
import AppTabNavigator from './containers/AppTabNavigator';
import LVWalletManager from './logic/LVWalletManager';
import TestComponent from './components/TestComponent';

class VenusApp extends Component {

    state: {
        showGuide: boolean,
    };

    constructor() {
        super();
        this.state = {
            showGuide: false,
        };
        this.handleAppGuideCallback = this.handleAppGuideCallback.bind(this);
    }

    componentWillMount() {
        StatusBar.setBarStyle("light-content", false);
    }

    componentDidMount() {
        LVConfiguration.hasAppGuidesEverDisplayed().then((everDisplayed) => {
            this.setState({showGuide: !everDisplayed});
        }).catch(err => {
            this.setState({showGuide: false});
        })

        this.appDidFinishLaunching();

        //init wallets from local disk storage.
        LVWalletManager.loadLocalWallets();
    }

    appDidFinishLaunching() {
        LVConfiguration.setAppHasBeenLaunched();
    }

    componentWillUnmount() {

    }

    handleAppGuideCallback = () => {
        this.setState({showGuide: false});
        LVConfiguration.setAppGuidesHasBeenDisplayed();
    }

    render() {
        const { showGuide } = this.state;

        if (showGuide) {
            return (
                <AppGuideScreen callback={this.handleAppGuideCallback} />
            )
        } else {
            return (
                <TestComponent />
            )
        }
    }
}

export default VenusApp;
