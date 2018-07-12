/*
 * Project: Venus
 * File: src/views/Common/LVWalletHeader.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image, TouchableOpacity, Clipboard } from 'react-native';
import { StringUtils } from '../../utils';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import Toast from 'react-native-root-toast';
import TransferUtils from '../Transfer/TransferUtils';

const walletIcon = require('../../assets/images/assets_wallet.png');

type Props = {
    style?: ViewPropTypes.style,
    name: ?string,
    address: ?string,
    walletIcon?: number | React.Element<any>
};

export default class LVWalletHeader extends React.Component<Props> {

    onPressCopy() {
        Clipboard.setString(TransferUtils.convertToHexHeader(this.props.address || ''));
        Toast.show(LVStrings.receive_copy_success, { position: Toast.positions.CENTER });
    }

    render() {
        const { name } = this.props;
        const address = StringUtils.converAddressToDisplayableText(this.props.address || '', 9, 11);

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.inner}>
                    <Image source={this.props.walletIcon || walletIcon} style={styles.img} resizeMode="contain" />
                    <View style={styles.infoView}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="middle">{name}</Text>
                        <View style={styles.addressView}>
                            <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">{address}</Text>
                            <TouchableOpacity style={styles.copy} activeOpacity={0.8} onPress={this.onPressCopy.bind(this)}>
                                <Text style={styles.copyText}>{LVStrings.common_copy}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inner: {
        width: '100%',
        height: 51,
        marginTop: 34,
        marginBottom: 46,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    },
    img: {
        width: 51,
        height: 51,
        marginLeft: 16,
        marginRight: 10
    },
    infoView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'transparent'
    },
    title: {
        height: 26,
        fontFamily: 'SFProText-Medium',
        fontSize: LVSize.large,
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    addressView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    address: {
        fontFamily: 'SFProText-Regular',
        fontSize: LVSize.xsmall,
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    copy: {
        width: 39,
        height: 22,
        marginLeft: 30,
        borderRadius: 3,
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    copyText: {
        fontFamily: 'SFProText-Regular',
        fontSize: LVSize.xsmall,
        textAlign: 'center',
        color: LVColor.primary,
    }
});
