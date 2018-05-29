/*
 * Project: Venus
 * File: src/views/Transfer/TransferNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import TransferScreen from './TransferScreen';
import AddEditContactPage from '../contacts/AddEditContactPage';
import ContactsManagerPage from '../contacts/ContactsManagerPage';
import LVTContactDetailPage from '../contacts/LVTContactDetailPage';

import ReceiveTip from '../Receive/ReceiveTip';

const TransferNavigator = StackNavigator({
    Transfer: { screen: TransferScreen },
    ContactList: {screen: ContactsManagerPage},
    ReceiveTip: { screen:ReceiveTip},
    AddEditContactPage: {screen: AddEditContactPage},
    LVTContactDetailPage: {screen: LVTContactDetailPage},

});

export default TransferNavigator;