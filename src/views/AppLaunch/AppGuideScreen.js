/*
 * Project: Venus
 * File: src/views/AppIntro/AppGuideScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import MXButton from '../../components/MXButton';

const pageImage_1 = require('../../assets/images/app_guide_page_1.jpg');
const pageImage_2 = require('../../assets/images/app_guide_page_2.jpg');
const pageImage_3 = require('../../assets/images/app_guide_page_3.jpg');

export default class AppGuideScreen extends Component {
    static propTypes = {
        callback: PropTypes.func
    };

    onPressButton = () => {
        if (this.props.callback) {
            this.props.callback();
        }
    };

    render() {
        return (
            <Swiper
                style={styles.wrapper}
                activeDotStyle={styles.activeDot}
                activeDotColor={LVColor.primary}
                loop={false}
            >
                <View style={styles.slide}>
                    <ImageBackground style={styles.background} source={pageImage_1} resizeMode="cover">
                        <View style={styles.bottomPanel}>
                            <Text style={styles.mainText}>{LVStrings.guide_master_1}</Text>
                            <Text style={styles.detailText}>{LVStrings.guide_detail_1}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.slide}>
                    <ImageBackground style={styles.background} source={pageImage_2}>
                        <View style={styles.bottomPanel}>
                            <Text style={styles.mainText}>{LVStrings.guide_master_2}</Text>
                            <Text style={styles.detailText}>{LVStrings.guide_detail_2}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.slide}>
                    <ImageBackground style={styles.background} source={pageImage_3}>
                        <View style={styles.bottomPanel}>
                            <Text style={styles.mainText}>{LVStrings.guide_master_3}</Text>
                            <Text style={styles.detailText}>{LVStrings.guide_detail_3}</Text>
                            <MXButton
                                style={styles.button}
                                title={LVStrings.guide_button_title}
                                rounded
                                onPress={this.onPressButton.bind(this)}
                            />
                        </View>
                    </ImageBackground>
                </View>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {},
    activeDot: {
        width: 16,
        height: 8,
        borderRadius: 4
    },
    slide: {
        flex: 1
    },
    background: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    bottomPanel: {
        marginBottom: 40,
        height: 120,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    mainText: {
        fontSize: 26,
        textAlign: 'center',
        color: LVColor.text.dot3
    },
    detailText: {
        marginTop: 5,
        marginBottom: 15,
        fontSize: 18,
        textAlign: 'center',
        color: LVColor.text.dot3
    },
    button: {
        width: 140,
        height: 36
    }
});
