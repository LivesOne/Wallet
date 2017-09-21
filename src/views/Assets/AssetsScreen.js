/*
 * Project: Venus
 * File: src/views/Assets/AssetsScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import GradientPanel from '../Common/GradientPanel';
import MXTouchableImage from '../../components/MXTouchableImage';

import PurseInfoView from './PurseInfoView';
import PurseBanlenceView from './PurseBanlenceView';

const selectPurseIcon = require('../../assets/images/select_purse.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        purseTitle: string,
        purseAddress: string,
        lvt: number,
        eth: number,
        lvtRmb: number,
        ethRmb: number,
    };

    constructor(props: any) {
        super(props);
        this.state = {
            purseTitle: '傲游LivesToken',
            purseAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            lvt: 2100000,
            eth: 26.035,
            lvtRmb: 20000,
            ethRmb: 52000,
        };
    }

    onPressSelectPurse() {
        alert('change purse');
    }

    render() {
        const { purseTitle, purseAddress, lvt, eth, lvtRmb, ethRmb } = this.state;

        return (
            <View style={styles.container}>
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

                    <PurseInfoView style={styles.purseInfo} title={purseTitle} address={purseAddress} />

                    <PurseBanlenceView style={styles.balance} lvt={lvt} eth={eth} extLvt={lvtRmb} extEth={ethRmb} />
                </GradientPanel>
            </View>
        );
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    gradient: {
        width: '100%',
        height: 315,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: Window.width - 25,
        height: 64,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navButton: {
        width: 27
    },
    title: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    purseInfo: {
        width: Window.width - 25,
    },
    balance: {
        width: Window.width - 25,
        height: 150,
        marginTop: 15
    }
});

export default AssetsScreen;
