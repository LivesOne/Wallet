/*
 * Project: Venus
 * File: src/views/Common/LVDetailTextCell.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import MXDetailTextCell from '../../components/MXDetailTextCell';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';

const arrowImg = require('../../assets/images/show_detail_arrow.png');

export default class LVDetailTextCell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        text: PropTypes.string.isRequired,
        detailText: PropTypes.string,
        onPress: PropTypes.func
    };

    render() {
        const { style, text, detailText, onPress } = this.props;

        return (
            <MXDetailTextCell
                style={[styles.container, style]}
                text={text}
                detailText={detailText}
                indicator={arrowImg}
                margin={12.5}
                textStyle={styles.text}
                detailTextStyle={styles.detailText}
                onPress={onPress}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50
    },
    text: {
        fontSize: LVSize.default,
        color: LVColor.text.grey1,
    },
    detailText: {
        fontSize: LVSize.xsmall,
        color: LVColor.text.grey3,
    }
});
