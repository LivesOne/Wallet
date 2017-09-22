/*
 * Project: Venus
 * File: src/views/Assets/PurseCreateSuccessPage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet'
import MXNavigatorHeader from './../../components/MXNavigatorHeader';

const createSuccessImage = require("../../assets/images/create_wallet_success.png");

export default class PurseCreateOrImportPage extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style = {styles.container}>
                <MXNavigatorHeader
                    title = {LVStrings.create_wallet}
                    onLeftPress = {() => {
                        this.props.navigation.goBack();
                    }}
                />
                <Image source={createSuccessImage} style = {styles.image}/>
                <Text style={styles.text}>创建成功！</Text>
                <Text style={styles.detailText}>平台不储存用户的私人密码，密码无法找回或重置，强烈建议您在使用钱包前做好钱包备份！</Text>
                <MXButton
                    rounded                
                    title={"备份钱包"}
                    onPress = {() => {
                        
                    }}
                    themeStyle={"active"}
                    style={styles.backupButton}
                />
            </View>
        )
    }
}

const styles = LVStyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        backgroundColor: LVColor.white,
    },
    image: {
        marginTop: 50,
        width: 145, 
        height: 145,
    },
    text: {
        fontSize: 18,
        color: "#667383",
        marginTop: 5,
    },
    detailText: {
        fontSize: 12,
        color: "#667383",
        marginTop: 55,
        marginLeft: 34,
        marginRight: 34,
        lineHeight: 20,
    },
    backupButton: {
        marginTop: 20,
    },
});