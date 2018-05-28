/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import VenusApp from './src/app';

YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RNOS',
    'Module RCTImageLoader requires main queue setup',
    'Module RCTCameraManager requires main queue setup',
    'Module RNRandomBytes requires main queue setup',
    'Required dispatch_sync to load constants for RNDeviceInfo',
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Class RCTCxxModule'
]);

AppRegistry.registerComponent('Venus', () => VenusApp);
