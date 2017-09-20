/*
 * Project: Venus
 * File: src/containers/AppTabNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { Image, Platform, StatusBar } from "react-native";
import { TabNavigator, TabBarBottom } from "react-navigation";
import * as GlobalStyle from '../styles';

import AssetsNavigator from '../views/Assets/AssetsNavigator';
import ReceiptNavigator from '../views/Receipt/ReceiptNavigator';
import ProfileNavigator from '../views/Profile/ProfileNavigator';
import TransactionNavigator from '../views/Transaction/TransactionNavigator';

const assetsIcon = require("../assets/images/tab_assets.png");
const assetsFocusedIcon = require("../assets/images/tab_assets_h.png");

const receiptIcon = require("../assets/images/tab_receipt.png");
const receiptFocusedIcon = require("../assets/images/tab_receipt_h.png");

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
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? assetsIcon : assetsFocusedIcon} />
            })
        },
        Receipt: {
            screen: ReceiptNavigator,
            path: "Receipt",
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? receiptIcon : receiptFocusedIcon} />
            })
        },
        Transaction: {
            screen: TransactionNavigator,
            path: "Transaction",
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? transIcon : transFocusedIcon} />
            })
        },
        Profile: {
            screen: ProfileNavigator,
            path: "Profile",
            navigationOptions: ({ navigation }) => ({
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
                backgroundColor: GlobalStyle.Color.tabBar,
            }
        },
        mode: Platform.OS === "ios" ? "modal" : "card",
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
);

export default AppTabNavigator;