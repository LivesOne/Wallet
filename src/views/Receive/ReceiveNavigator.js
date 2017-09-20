/*
 * Project: Venus
 * File: src/views/Receipt/ReceiptNavigator.js
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