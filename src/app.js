/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import AppTabNavigator from './containers/AppTabNavigator';
import LVStrings from './assets/localization';
import TestComponent from './components/TestComponent';

class VenusApp extends Component {
    render() {
        StatusBar.setBarStyle("light-content", false);
        return (
            <AppTabNavigator />
        )
    }
}

export default VenusApp;
