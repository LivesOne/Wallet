/*
 * Project: Venus
 * File: src/views/Receipt/ReceiptNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ReceiptScreen from './ReceiptScreen';

const ReceiptNavigator = StackNavigator({
    Receipt: { screen: ReceiptScreen }
});

export default ReceiptNavigator;