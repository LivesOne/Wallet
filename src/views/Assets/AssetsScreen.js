/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}} >
               
               <Button
                    onPress={() => { alert("create wallet")}}
                    title={"create"}
                />
                <Button
                    onPress={() => { this.props.navigation.navigate("AssetsImport")}}
                    title={"import"}
                />
            </View>
        )
    }
}

export default AssetsScreen;