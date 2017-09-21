/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, TouchableHighlight } from 'react-native';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import GradientPanel from '../Common/GradientPanel';
import MXTouchableImage from '../../components/MXTouchableImage';

const purseIcon = require('../../assets/images/assets_purse.png');
const selectPurseIcon = require('../../assets/images/select_purse.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        purseTitle: string,
        purseAddress: string
    };

    constructor(props: any) {
        super(props);
        this.state = {
            purseTitle: '傲游LivesToken',
            purseAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7'
        };
    }

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

                        <View style={styles.purseInfoPanel}>
                            <Image source={purseIcon} />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text
                                    style={[styles.purseText, styles.purseTitle]}
                                    numberOfLines={1}
                                    ellipsizeMode="middle"
                                >
                                    {this.state.purseTitle}
                                </Text>
                                <Text
                                    style={[styles.purseText, styles.purseAddress]}
                                    numberOfLines={1}
                                    ellipsizeMode="middle"
                                >
                                    {this.state.purseAddress}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.balance} ></View>
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
        width: '100%', height: 315
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: '100%', height: 64,
        paddingTop: 20, paddingLeft: 12.5, paddingRight: 12.5,
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
    },
    purseInfoPanel: {
        marginLeft: 12.5, marginRight: 12.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    purseText: {
        marginTop: 2.5, marginBottom: 2.5,
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    purseTitle: {
        fontSize: 18,
        fontWeight: '500'
    },
    purseAddress: {
        width: 170,
        fontSize: 12
    },
    balance: {
        width: Dimensions.get('window').width - 25, 
        height: 150, 
        marginTop: 15, 
        borderRadius: 4,
        backgroundColor: LVColor.white
    }
});

export default AssetsScreen;
