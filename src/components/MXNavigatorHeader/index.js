/*
 * Project: Venus
 * File: src/components/MXNavigatorHeader/index.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, View, ViewPropTypes, Image, PixelRatio, Text, TouchableOpacity, Platform } from 'react-native';

import LVColor from '../../styles/LVColor';
import LVFontSize from '../../styles/LVFontSize';
import LVUtils from '../../utils';
let LVStyleSheet = require('../../styles/LVStyleSheet');

const whiteBackIcon = require('../../assets/images/back.png');
const defaultBackIcon = require('../../assets/images/back_grey.png')

type Props = {
    style?: ViewPropTypes.style,
    title: string,
    titleStyle?: Text.propTypes.style,
    left?: string | number | React.Element<any>,
    leftStyle?: Text.propTypes.style | ViewPropTypes.style,
    hideLeft: boolean,
    onLeftPress?: Function,
    right?: string | number |  React.Element<any>,
    rightStyle?: Text.propTypes.style | ViewPropTypes.style,
    rightTextColor?: string,
    onRightPress?: Function,
};

export default class MXNavigatorHeader extends React.Component<Props> {

    render() {
        const { title, titleStyle, left, leftStyle, onLeftPress, hideLeft, style, right, onRightPress, rightStyle, rightTextColor } = this.props;
        let leftIsString = left && typeof left === 'string';
        let rightIsString = right && typeof right === 'string';
        return (
            <View style={[styles.container, style]}>
                <TouchableOpacity style={[styles.defaultLeftStyle, leftStyle]} onPress={onLeftPress}>
                    {!hideLeft && (
                        <View style={{}}>
                            {leftIsString && <Text style={{ fontSize: 16, color: LVColor.white }}>{left}</Text>}
                            {!leftIsString && <Image source={left || defaultBackIcon} />}
                        </View>
                    )}
                </TouchableOpacity>

                <Text numberOfLines={1} style={[styles.titleStyle, titleStyle]}>{title || 'header'}</Text>

                <TouchableOpacity style={[styles.defaultRightStyle, rightStyle]} onPress={onRightPress}>
                    {right && (
                        <View style={{}}>
                            {rightIsString && (
                                <Text style={{ width: 50, fontSize: 15, color: rightTextColor || LVColor.white }}>{right}</Text>
                            )}
                            {!rightIsString && <Image source={right} />}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

const paddingTop = Platform.OS === 'ios' ? (LVUtils.isIphoneX() ? 44 : 20) : 0;
const navHeight  = Platform.OS === 'ios' ? (LVUtils.isIphoneX() ? 88 : 64) : 50;

const styles = LVStyleSheet.create({
    container: {
        paddingTop: paddingTop,
        width: '100%',
        height: navHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: LVColor.white
    },

    titleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        color : '#6d798a',
        fontSize: LVFontSize.large,
        flex: 1
    },

    defaultLeftStyle: {
        justifyContent: 'center',
        height: 50,
        alignItems: 'center',
        width: 50
    },
    defaultRightStyle: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
