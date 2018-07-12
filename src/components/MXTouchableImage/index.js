/**
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, ViewPropTypes, Image, TouchableOpacity } from 'react-native';

type Props = {
    style?: ViewPropTypes.style,
    source: number | React.Element<any>,
    onPress: Function,
    children?: React.Element<any>,
};

export default class MXTouchableImage extends React.Component<Props> {

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
