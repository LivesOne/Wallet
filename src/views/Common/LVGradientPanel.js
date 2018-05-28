/*
 * Project: Venus
 * File: src/views/Common/LVGradientPanel.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = { 
    style?: ViewPropTypes.style,
    children?: React.ChildrenArray<React.Element<any>>
 };

export default class LVGradientPanel extends React.Component<Props> {
    render() {
        return (
            <LinearGradient
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                colors={['#FFA424', '#FF892E']}
                style={this.props.style}
            >
                {this.props.children}
            </LinearGradient>
        );
    }
}
