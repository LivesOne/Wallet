/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import AssetsImportPage from './AssetsImportPage';
import AssetsFirstScreen from './AssetsFirstScreen';
import CreateWalletScreen from './CreateWalletScreen';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsImport: { screen: AssetsImportPage },
    AssetsFirst: { screen: AssetsFirstScreen },
    CreateWallet: { screen: CreateWalletScreen }
});

export default AssetsNavigator;