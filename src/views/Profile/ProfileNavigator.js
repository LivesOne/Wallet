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
import { WalletDetailsPage } from './WalletManager/WalletDetailsPage';
import { ModifyWalletName } from './WalletManager/ModifyWalletName';
import { ModifyWalletPwd } from './WalletManager/ModifyWalletPwd';
import WalletCreatePage from '../Wallet/WalletCreatePage';
import WalletImportPage from '../Wallet/WalletImportPage';
import ContactsManagerPage from '../contacts/ContactsManagerPage';
import AddEditContactPage from '../contacts/AddEditContactPage';

const ProfileNavigator = StackNavigator({
    Profile: { screen: ProfileScreen },
    WalletManager: { screen: WalletManagerScreen },
    WalletDetailsPage : {screen: WalletDetailsPage},
    ModifyWalletName: { screen: ModifyWalletName },
    ModifyWalletPwd: { screen: ModifyWalletPwd },
    WalletCreatePage: {screen: WalletCreatePage},
    WalletImportPage: {screen : WalletImportPage},
    ContactList: {screen: ContactsManagerPage},
    AddEditContactPage: {screen: AddEditContactPage}
});

export default ProfileNavigator;