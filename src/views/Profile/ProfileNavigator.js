/*
 * Project: Venus
 * File: src/views/Profile/ProfileNavigator.js
 * @flow
 */
"use strict";

import React from 'react';
import { StackNavigator } from "react-navigation";

import ProfileScreen from './ProfileScreen';

const ProfileNavigator = StackNavigator({
    Profile: { screen: ProfileScreen }
});

export default ProfileNavigator;