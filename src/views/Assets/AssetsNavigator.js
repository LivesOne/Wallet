/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import AssetsImportPage from './AssetsImportPage';
import PurseCreateOrImportPage from '../Purse/PurseCreateOrImportPage';
import PurseCreatePage from '../Purse/PurseCreatePage';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsImport: { screen: AssetsImportPage },
    PurseCreateOrImport: { screen: PurseCreateOrImportPage },
    PurseCreate: { screen: PurseCreatePage }
});

export default AssetsNavigator;