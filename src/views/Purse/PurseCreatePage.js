/*
 * Project: Venus
 * File: src/views/Assets/PurseCreatePage.js
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
import GradientPanel from '../Common/GradientPanel';
import DetailTextCell from '../Common/DetailTextCell';
import MXTouchableImage from '../../components/MXTouchableImage';

const assetsIcon = require("../../assets/images/create_wallet.png");
const backImg = require('../../assets/images/back.png');

export default class PurseCreatePage extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <GradientPanel style={styles.gradient}>
                    <View style={styles.nav}>
                        <MXTouchableImage 
                            style={styles.navBack} 
                            source={backImg}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                        <Text style={styles.navTitle}>{LVStrings.create_wallet}</Text>
                        <View style={styles.navRightPlaceholder} />
                    </View>
                </GradientPanel>
                <View style={styles.content}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder={ "钱包名称" }
                            style={ styles.textInput }
                        />
                        <TextInput
                            placeholder={ "设置钱包密码（6-12位字母数字组合）" }
                            style={ styles.textInput }
                        />
                        <TextInput
                            placeholder={ "重复输入密码" }
                            style={ styles.textInput }
                        />
                    </View>
                    <Text style={styles.text}>该密码用来加密钱包地址，请尽量设置复杂密码完成加密。</Text>
                    <MXButton
                        rounded                
                        title={"创建"}
                        onPress = {() => {
                            //this.props.navigation.navigate("AssetsImport")
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
        alignItems: 'center'
    },
    gradient: {
        width: '100%',
        height: 170,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nav: {
        width: '100%',
        height: 64,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navTitle: {
        fontSize: LVSize.large,
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    navBack: {
        paddingLeft: 12.5,
        width: 36.5
    },
    navRightPlaceholder: {
        paddingRight: 12.5,
        width: 36.5
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: -86,
    },
    textInputContainer: {
        
    },
    textInput: {
        backgroundColor: "#f8f9fb",
        height: 60,
        width: Window.width - 25,
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