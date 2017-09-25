/*
 * Project: Venus
 * File: src/views/Profile/ProfileNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ProfileScreen from './ProfileScreen';
import { PurseManagerPage } from './PurseManager/PurseManagerPage';

const ProfileNavigator = StackNavigator({
    PurseManager: { screen: PurseManagerPage },
    Profile: { screen: ProfileScreen },
});

export default ProfileNavigator;