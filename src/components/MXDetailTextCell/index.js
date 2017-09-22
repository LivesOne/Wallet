/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class MXDetailTextCell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
        detailText: PropTypes.string,
        indicator: PropTypes.any,
        margin: PropTypes.number,
        textStyle: PropTypes.number,
        detailTextStyle: PropTypes.number,
        onPress: PropTypes.func
    };

    render() {
        const { text, detailText, indicator, margin, textStyle, detailTextStyle } = this.props;
        const hasRight = detailText || indicator;

        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                activeOpacity={0.7}
                onPress={this.props.onPress}
            >
                <View style={[styles.left, margin && { marginLeft: margin }]}>
                    <Text style={[styles.text, textStyle]}>{text}</Text>
                </View>

                {hasRight ? (
                    <View style={[styles.right, margin && { marginRight: margin }]}>
                        <Text style={[styles.detailText, detailTextStyle]}>{detailText}</Text>
                        {indicator ? <Image style={styles.indicator} source={indicator} /> : null}
                    </View>
                ) : (
                    <View/>
                )}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    left: {
        marginLeft: 15
    },
    right: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    indicator: {
        marginLeft: 4
    },
    text: {
        fontSize: 16,
        color: '#333333',
    },
    detailText: {
        fontSize: 12,
        color: '#999999',
    }
});
