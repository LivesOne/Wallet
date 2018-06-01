/*
 * Project: Venus
 * File: src/views/Common/LVWalletHeader.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image } from 'react-native';
import { StringUtils } from '../../utils';
import LVSize from '../../styles/LVFontSize';

const walletIcon = require('../../assets/images/assets_wallet.png');

type Props = {
    style?: ViewPropTypes.style,
    name: ?string,
    address: ?string,
    walletIcon?: number | React.Element<any>
};

export default class LVWalletHeader extends React.Component<Props> {

    render() {
        const { name } = this.props;
        const address = StringUtils.converAddressToDisplayableText(this.props.address || '', 9, 11);

        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={this.props.walletIcon || walletIcon} style={styles.img} resizeMode='contain' />
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="middle" >{name}</Text>
                <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle" >{address}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    img: {
        width: 51,
        height: 51,
        marginTop: 7,
    },
    title: {
        marginTop: 7,
        fontFamily: 'SFProText-Medium',
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    address: {
        marginTop: 5,
        fontFamily: 'SFProText-Regular',
        fontSize: LVSize.xsmall,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    }
});