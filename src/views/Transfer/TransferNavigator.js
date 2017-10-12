/*
 * Project: Venus
 * File: src/views/Transfer/TransferNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import TransferScreen from './TransferScreen';

const TransferNavigator = StackNavigator({
    Transfer: { screen: TransferScreen }
});

export default TransferNavigator;