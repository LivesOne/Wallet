/*
 * Project: Venus
 * File: src/views/Assets/WalletCreateSuccessPage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet'
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
const createSuccessImage = require("../../assets/images/create_wallet_success.png");

export default class WalletCreateOrImportPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    render() {
        return (
            <View style = {styles.container}>
                <MXNavigatorHeader
                    title = {LVStrings.wallet_create_wallet}
                    onLeftPress = {() => {
                        if(this.props.screenProps.dismiss) {
                            this.props.screenProps.dismiss();
                        } else {
                            this.props.navigation.goBack();
                        }
                    }}
                />
                <Image source={createSuccessImage} style = {styles.image}/>
                <Text style={styles.text}>{LVStrings.wallet_create_success}</Text>
                <Text style={styles.detailText}>{LVStrings.wallet_create_success_comment}</Text>
                <MXButton
                    rounded                
                    title={LVStrings.wallet_backup}
                    onPress = {() => {
                        this.props.navigation.navigate('ImportOrCreate');
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