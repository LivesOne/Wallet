/*
 * @flow
 */

"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";
import WalletCreateSuccessPage from './WalletCreateSuccessPage';
import WalletCreatePage from './WalletCreatePage';
import WalletCreateOrImportPage from './WalletCreateOrImportPage';
import WalletImportPage from './WalletImportPage';

const LVWalletImportNavigator = StackNavigator({
    WalletImport: {screen: WalletImportPage},
});

export default LVWalletImportNavigator;