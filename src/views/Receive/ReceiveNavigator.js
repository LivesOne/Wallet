/*
 * Project: Venus
 * File: src/views/Receive/ReceiveNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ReceiveScreen from './ReceiveScreen';

const ReceiveNavigator = StackNavigator({
    Receive: { screen: ReceiveScreen }
});

export default ReceiveNavigator;