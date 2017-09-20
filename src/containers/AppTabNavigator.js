/*
 * Project: Venus
 * File: src/containers/AppTabNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { Image, Platform, StatusBar } from "react-native";
import { TabNavigator, TabBarBottom } from "react-navigation";
import LVColor from '../styles/LVColor';
import LVStrings from '../assets/localization';

import AssetsNavigator from '../views/Assets/AssetsNavigator';
import ReceiveNavigator from '../views/Receive/ReceiveNavigator';
import ProfileNavigator from '../views/Profile/ProfileNavigator';
import TransactionNavigator from '../views/Transaction/TransactionNavigator';

const assetsIcon = require("../assets/images/tab_assets.png");
const assetsFocusedIcon = require("../assets/images/tab_assets_h.png");

const receiveIcon = require("../assets/images/tab_receive.png");
const receiveFocusedIcon = require("../assets/images/tab_receive_h.png");

const transIcon = require("../assets/images/tab_transaction.png");
const transFocusedIcon = require("../assets/images/tab_transaction_h.png");

const profileIcon = require("../assets/images/tab_profile.png");
const profileFocusedIcon = require("../assets/images/tab_profile_h.png");

const AppTabNavigator = TabNavigator(
    {
        Assets: {
            screen: AssetsNavigator,
            path: "Assets",
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.assets,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? assetsIcon : assetsFocusedIcon} />
            })
        },
        Receive: {
            screen: ReceiveNavigator,
            path: "Receive",
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.receive,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? receiveIcon : receiveFocusedIcon} />
            })
        },
        Transaction: {
            screen: TransactionNavigator,
            path: "Transaction",
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.transaction,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? transIcon : transFocusedIcon} />
            })
        },
        Profile: {
            screen: ProfileNavigator,
            path: "Profile",
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.profile,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? profileIcon : profileFocusedIcon} />
            })
        }
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: "bottom",
        tabBarOptions: {
            showLabel: true,
            style: {
                backgroundColor: LVColor.tabBar.background,
            },
            activeTintColor: LVColor.tabBar.tintColor,
        },
        mode: Platform.OS === "ios" ? "modal" : "card",
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
);

export default AppTabNavigator;