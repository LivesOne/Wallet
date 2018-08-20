/*
 * Project: Wallet
 * File: src/views/Transfer/TransferMinerTips.js
 * @flow
 * author: xcl
 */

"use strict";

import React, { Component } from 'react';
import { Text, View, StyleSheet, Easing, TextInput, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modalbox';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVColor from './../../styles/LVColor';
import * as MXUtils from './../../utils/MXUtils';
import LVStrings from './../../assets/localization';
import LVSize from '../../styles/LVFontSize';

type Props = {
    navigation: Object 
};

export default class TransferMinerTips extends Component<Props> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    render() {
        return (
            <View style = {styles.mainView}>
                <MXNavigatorHeader
                    style={{ backgroundColor: LVColor.white }}
                    title={LVStrings.transaction_minner_fee}
                    titleStyle={{color: LVColor.text.grey2, fontSize: LVSize.large}}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                    <View style = {styles.title}>
                        <Text style = {styles.titleText}>
                            {LVStrings.minnerfeedetail_title}
                        </Text>
                    </View>
                    <View style = {styles.lineView}/>
                    <View style = {styles.subContent}>
                        <Text style = {styles.subContentText}>
                            {LVStrings.minnerfeedetail_content}
                        </Text>
                    </View>
                    <View style= {styles.subTitle}>
                        <Text style = {styles.subTitleText}>
                            {LVStrings.minnerfeedetail_transferFail}
                        </Text>
                    </View>
                    <View style = {styles.content1}>
                        <Text style = {styles.contentTitle}>
                            {LVStrings.minnerfeedetail_title1}
                        </Text>
                        <Text style = {styles.content2}>
                            {LVStrings.minnerfeedetail_content1}
                        </Text>
                    </View>
                    <View style = {styles.content1}>
                        <Text style = {styles.contentTitle}>
                            {LVStrings.minnerfeedetail_title2}
                        </Text>
                        <Text style = {styles.content2}>
                            {LVStrings.minnerfeedetail_content2}
                        </Text>
                    </View>
                    <View style = {styles.content1}>
                        <Text style = {styles.contentTitle}>
                            {LVStrings.minnerfeedetail_title3}
                        </Text>
                        <Text style = {styles.content2}>
                            {LVStrings.minnerfeedetail_content3}
                        </Text>
                    </View>
                </ScrollView>
            </View>
    )}

}

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        justifyContent: 'flex-start',
        backgroundColor: LVColor.white,
      },
    title:{
        backgroundColor:LVColor.white,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 20
    },
    titleText:{
        fontSize:18,
        color:LVColor.text.editTextContent
    },
    subContent:{
        backgroundColor:LVColor.white,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        marginBottom: 20
    },
    subContentText:{
        fontSize:12, 
        color: LVColor.text.editTextNomal,
        lineHeight:21
    },
    subTitle:{
        backgroundColor: LVColor.white,
        marginLeft:15,
        marginRight:15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    subTitleText:{
        fontSize: 15, 
        color: LVColor.text.editTextContent,
        fontWeight: '500'
    },
    lineView:{
        backgroundColor: LVColor.separateLine2,
        height:1,marginLeft:15,
        marginRight:15,
        marginTop: 20
    },
    content1: {
        backgroundColor: LVColor.white,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    contentTitle:{
        fontSize:12,
        color:LVColor.text.editTextContent,
        fontWeight: '500'
    },
    content2: {
        marginTop:5,
        fontSize:12, 
        color: LVColor.text.editTextNomal,
        lineHeight:21
    },
});
