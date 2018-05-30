/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import AssetsDetailsScreen from './AssetsDetailsScreen';
import TransactionDetailsScreen from './TransactionDetailsScreen';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsDetails: { screen: AssetsDetailsScreen },
    TransactionDetails: { screen: TransactionDetailsScreen },
});

export default AssetsNavigator;