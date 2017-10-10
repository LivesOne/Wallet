/*
 * Project: Venus
 * File: src/views/Assets/WalletCreatePage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TextInput } from 'react-native';
import MXButton from '../../components/MXButton';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet';
import LVGradientPanel from '../Common/LVGradientPanel';
import MXTouchableImage from '../../components/MXTouchableImage';
import MXCrossTextInput from '../../components/MXCrossTextInput';

const backImg = require('../../assets/images/back.png');

export default class WalletCreatePage extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <LVGradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <MXTouchableImage 
                            style={styles.navBack} 
                            source={backImg}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                        <Text style={styles.navTitle}>{LVStrings.wallet_create_wallet}</Text>
                        <View style={styles.navRightPlaceholder} />
                    </View>
                </LVGradientPanel>
                <View style={styles.content}>
                    <View style={styles.textInputContainer}>
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_wallet}
                            style={ styles.textInput }
                        />
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password}
                            style={ styles.textInput }
                            secureTextEntry
                        />
                        <MXCrossTextInput
                            placeholder={LVStrings.wallet_create_password_verify}
                            style={ styles.textInput }
                            secureTextEntry
                            withUnderLine = {false}
                        />
                    </View>
                    <Text style={styles.text}>{LVStrings.wallet_create_comment}</Text>
                    <MXButton
                        rounded                
                        title={LVStrings.wallet_create}
                        onPress = {() => {
                            this.props.navigation.navigate("WalletCreateSuccess")
                        }}
                        themeStyle={"active"}
                        style={styles.createButton}
                    />
                </View>
            </View>
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = LVStyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: LVColor.white,
    },
    gradient: {
        width: '100%',
        height: 170,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    nav: {
        width: '100%',
        height: 64,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    navBack: {
        paddingLeft: 12.5,
        width: 36.5,
    },
    navRightPlaceholder: {
        paddingRight: 12.5,
        width: 36.5,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: -86,
        width: Window.width,
    },
    textInputContainer: {
        alignItems: 'center',
        shadowOffset: {width: 0, height: 3},
        shadowColor: "#bfc5d1",
        shadowOpacity: 0.2,
        shadowRadius: 15,
        borderRadius: 5,
        width: Window.width - 25,
    },
    textInput: {
        height: 60,
        width: Window.width - 65,
    },
    text: {
        marginTop: 15,
        width: Window.width - 25,
        fontSize: 12,
        color: "#667383",
        textAlign: "center",
    },
    createButton: {
        marginTop: 35,
    },
});