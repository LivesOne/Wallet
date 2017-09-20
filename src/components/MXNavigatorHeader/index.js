/**
 */

"use strict";

import React, { Component, PropTypes } from "react";

import { View, StyleSheet, Image, PixelRatio, Text, TouchableOpacity, Platform } from "react-native";

import PLColors from '../../assets/MXColors';
let LVStyleSheet = require('../../styles/LVStyleSheet');

const defaultBackIcon = require("../../assets/images/back.png");

export default class MXNavigatorHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        titleColor: PropTypes.string,
        rightText: PropTypes.string,
        rightTextColor: PropTypes.string,
        backIcon: PropTypes.any,
        leftText: PropTypes.string,
        onLeftPress: PropTypes.func,
        style: View.propTypes.style,
        onBackPress: PropTypes.func,
        onRightPress: PropTypes.func
    };

    render() {
        const { title, titleColor, rightText, rightTextColor, backIcon, style, onBackPress, onRightPress, leftText, onLeftPress } = this.props;

        let hasLeftText = onLeftPress && leftText;
        return (
            <View style={[styles.container, style]}>
                {onBackPress
                    ? <TouchableOpacity style={{ width: 100 }} onPress={onBackPress}>
                          <Image source={backIcon ? backIcon : defaultBackIcon} style={{ marginLeft: 20 }} />
                      </TouchableOpacity>
                    : !hasLeftText ? <View style={{ width: 100 }}/> : null}

              { leftText
                ? <TouchableOpacity style={{ width: 100 }} onPress={onLeftPress}>
                  <Text style={{ marginLeft: 20 }}>{leftText}</Text>
                </TouchableOpacity>
                : null}

                <Text style={[styles.titleStyle, titleColor ? { color: titleColor } : null]}>
                    {title}
                </Text>

                <TouchableOpacity style={{ width: 100 }} onPress={onRightPress}>
                    <Text style={[styles.rightText, rightTextColor ? { color: rightTextColor } : null]}>
                        {rightText}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = LVStyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" ? 20 : 0,
        width: "100%",
        height: Platform.OS === "ios" ? 64 : PixelRatio.get() * 15,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        alignItems: "center",
        phone: {
            height: Platform.OS === "ios" ? 64 : PixelRatio.get() * 15
        },
        pad: {
            height: 50
        }
    },

    backStyle: {
        left: 20,
        position: "absolute",
        backgroundColor: "transparent"
    },

    titleStyle: {
        color: PLColors.PL_TEXT_BLACK_DARK,
        fontSize: 18
    },

    rightText: {
        marginRight: 20,
        fontSize: 15,
        textAlign: "right"
    },

    leftText: {
      fontSize: 15,
      textAlign: "left"
    }
});
