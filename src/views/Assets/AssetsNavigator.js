/*
 * Project: Venus
 * File: src/views/Assets/AssetsNavigator.js
 * @flow
 */
'use strict';

import React from 'react';
import { Animated, Easing } from 'react-native';
import { StackNavigator } from 'react-navigation';

import AssetsScreen from './AssetsScreen';
import AssetsDetailsScreen from './AssetsDetailsScreen';
import TransactionDetailsScreen from './TransactionDetailsScreen';

import ReceiveScreen from '../Receive/ReceiveScreen';
import ReceiveTip from '../Receive/ReceiveTip';
import TransferScreen from '../Transfer/TransferScreen';
import AddEditContactPage from '../contacts/AddEditContactPage';
import ContactsManagerPage from '../contacts/ContactsManagerPage';
import LVTContactDetailPage from '../contacts/LVTContactDetailPage';

const AssetsMainNavigator = StackNavigator({
    Assets: { screen: AssetsScreen },
    AssetsDetails: { screen: AssetsDetailsScreen },
    TransactionDetails: { screen: TransactionDetailsScreen }
},
{
    transitionConfig: () => ({
        transitionSpec: {
          duration: 200,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps;
          const { index } = scene;
  
          const width = layout.initWidth;
          const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, 0],
          });
  
          const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
          });
  
          return { opacity, transform: [{ translateX }] };
        }
      }),
});

const AssetsNavigator = StackNavigator(
    {
        Assets: { screen: AssetsMainNavigator },
        Receive: { screen: ReceiveScreen },
        Transfer: { screen: TransferScreen },
        ReceiveTip: { screen: ReceiveTip },
        ContactList: { screen: ContactsManagerPage },
        AddEditContactPage: { screen: AddEditContactPage },
        LVTContactDetailPage: { screen: LVTContactDetailPage }
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
);

export default AssetsNavigator;
