/*
 * Project: Venus
 * File: src/views/Receipt/ReceiptScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class ReceiptScreen extends Component {
    static navigationOptions = {
        header: null
    };
    
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <Text>Receipt Screen</Text>
            </View>
        )
    }
}

export default ReceiptScreen;