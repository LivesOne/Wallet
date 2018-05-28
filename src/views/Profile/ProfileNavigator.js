/*
 * Project: Venus
 * File: src/views/Profile/ProfileNavigator.js
 * @flow
 */
'use strict';

import React from 'react';
import { Animated, Easing, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import ProfileScreen from './ProfileScreen';
import AboutScreen from './AboutScreen';
import { WalletManagerScreen } from './WalletManager';
import { WalletDetailsPage } from './WalletManager/WalletDetailsPage';
import { ModifyWalletName } from './WalletManager/ModifyWalletName';
import { ModifyWalletPwd } from './WalletManager/ModifyWalletPwd';
import WalletCreatePage from '../Wallet/WalletCreatePage';
import WalletImportPage from '../Wallet/WalletImportPage';
import ContactsManagerPage from '../contacts/ContactsManagerPage';
import AddEditContactPage from '../contacts/AddEditContactPage';
import LVTContactDetailPage from '../contacts/LVTContactDetailPage';
import TransactionRecordsScreen from '../Assets/TransactionRecordsScreen'
import TransactionDetailsScreen from '../Assets/TransactionDetailsScreen';

const ProfileNavigator = StackNavigator(
    {
        Profile: { screen: ProfileScreen },
        About: { screen: AboutScreen },
        WalletManager: { screen: WalletManagerScreen },
        WalletDetailsPage: { screen: WalletDetailsPage },
        ModifyWalletName: { screen: ModifyWalletName },
        ModifyWalletPwd: { screen: ModifyWalletPwd },
        WalletCreatePage: { screen: WalletCreatePage },
        WalletImportPage: { screen: WalletImportPage },
        ContactList: { screen: ContactsManagerPage },
        AddEditContactPage: { screen: AddEditContactPage },
        LVTContactDetailPage: { screen: LVTContactDetailPage },
        TransactionRecords: { screen: TransactionRecordsScreen },
        TransactionDetails: { screen: TransactionDetailsScreen },
    },
    {
        headerMode: 'none',
        mode: Platform.OS === 'ios' ? 'card' : 'modal',
        navigationOptions: {
            gesturesEnabled: true
        },
        transitionConfig: Platform.OS === 'ios' ? () => {} : () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;

                const height = layout.initHeight;
                const translateY = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [height, 0, 0]
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1]
                });

                return { opacity, transform: [{ translateY }] };
            }
        })
    }
);

export default ProfileNavigator;
