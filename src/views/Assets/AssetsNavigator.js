/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import TransferRecordsScreen from './TransferRecordsScreen';
import WalletImportPage from '../Wallet/WalletImportPage';
import WalletCreateOrImportPage from '../Wallet/WalletCreateOrImportPage';
import WalletCreatePage from '../Wallet/WalletCreatePage';
import WalletCreateSuccessPage from '../Wallet/WalletCreateSuccessPage';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    TransferRecords: { screen: TransferRecordsScreen },
    WalletImport: { screen: WalletImportPage },
    WalletCreateOrImport: { screen: WalletCreateOrImportPage },
    WalletCreate: { screen: WalletCreatePage },
    WalletCreateSuccess: { screen: WalletCreateSuccessPage }
});

export default AssetsNavigator;