/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
               
                <Text>Assets Screen</Text>
            </View>
        )
    }
}

export default AssetsScreen;