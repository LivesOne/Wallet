/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import PurseImportPage from '../Purse/PurseImportPage';
import PurseCreateOrImportPage from '../Purse/PurseCreateOrImportPage';
import PurseCreatePage from '../Purse/PurseCreatePage';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    PurseImport: { screen: PurseImportPage },
    PurseCreateOrImport: { screen: PurseCreateOrImportPage },
    PurseCreate: { screen: PurseCreatePage }
});

export default AssetsNavigator;