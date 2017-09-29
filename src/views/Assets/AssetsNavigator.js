/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import TransferRecordsScreen from './TransferRecordsScreen';
import PurseImportPage from '../Purse/PurseImportPage';
import PurseCreateOrImportPage from '../Purse/PurseCreateOrImportPage';
import PurseCreatePage from '../Purse/PurseCreatePage';
import PurseCreateSuccessPage from '../Purse/PurseCreateSuccessPage';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    TransferRecords: { screen: TransferRecordsScreen },
    PurseImport: { screen: PurseImportPage },
    PurseCreateOrImport: { screen: PurseCreateOrImportPage },
    PurseCreate: { screen: PurseCreatePage },
    PurseCreateSuccess: { screen: PurseCreateSuccessPage }
});

export default AssetsNavigator;