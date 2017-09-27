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
import { ModifyPurseName } from './PurseManager/ModifyPurseName';
import { ModifyPursePwd } from './PurseManager/ModifyPursePwd';

const ProfileNavigator = StackNavigator({
    Profile: { screen: ProfileScreen },
    PurseManager: { screen: PurseManagerPage },
    ModifyPurseName: { screen: ModifyPurseName },
    ModifyPursePwd: { screen: ModifyPursePwd },
});

export default ProfileNavigator;