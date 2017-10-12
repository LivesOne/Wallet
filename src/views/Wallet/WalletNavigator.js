/*
 * Project: Venus
 * File: src/views/Wallet/WalletNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import WalletImportPage from '../Wallet/WalletImportPage';
import WalletCreateOrImportPage from '../Wallet/WalletCreateOrImportPage';
import WalletCreatePage from '../Wallet/WalletCreatePage';
import WalletCreateSuccessPage from '../Wallet/WalletCreateSuccessPage';

const WalletNavigator = StackNavigator({
    WalletCreateOrImport: { screen: WalletCreateOrImportPage },
    WalletImport: { screen: WalletImportPage },
    WalletCreate: { screen: WalletCreatePage },
    WalletCreateSuccess: { screen: WalletCreateSuccessPage },
});

export default WalletNavigator;