/*
 * Project: Venus
 * File: src/containers/AppTabNavigator.js
 * @flow
 */
'use strict';

import React from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import LVColor from '../styles/LVColor';
import LVStrings from '../assets/localization';

import AssetsNavigator from '../views/Assets/AssetsNavigator';
import ProfileNavigator from '../views/Profile/ProfileNavigator';

const assetsIcon = require('../assets/images/tab_assets.png');
const assetsFocusedIcon = require('../assets/images/tab_assets_h.png');

const profileIcon = require('../assets/images/tab_profile.png');
const profileFocusedIcon = require('../assets/images/tab_profile_h.png');

const AppTabNavigator = TabNavigator(
    {
        Assets: {
            screen: AssetsNavigator,
            path: 'Assets',
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.assets,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? assetsIcon : assetsFocusedIcon} />
            })
        },
        Profile: {
            screen: ProfileNavigator,
            path: 'Profile',
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: LVStrings.profile,
                tabBarIcon: ({ focused, tintColor }) => <Image source={!focused ? profileIcon : profileFocusedIcon} />
            })
        }
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            showLabel: true,
            style: {
                backgroundColor: LVColor.tabBar.background,
                shadowColor: LVColor.tabBar.shadowColor,
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.2,
                shadowRadius: 18
            },
            activeTintColor: LVColor.tabBar.tintColor
        },
        swipeEnabled: false,
        mode: Platform.OS === 'ios' ? 'modal' : 'card',
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
);

// gets the current screen from navigation state
function getRouteName(navigationState) {
    if (!navigationState) {
        return '';
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getRouteName(route);
    }
    return route.routeName;
}

export default () => (
    <AppTabNavigator
        onNavigationStateChange={(prevState, currentState) => {
            const preScreen = getRouteName(prevState);
            const curScreen = getRouteName(currentState);

            // set statusBarStyle to light in native
            if (curScreen === 'Assets' || curScreen === 'AssetsDetails' || curScreen === 'WalletDetailsPage') {
                StatusBar.setBarStyle('light-content', true);
            } else {
                StatusBar.setBarStyle('default', true);
            }
        }}
    />
);
