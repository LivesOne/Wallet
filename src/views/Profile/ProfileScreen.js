/*
 * Project: Venus
 * File: src/views/Profile/ProfileScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet';

const WalletImage = require('../../assets/images/profile_wallet.png');
const TradingImage = require('../../assets/images/profile_trading.png');
const ContactsImage = require('../../assets/images/profile_contacts.png');
const FeedbackImage = require('../../assets/images/profile_feedback.png');
const SettingImage = require('../../assets/images/profile_setting.png');
const AboutImage = require('../../assets/images/profile_about.png');

const ProfileCell = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, height:60, marginLeft:-10}}>
                <Text numberOfLines={1} style={{fontSize:15, color:"#667383"}}>
                    {props.title}
                </Text>
            </View>
        }
    />
  );

export default class ProfleScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title = {LVStrings.profile}
                    hideLeft={true}
                    style={{backgroundColor:'#f8f9fb'}}
                    titleStyle={{color:'#6d798a'}}
                />
                <ScrollView><TableView>
                    <Section 
                        sectionPaddingTop={0} 
                        sectionPaddingBottom={0} 
                        separatorTintColor={"transparent"}
                        hideSeparator
                    >
                        <ProfileCell
                            title={LVStrings.profile_wallet_manager}
                            accessory="DisclosureIndicator"
                            onPress={() => this.props.navigation.navigate('WalletManager')}
                            disableImageResize
                            image={<Image source={WalletImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <ProfileCell
                            title={LVStrings.profile_trading_record}
                            accessory="DisclosureIndicator"
                            onPress={() => alert(LVStrings.profile_trading_record)}
                            disableImageResize
                            image={<Image source={TradingImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <ProfileCell
                            title={LVStrings.profile_contacts}
                            accessory="DisclosureIndicator"
                            onPress={() => this.props.navigation.navigate('ContactList')}
                            disableImageResize
                            image={<Image source={ContactsImage} style={styles.tableViewImage}/>}
                        />
                    </Section>
                    <Section 
                        sectionPaddingTop={9} 
                        sectionPaddingBottom={0} 
                        sectionTintColor="#f5f6fa" 
                        separatorTintColor={"transparent"}
                        hideSeparator
                    >
                        <ProfileCell
                            title={LVStrings.profile_feedback}
                            accessory="DisclosureIndicator"
                            onPress={() => alert(LVStrings.profile_feedback)}
                            disableImageResize
                            image={<Image source={FeedbackImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <ProfileCell
                            title={LVStrings.profile_setting}
                            accessory="DisclosureIndicator"
                            onPress={() => alert(LVStrings.profile_setting)}
                            disableImageResize
                            image={<Image source={SettingImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <ProfileCell
                            title={LVStrings.profile_about}
                            accessory="DisclosureIndicator"
                            onPress={() => alert(LVStrings.profile_about)}
                            disableImageResize
                            image={<Image source={AboutImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                    </Section>
                </TableView></ScrollView>
            </View>
        )
    }
}

const styles = LVStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white,
    },
    tableViewImage: {
        marginLeft: -2.5,
        width: 26,
        height: 26,
    },
});