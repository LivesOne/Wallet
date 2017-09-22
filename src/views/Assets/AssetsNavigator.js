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
import AssetsFirstScreen from './AssetsFirstScreen';
import AssetsCreatePage from './AssetsCreatePage';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsImport: { screen: AssetsImportPage },
    AssetsFirst: { screen: AssetsFirstScreen },
    AssetsCreate: { screen: AssetsCreatePage }
});

export default AssetsNavigator;