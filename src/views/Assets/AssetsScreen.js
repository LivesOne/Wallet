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
import LVGradientPanel from '../Common/LVGradientPanel';
import LVDetailTextCell from '../Common/LVDetailTextCell';
import MXTouchableImage from '../../components/MXTouchableImage';
import LVTransferRecordList, { testRecores } from '../Common/LVTransferRecordList';

import PurseInfoView from './PurseInfoView';
import PurseBalanceView from './PurseBalanceView';
import SelectPurseModal from './SelectPurseModal';

const selectImg = require('../../assets/images/select_purse.png');

class AssetsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state: {
        purseId: string,
        purseName: string,
        purseAddress: string,
        openSelectPurse: boolean,
        lvt: number,
        eth: number,
        lvtRmb: number,
        ethRmb: number,
        transferRecords: ?Array<Object>
    };

    constructor(props: any) {
        super(props);
        this.state = {
            purseId: '3',
            purseName: '傲游LivesToken',
            purseAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            openSelectPurse: false,
            lvt: 2100000,
            eth: 26.035,
            lvtRmb: 20000,
            ethRmb: 52000,
            transferRecords: testRecores
        };
        this.onPressSelectPurse = this.onPressSelectPurse.bind(this);
        this.onSelectPurseClosed = this.onSelectPurseClosed.bind(this);
        this.onPurseSelected = this.onPurseSelected.bind(this);
    }

    onPressSelectPurse = () => {
        this.setState({ openSelectPurse: true });
    };

    onSelectPurseClosed = () => {
        this.setState({ openSelectPurse: false });
    };

    onPurseSelected = (purseObj: Object) => {
        this.setState({
            purseId: purseObj.id,
            purseName: purseObj.name,
            purseAddress: purseObj.address,
            openSelectPurse: false
        });
    };

    onPressShowAll = () => {
        //alert('show all records');
        this.props.navigation.navigate("PurseCreateOrImport");
    };

    render() {
        const { purseName, purseAddress, lvt, eth, lvtRmb, ethRmb, transferRecords } = this.state;

        return (
            <View style={styles.container}>
                <LVGradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <View style={{ width: 27 }} />
                        <Text style={styles.navTitle}>{LVStrings.assets_title}</Text>
                        <MXTouchableImage style={{ width: 27 }} source={selectImg} onPress={this.onPressSelectPurse} />
                    </View>
                    <PurseInfoView style={styles.purseInfo} title={purseName} address={purseAddress} />
                    <PurseBalanceView style={styles.balance} lvt={lvt} eth={eth} extLvt={lvtRmb} extEth={ethRmb} />
                </LVGradientPanel>

                <LVDetailTextCell
                    style={styles.recent}
                    text={LVStrings.recent_records}
                    detailText={LVStrings.view_all_records}
                    onPress={this.onPressShowAll}
                />

                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: LVColor.separateLine }} />

                <LVTransferRecordList style={styles.list} records={transferRecords} />

                <SelectPurseModal
                    isOpen={this.state.openSelectPurse}
                    onClosed={this.onSelectPurseClosed}
                    selectedPurseId={this.state.purseId}
                    onSelected={this.onPurseSelected}
                />
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
        width: Window.width - 25,
    },
    balance: {
        width: Window.width - 25,
        height: 150,
        marginTop: 15
    },
    recent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: LVColor.white
    },
    list: {
        width: '100%',
        backgroundColor: LVColor.white
    }
});

export default AssetsScreen;
