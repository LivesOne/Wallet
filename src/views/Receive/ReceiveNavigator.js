/*
 * Project: Venus
 * File: src/views/Receive/ReceiveNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ReceiveScreen from './ReceiveScreen';
import ReceiveTip from './ReceiveTip';

const ReceiveNavigator = StackNavigator({
    Receive: { screen: ReceiveScreen },
    ReceiveTip: { screen:ReceiveTip},
});

export default ReceiveNavigator;