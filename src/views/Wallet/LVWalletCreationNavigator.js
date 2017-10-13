/*
 * Project: Venus
 * File: src/views/Wallet/LVWalletSuccessNavigator.js
 * Author: Charles Liu
 * @flow
 */

"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";
import WalletCreateSuccessPage from './WalletCreateSuccessPage';
import WalletCreatePage from './WalletCreatePage';
import WalletCreateOrImportPage from './WalletCreateOrImportPage';
import WalletImportPage from './WalletImportPage';

const LVWalletCreateNavigator = StackNavigator({
    WalletCreatePage: { screen: WalletCreatePage },
    ImportOrCreate: { screen: WalletCreateOrImportPage },
    SuccessPage: {screen: WalletCreateSuccessPage},
    WalletImport: {screen: WalletImportPage},
});

export default LVWalletCreateNavigator;