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
import DetailTextCell from '../Common/DetailTextCell';
import MXTouchableImage from '../../components/MXTouchableImage';

import PurseInfoView from './PurseInfoView';
import PurseBanlenceView from './PurseBanlenceView';

const selectImg = require('../../assets/images/select_purse.png');

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
        ethRmb: number
    };

    constructor(props: any) {
        super(props);
        this.state = {
            purseTitle: '傲游LivesToken',
            purseAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            lvt: 2100000,
            eth: 26.035,
            lvtRmb: 20000,
            ethRmb: 52000
        };
        this.onPressSelectPurse = this.onPressSelectPurse.bind(this);
    }

    onPressSelectPurse() {
        //this.props.navigation.navigate("AssetsFirst")
        this.props.navigation.navigate("AssetsImport")
    }

    onPressShowAll() {
        alert('show all records');
    }

    render() {
        const { purseTitle, purseAddress, lvt, eth, lvtRmb, ethRmb } = this.state;

        return (
            <View style={styles.container}>
                <GradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <View style={{ width: 27 }} />
                        <Text style={styles.navTitle}>{LVStrings.assets_title}</Text>
                        <MXTouchableImage style={{ width: 27 }} source={selectImg} onPress={this.onPressSelectPurse} />
                    </View>
                    <PurseInfoView style={styles.purseInfo} title={purseTitle} address={purseAddress} />
                    <PurseBanlenceView style={styles.balance} lvt={lvt} eth={eth} extLvt={lvtRmb} extEth={ethRmb} />
                </GradientPanel>

                <View style={styles.listPanel}>
                    <DetailTextCell
                        text={LVStrings.recent_records}
                        detailText={LVStrings.view_all_records}
                        onPress={this.onPressShowAll}
                    />
                    <View style={styles.listView} />
                </View>
            </View>
        );
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
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
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    purseInfo: {
        width: Window.width - 25
    },
    balance: {
        width: Window.width - 25,
        height: 150,
        marginTop: 15
    },
    listPanel: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: LVColor.white
    },
    listView: {
        flex: 1,
        width: '100%',
        backgroundColor: LVColor.background.grey1
    }
});

export default AssetsScreen;
