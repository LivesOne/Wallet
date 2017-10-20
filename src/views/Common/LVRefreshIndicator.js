/*
 * Project: Venus
 * File: src/views/Common/LVRefreshIndicator.js
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import LVColor from '../../styles/LVColor';

const IndicatorHeight = 100;

export default class LVRefreshIndicator extends Component {
    static indicatorHeight = IndicatorHeight;
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.circle}>
                    <Progress.CircleSnail size={26} color={[LVColor.primary]} />
                </View>
            </View>
        );
    }
}

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: IndicatorHeight
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: '#ACBFE5',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LVColor.white
    }
});
