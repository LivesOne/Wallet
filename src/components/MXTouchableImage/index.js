/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class MXTouchableImage extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        source: PropTypes.any,
        onPress: PropTypes.func
    };

    render() {
        return (
            <TouchableOpacity style={[styles.img, this.props.style]} activeOpacity={0.8} onPress={this.props.onPress}>
                <Image source={this.props.source} />
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    img: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
