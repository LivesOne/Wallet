/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';

import AssetsScreen from './AssetsScreen';
import AssetsDetailsScreen from './AssetsDetailsScreen';
import TransactionDetailsScreen from './TransactionDetailsScreen';

import ReceiveScreen from '../Receive/ReceiveScreen';
import ReceiveTip from '../Receive/ReceiveTip';
import TransferScreen from '../Transfer/TransferScreen';
import AddEditContactPage from '../contacts/AddEditContactPage';
import ContactsManagerPage from '../contacts/ContactsManagerPage';
import LVTContactDetailPage from '../contacts/LVTContactDetailPage';

const AssetsMainNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsDetails: { screen: AssetsDetailsScreen },
    TransactionDetails: { screen: TransactionDetailsScreen }
});

const AssetsNavigator = StackNavigator(
    {
        Assets: { screen: AssetsMainNavigator },
        Receive: { screen: ReceiveScreen },
        Transfer: { screen: TransferScreen },
        ReceiveTip: { screen: ReceiveTip },
        ContactList: { screen: ContactsManagerPage },
        AddEditContactPage: { screen: AddEditContactPage },
        LVTContactDetailPage: { screen: LVTContactDetailPage }
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
);

export default AssetsNavigator;
