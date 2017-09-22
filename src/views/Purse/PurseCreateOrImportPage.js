/*
 * Project: Venus
 * File: src/views/Assets/PurseCreateOrImportPage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet'

const assetsIcon = require("../../assets/images/create_wallet.png");

export default class PurseCreateOrImportPage extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style = {styles.container}>
                <Image source={assetsIcon} style = {styles.image}/>
                <MXButton
                    rounded
                    title={LVStrings.create_wallet}
                    onPress = {() => {
                        this.props.navigation.navigate("PurseCreate")
                    }}
                    themeStyle={"active"}
                    style={styles.createButton}
                />
                <MXButton
                    rounded                
                    title={LVStrings.assets_import_header}
                    onPress = {() => {
                        this.props.navigation.navigate("PurseImport")
                    }}
                    themeStyle={"active"}
                    style={styles.importButton}
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
        marginTop: 110, 
        width: 220, 
        height: 220,
    },
    createButton: {
        marginTop: 80,
    },
    importButton: {
        marginTop: 25,
    },
});