/*
 * Project: Venus
 * File: src/views/Profile/ProfileNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ProfileScreen from './ProfileScreen';
import { WalletManagerScreen } from './WalletManager';
import { WalletManagerPage } from './WalletManager/WalletManagerPage';
import { ModifyWalletName } from './WalletManager/ModifyWalletName';
import { ModifyWalletPwd } from './WalletManager/ModifyWalletPwd';
import WalletCreatePage from '../Wallet/WalletCreatePage';
import WalletImportPage from '../Wallet/WalletImportPage';
import WalletCreateSuccessPage from '../Wallet/WalletCreateSuccessPage';

const ProfileNavigator = StackNavigator({
    Profile: { screen: ProfileScreen },
    WalletManager: { screen: WalletManagerScreen },
    WalletManagerPage : {screen: WalletManagerPage},
    ModifyWalletName: { screen: ModifyWalletName },
    ModifyWalletPwd: { screen: ModifyWalletPwd },
    WalletCreatePage: {screen: WalletCreatePage},
    WalletImportPage: {screen : WalletImportPage},
    WalletCreateSuccessPage : {screen : WalletCreateSuccessPage}
});

export default ProfileNavigator;