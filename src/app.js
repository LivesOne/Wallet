/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppTabNavigator from './containers/AppTabNavigator';
import LVStrings from './assets/localization';

class VenusApp extends Component {
    render() {
        console.log('strings = ' + JSON.stringify(LVStrings));
        return (
            <AppTabNavigator />
        )
    }
}

export default VenusApp;
