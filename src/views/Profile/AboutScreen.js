/*
 * Project: Venus
 * File: src/views/Profile/AboutScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import LVColors from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import LVFontSize from '../../styles/LVFontSize';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import { greyNavigationBackIcon } from '../../assets/LVIcons';

export default class PLAboutPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    getVersion() {
        if (Platform.OS === 'android') {
            return DeviceInfo.getVersion();
        } else {
            return DeviceInfo.getReadableVersion();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    left={greyNavigationBackIcon}
                    style={{ backgroundColor: LVColors.profileNavBack }}
                    title={LVStrings.profile_about}
                    titleStyle={{ color: '#6d798a', fontSize: LVFontSize.large }}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />

                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/logo.png')} style={styles.img} />
                    <Text style={{ fontSize: 15, color: LVColors.text.grey2, marginBottom: 40 }}>
                        {LVStrings.profile_version + ' ' + this.getVersion()}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    img: {
        marginTop: 140,
        marginBottom: 10
    }
});
