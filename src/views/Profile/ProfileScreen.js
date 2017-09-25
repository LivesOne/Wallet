/*
 * Project: Venus
 * File: src/views/Profile/ProfileScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class ProfleScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <Text
                    onPress = {()=>{ this.props.navigation.navigate('PurseManager') }}>Profile Screen</Text>
            </View>
        )
    }
}

export default ProfleScreen;