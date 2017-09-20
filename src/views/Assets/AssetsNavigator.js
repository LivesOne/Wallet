/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import AssetsScreen from './AssetsScreen';

const AssetsNavigator = StackNavigator({
    Assets: { screen: AssetsScreen }
});

export default AssetsNavigator;