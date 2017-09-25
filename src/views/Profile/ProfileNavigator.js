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
import { ExportPurse } from './PurseManager/ExportPurse';
import { ModifyPurseName } from './PurseManager/ModifyPurseName';
import { ModifyPursePwd } from './PurseManager/ModifyPursePwd';

const ProfileNavigator = StackNavigator({
    PurseManager: { screen: PurseManagerPage },
    Profile: { screen: ProfileScreen },
    ExportPurse: { screen: ExportPurse },
    ModifyPurseName: { screen: ModifyPurseName },
    ModifyPursePwd: { screen: ModifyPursePwd },
});

export default ProfileNavigator;