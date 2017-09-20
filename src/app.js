/*
 * Project: Venus
 * File: src/app.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppTabNavigator from './containers/AppTabNavigator';

class VenusApp extends Component {
    render() {
        return (
            <AppTabNavigator />
        )
    }
}

export default VenusApp;
