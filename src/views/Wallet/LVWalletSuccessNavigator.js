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
import WalletCreateOrImportPage from './WalletCreateOrImportPage';

const LVWalletSuccessNavigator = StackNavigator({
    SuccessPage: { screen: WalletCreateSuccessPage },
    ImportOrCreate: { screen: WalletCreateOrImportPage }
});

export default LVWalletSuccessNavigator;