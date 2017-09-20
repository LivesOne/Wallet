/*
 * Project: Venus
 * File: src/views/Transaction/TransactionNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import TransactionScreen from './TransactionScreen';

const TransactionNavigator = StackNavigator({
    Transaction: { screen: TransactionScreen }
});

export default TransactionNavigator;