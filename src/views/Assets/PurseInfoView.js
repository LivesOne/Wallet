/*
 * Project: Venus
 * File: src/views/Assets/PurseInfoView.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';

const purseIcon = require('../../assets/images/assets_purse.png');

export default class PurseInfoView extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleStyle: Text.propTypes.style,
        address: PropTypes.string,
        addressStyle: Text.propTypes.style,
        purseIcon: PropTypes.any,
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={this.props.purseIcon || purseIcon} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.text, styles.purseTitle, this.props.titleStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {this.props.title}
                    </Text>
                    <Text style={[styles.text, styles.purseAddress, this.props.addressStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {this.props.address}
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
    purseTitle: {
        fontSize: LVSize.large,
        fontWeight: '500'
    },
    purseAddress: {
        width: 170,
        fontSize: LVSize.xsmall
    }
});
