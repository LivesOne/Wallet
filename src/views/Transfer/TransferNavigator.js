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


const TransferNavigator = StackNavigator({
    Transfer: { screen: TransferScreen },
    ContactList: {screen: ContactsManagerPage},
    AddEditContactPage: {screen: AddEditContactPage}
});

export default TransferNavigator;