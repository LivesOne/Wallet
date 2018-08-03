/*
 * Project: Venus
 * File: src/views/Profile/ProfileScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView,
    NativeModules, } from 'react-native';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import * as LVStyleSheet from '../../styles/LVStyleSheet';
import { MXSwitch } from '../../components/MXSwitch/index';
import { AUTH_FACE_ID, AUTH_TOUCH_ID, AUTH_PASSWORD } from '../Common/LVAuthView';
import LVConfiguration from '../../logic/LVConfiguration';

const WalletImage = require('../../assets/images/profile_wallet.png');
const TradingImage = require('../../assets/images/profile_trading.png');
const ContactsImage = require('../../assets/images/profile_contacts.png');
const FeedbackImage = require('../../assets/images/profile_feedback.png');
const SettingImage = require('../../assets/images/profile_setting.png');
const AboutImage = require('../../assets/images/profile_about.png');

const MineFaceidImage = require('../../assets/images/mine_faceid.png');
const MineTouchIdImage = require('../../assets/images/mine_touchid.png');
const MinePasswordImage = require('../../assets/images/mine_password.png');

const ProfileCell = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, height:60, marginLeft:-10}}>
                <Text numberOfLines={1} style={{fontSize:15, color:LVColor.text.grey2}}>
                    {props.title}
                </Text>
            </View>
        }
    />
  );

type Props = {
    navigation: Object,
};

export default class ProfleScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props: any) {
        super(props);
        this.state = {
            supportAuthType : '',
            authEnable : LVConfiguration.needAuthLogin === null ? false : LVConfiguration.needAuthLogin,
        };
    }

    authEnableSwitched(enable : boolean){
        LVConfiguration.setNeedAuthLogin(enable);
    }

    componentWillMount(){
        this.initAuthSupport();
    }

    initAuthSupport = async () => {
        try {
            let supportAuthType = null;
            let authEnable = await LVConfiguration.getNeedAuthlogin();

            const authSupportString = await NativeModules.LVReactExport.getAuthSupport();
            const authSupport = JSON.parse(authSupportString);
            if (authSupport.faceid === true) {
                supportAuthType = AUTH_FACE_ID;
            } else if (authSupport.touchid === true) {
                supportAuthType = AUTH_TOUCH_ID;
            }else {
                supportAuthType = AUTH_PASSWORD;
            }

            this.setState({
                supportAuthType : supportAuthType,
                authEnable : authEnable,
            });
            console.log("profileAuth current authSupportTYpe : " + supportAuthType + "---authEnable:" + authEnable);
        } catch (error) {
            console.log("profileAuth" + error);
        }
    }

    render() {

        let authIcon = MinePasswordImage;
        let authText = LVStrings.auth_mine_use_password;
        if(this.state.supportAuthType === AUTH_FACE_ID){
            authIcon = MineFaceidImage;
            authText = LVStrings.auth_use_face_id;
        } else if(this.state.supportAuthType === AUTH_TOUCH_ID){
            authIcon = MineTouchIdImage;
            authText = LVStrings.auth_use_finger;
        }
        
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title = {LVStrings.profile}
                    hideLeft={true}
                    style={{backgroundColor:LVColor.white}}
                    titleStyle={{color:LVColor.text.grey2, fontSize:LVSize.large}}
                />
                <ScrollView><TableView>
                    <Section 
                        sectionPaddingTop={20} 
                        sectionPaddingBottom={0} 
                        sectionTintColor= {LVColor.primaryBack} 
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
                        <ProfileCell
                            title={LVStrings.profile_contacts}
                            accessory="DisclosureIndicator"
                            onPress={() => this.props.navigation.navigate('ContactList', {readonly: false})}
                            disableImageResize
                            image={<Image source={ContactsImage} style={styles.tableViewImage}/>}
                        />

                        <View style = {styles.authViewContainer}>
                            <Image style = {{marginLeft : 13}}
                                source = {authIcon}/>

                            <Text numberOfLines={1} style = {styles.authViewText}>
                                {authText}
                            </Text>

                            <MXSwitch 
                                value = {this.state.authEnable}
                                onSwitched = {this.authEnableSwitched.bind(this)}
                            />
                        </View>
                    </Section>
                    <Section 
                        sectionPaddingTop={9} 
                        sectionPaddingBottom={0} 
                        sectionTintColor= {LVColor.primaryBack} 
                        separatorTintColor={"transparent"}
                        hideSeparator
                    >
                        <ProfileCell
                            title={LVStrings.profile_about}
                            accessory="DisclosureIndicator"
                            onPress={() => this.props.navigation.navigate('About')}
                            disableImageResize
                            image={<Image source={AboutImage} style={styles.tableViewImage}/>}
                        />
                        <Separator insetRight={15} tintColor={LVColor.separateLine}/>
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
        width: 21,
        height: 21,
    },
    authViewContainer : {
        backgroundColor: LVColor.white,
        alignItems: 'center', 
        flexDirection: 'row', 
        flex: 1, 
        height:60, 
        paddingRight : 10,
    },
    authViewText : {
        flex : 1,
        fontSize:15, 
        marginLeft : 5,
        color:LVColor.text.grey2
    }
});