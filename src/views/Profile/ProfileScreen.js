/*
 * Project: Venus
 * File: src/views/Profile/ProfileScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

const PurseImage = require('../../assets/images/profile_purse.png');
const TradingImage = require('../../assets/images/profile_trading.png');
const ContactsImage = require('../../assets/images/profile_contacts.png');
const FeedbackImage = require('../../assets/images/profile_feedback.png');
const SettingImage = require('../../assets/images/profile_setting.png');
const AboutImage = require('../../assets/images/profile_about.png');

export default class ProfleScreen extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View>
                <MXNavigatorHeader
                    title = {'我的'}
                    style={{backgroundColor:'#F8F9FB'}}
                    titleStyle={{color:'#6d798a'}}
                />
                <TableView>
                    <Section>
                        <Cell
                            title="钱包管理"
                            accessory="DisclosureIndicator"
                            onPress={() => this.props.navigation.navigate('PurseManager')}
                            image={<Image source={PurseImage}/>}
                        />
                        <Cell
                            title="交易记录"
                            accessory="DisclosureIndicator"
                            onPress={() => alert("交易记录")}
                            image={<Image source={TradingImage}/>}
                        />
                        <Cell
                            title="联系人"
                            accessory="DisclosureIndicator"
                            onPress={() => alert("联系人")}
                            image={<Image source={ContactsImage}/>}
                        />
                    </Section>
                    <Section>
                        <Cell
                            title="问题反馈"
                            accessory="DisclosureIndicator"
                            onPress={() => alert("问题反馈")}
                            image={<Image source={FeedbackImage}/>}
                        />
                        <Cell
                            title="系统信息"
                            accessory="DisclosureIndicator"
                            onPress={() => alert("系统信息")}
                            image={<Image source={SettingImage}/>}
                        />
                        <Cell
                            title="关于我们"
                            accessory="DisclosureIndicator"
                            onPress={() => alert("关于我们")}
                            image={<Image source={AboutImage}/>}
                        />
                    </Section>
                </TableView>
            </View>
        )
    }
}