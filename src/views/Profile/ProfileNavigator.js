/*
 * Project: Venus
 * File: src/views/Profile/ProfileNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ProfileScreen from './ProfileScreen';
import { WalletManagerPage } from './WalletManager/WalletManagerPage';
import { ModifyWalletName } from './WalletManager/ModifyWalletName';
import { ModifyWalletPwd } from './WalletManager/ModifyWalletPwd';

const ProfileNavigator = StackNavigator({
    Profile: { screen: ProfileScreen },
    WalletManager: { screen: WalletManagerPage },
    ModifyWalletName: { screen: ModifyWalletName },
    ModifyWalletPwd: { screen: ModifyWalletPwd },
});

export default ProfileNavigator;