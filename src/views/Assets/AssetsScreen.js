/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native';
import LVStrings from '../../assets/localization';
import GradientPanel from '../Common/GradientPanel';
import MXTouchableImage from '../../components/MXTouchableImage';

const selectPurseIcon = require('../../assets/images/select_purse.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    onPressSelectPurse() {
        alert('change purse');
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <GradientPanel style={styles.gradient}>
                        <View style={styles.nav}>
                            <View style={styles.navButton} />
                            <Text style={styles.title}>{LVStrings.assets_title}</Text>
                            <MXTouchableImage
                                style={styles.navButton}
                                source={selectPurseIcon}
                                onPress={this.onPressSelectPurse}
                            />
                        </View>
                    </GradientPanel>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    header: {
        width: '100%',
        height: 300
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: '100%',
        height: 64,
        paddingTop: 20,
        paddingLeft: 12.5,
        paddingRight: 12.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navButton: {
        width: 27
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    }
});

export default AssetsScreen;
