/*
 * Project: Venus
 * File: src/views/Transaction/TransactionScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class TransactionScreen extends Component {
    static navigationOptions = {
        header: null
    };
    
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <Text>Transaction Screen</Text>
            </View>
        )
    }
}

export default TransactionScreen;