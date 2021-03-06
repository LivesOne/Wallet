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
import TransferMinerTips from '../Transfer/TransferMinerTips';
import ReceiveTip from '../Receive/ReceiveTip';
import ReceiveScreen from '../Receive/ReceiveScreen';

const TransferNavigator = StackNavigator({
    Transfer: { screen: TransferScreen },
    ContactList: {screen: ContactsManagerPage},
    ReceiveTip: { screen:ReceiveScreen},
    AddEditContactPage: {screen: AddEditContactPage},
    LVTContactDetailPage: {screen: LVTContactDetailPage},
    TransferMinerTips: {screen: TransferMinerTips},
});

export default TransferNavigator;