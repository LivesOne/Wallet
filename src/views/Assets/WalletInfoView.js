/*
 * Project: Venus
 * File: src/views/Assets/WalletInfoView.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import { StringUtils } from '../../utils';

const walletIcon = require('../../assets/images/assets_wallet.png');

export default class WalletInfoView extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleStyle: Text.propTypes.style,
        address: PropTypes.string,
        addressStyle: Text.propTypes.style,
        walletIcon: PropTypes.any,
        showLVT: PropTypes.bool
    };

    static defaultProps = {
        showLVT: false,
     };

    render() {
        let lvtText = null;
        if(this.props.showLVT) {
            lvtText = <Text style={styles.lvt}>{' LVT'}</Text>;
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={this.props.walletIcon || walletIcon} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                        <Text style={[styles.text, styles.walletTitle, this.props.titleStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {this.props.title}
                        </Text>
                        {lvtText}
                    </View>
                    
                    <Text style={[styles.text, styles.walletAddress, this.props.addressStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {StringUtils.converAddressToDisplayableText(this.props.address, 9, 9)}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    text: {
        marginTop: 2.5,
        marginBottom: 2.5,
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    walletTitle: {
        fontSize: LVSize.large,
        fontWeight: '500'
    },
    walletAddress: {
        fontSize: LVSize.xsmall
    },
    lvt: {
        fontSize:LVSize.xxsmall,
        color: '#6d798a'
    }
});
