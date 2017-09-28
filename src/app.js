/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import LVStrings from './assets/localization';
import AppGuideScreen from './views/AppLaunch/AppGuideScreen';
import AppTabNavigator from './containers/AppTabNavigator';
import { StateMachine } from './share/StateMachine';

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
        console.log('===> app component did mount');
    }

    componentWillUnmount() {

    }

    handleAppGuideCallback = () => {
        this.setState({showGuide: false});
    }

    render() {
        const { showGuide } = this.state;

        if (showGuide) {
            return (
                <AppGuideScreen callback={this.handleAppGuideCallback} />
            )
        } else {
            return (
                <AppTabNavigator />
                //<StateMachine />
            )
        }
    }
}

export default VenusApp;
