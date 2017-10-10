// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import MXTouchableImage from '../../components/MXTouchableImage';
import * as MXUtils from "../../utils/MXUtils";
const selectImg = require('../../assets/images/select_wallet.png');

export class TransferHeader extends Component {

    static propTypes = {
        balance: PropTypes.number,
        onPressSelectPurse: PropTypes.func,
    };

    onPressSelectPurse = () => {
        if (this.props.onPressSelectPurse) {
            this.props.onPressSelectPurse();
        }
        alert('select')
    };

    toRenminbi() {
        // const { balance } = this.props;
        // if (balance) {
        //     return '≈￥' + this.format(balance)
        // }
        return '≈￥20,000';
    }

    render() {
        const { balance } = this.props;
        return (
            <View style = {[styles.container, this.props.style]}>
                <View style={styles.nav}>
                        <View style={{ width: 50 }} />
                        <Text style={styles.navTitle}>{ LVStrings.transfer_title }</Text>
                        <MXTouchableImage style={{ width: 50 }} source={selectImg} onPress={this.onPressSelectPurse.bind(this)} />
                    </View>
                <View style= {styles.columnContainer}>
                    <Text style= {[styles.textCommon]}>{ LVStrings.transfer_purse_balance }</Text>
                    <Text style= {[styles.textCommon, {fontSize: 36}]}>{ MXUtils.formatCurrency(balance)}</Text>
                    <Text style= {[styles.textCommon]}>{ this.toRenminbi() }</Text>
                </View>
            </View>
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        height: '25%',
        backgroundColor: LVColor.primary
    },
    nav: {
        width: Window.width,
        height: 64,
        paddingTop: Platform.OS === 'ios' ? 22 : 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    columnContainer: {
        flex: 1, 
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 30,
    },
    textCommon: {
        marginBottom: 5,
        color: 'white',
        fontSize: 12
    }
});

export default TransferHeader