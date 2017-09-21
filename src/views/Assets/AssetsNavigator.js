/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';
import AssetsImportPage from './AssetsImportPage'

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsImport: { screen: AssetsImportPage }
});

export default AssetsNavigator;