/**
 */

"use strict";

import React, { Component, PropTypes } from "react";

import { View, StyleSheet, Image, PixelRatio, Text, TouchableOpacity, Platform } from "react-native";

import LVColor from '../../styles/LVColor'
let LVStyleSheet = require('../../styles/LVStyleSheet');

const defaultBackIcon = require("../../assets/images/back.png");

export default class MXNavigatorHeader extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        titleStyle: Text.propTypes.style,
        left: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
        leftStyle: View.propTypes.style,
        onLeftPress: PropTypes.func,
        right: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
        rightStyle: View.propTypes.style,
        onRightPress: PropTypes.func,
        style: View.propTypes.style,
    };

    render() {
        const { title, titleStyle, left, leftStyle, onLeftPress, style, right, onRightPress, rightStyle } = this.props;
        let leftIsString = left && (typeof left) === 'string';
        let rightIsString = right && (typeof right) === 'string';
        return (
            <View style={[styles.container, style]}>
                <TouchableOpacity 
                    style={[styles.defaultLeftStyle, leftStyle]} 
                    onPress={onLeftPress}>
                    <View style={{ }}>
                        { leftIsString && <Text style={{fontSize: 16, color: LVColor.white}}>{left}</Text> }
                        { !leftIsString && <Image source={left || defaultBackIcon}/>}
                    </View>
                </TouchableOpacity>

                <Text style={[styles.titleStyle, titleStyle]}>
                    {title || 'header'}
                </Text>

                <TouchableOpacity 
                    style={[styles.defaultRightStyle, rightStyle]} 
                    onPress={onRightPress}>
                    {right && <View style={{ }}>
                        { rightIsString && <Text style={{fontSize: 16, color: LVColor.white}}>{right}</Text> }
                        { !rightIsString && <Image source={right}/>}
                    </View>}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = LVStyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" ? 20 : 0,
        width: "100%",
        height: Platform.OS === "ios" ? 70 : 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        backgroundColor: LVColor.primary,
    },

    titleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        color: LVColor.white,
        fontSize: 20
    },

    defaultLeftStyle: {
        justifyContent: 'center',
        height: 50,
        alignItems: 'center',
        width: 50,
    },
    defaultRightStyle: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
