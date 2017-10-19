/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import TransactionRecordsScreen from './TransactionRecordsScreen';
import TransactionDetailsScreen from './TransactionDetailsScreen';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    TransactionRecords: { screen: TransactionRecordsScreen },
    TransactionDetails: { screen: TransactionDetailsScreen },
});

export default AssetsNavigator;