/*
 * Project: Venus
 * File: src/views/Assets/WalletCreateOrImportPage.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import MXButton from '../../components/MXButton';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet'
import LVWalletCreationNavigator from '../Wallet/LVWalletCreationNavigator';
import WalletImportPage from '../Wallet/WalletImportPage';
import LVFullScreenModalView from '../Common/LVFullScreenModalView';
import WalletUtils from './WalletUtils';
import LVWalletImportNavigator from './LVWalletImportNavigator';

const createImage = require("../../assets/images/create_wallet.png");

export default class WalletCreateOrImportPage extends Component {    
    render() {
        return (
            <View style = {styles.container}>
                <Image source={createImage} style = {styles.image}/>
                <MXButton
                    rounded
                    title={LVStrings.wallet_create_wallet}
                    onPress = {() => {
                        this.refs.creationPage.show();
                    }}
                    themeStyle={"active"}
                    style={styles.createButton}
                />
                <MXButton
                    rounded                
                    title={LVStrings.wallet_import_header}
                    onPress = {() => {
                        this.refs.importPage.show();
                    }}
                    themeStyle={"active"}
                    style={styles.importButton}
                />
                <LVFullScreenModalView ref={'creationPage'}>
                    <LVWalletCreationNavigator screenProps={{dismiss: ()=> {
                        this.refs.creationPage.dismiss()
                    } 
                }}/>
                </LVFullScreenModalView>
                <LVFullScreenModalView ref={'importPage'}>
                    <LVWalletImportNavigator screenProps={{dismiss: ()=> {
                        this.refs.importPage.dismiss()
                    } , from: WalletUtils.OPEN_IMPORT_FROM_LAUNCH
                }}/>
                </LVFullScreenModalView>
            </View>
        )
    }
}

const styles = LVStyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: LVColor.white,
    },
    image: {
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