/*
 * Project: Wallet
 * File: src/views/contacts/LVTContactDetailPage.js
 * author: xcl
 * @flow
 */
"use strict";

import React, { Component } from 'react'
import { Dimensions, Text,StatusBar, View, StyleSheet, Image,TouchableHighlight, FlatList,PixelRatio,ScrollView } from 'react-native';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
import TransferUtils from '../Transfer/TransferUtils';
import { converAddressToDisplayableText} from '../../utils/MXStringUtils';
import MXButton from '../../components/MXButton';
import * as MXUtils from "../../utils/MXUtils";

const AvatarIcon = require('../../assets/images/contact_detail_avatar.png');


type Props = {navigation: Object};

type State =  {
    name: string,
    address: string,
    cellPhone: string,
    email: string,
    navTitle: string,
    mode: string,
    contactsDetail: Array<Object>,
};

export default class LVTContactDetailPage extends Component<Props,State>{
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };
    renderRow : Function;
    onAccountTransferDone:Function;
    constructor(props: any) {
        super();

        const { params } = props.navigation.state;
        const navTitle = LVStrings.contact_Detail_Title;
        const model = params.model;
        if(!model) {
            this.state = {
                name: '',
                address: '',
                cellPhone: '',
                email: '',
                navTitle: navTitle,
                mode: params.mode,
                contactsDetail: [],
            };
        } else {
            this.state = {
                name: model.name,
                address: model.address,
                cellPhone: model.cellPhone,
                email: model.email,
                navTitle: model.name +  navTitle,
                mode: params.mode,
                contactsDetail: [
                {name:LVStrings.contact_add_place_nickname,nameValue:model.name},
                {name:LVStrings.contact_add_place_address,nameValue:model.address},
                {name:LVStrings.contact_add_place_cellphone,nameValue:model.cellPhone},
                {name:LVStrings.contact_add_place_email,nameValue:model.email}],
            };
        }
        this.renderRow = this.renderRow.bind(this);
        this.onAccountTransferDone = this.onAccountTransferDone.bind(this);
    };

    componentWillMount() {
        StatusBar.setBarStyle('default', true);
    }

    onAccountTransferDone = ()=> {
        this.props.navigation.navigate('Transfer', { address: this.state.address, token: 'LVTC' });
    };

    renderRow({item,index}: any) {
        let nameV = item.nameValue;
        if (index == 1) {
            nameV = converAddressToDisplayableText(TransferUtils.removeHexHeader(item.nameValue),9,9);
        }
        return (
                    <View style={styles.cellContentContainer}>
                        <View style={styles.cellLeftContentContainer}>
                            <Text style = {styles.cellNameText}>
                                {item.name}
                            </Text>
                        </View>
                        <View style = {styles.cellRightContentContainer}>
                            <Text style = {styles.cellNameValueText}>
                            {nameV}
                            </Text>
                        </View>
                    </View>
        );
    }

    render() {
       return (
            <View style={styles.rootView}>
            <MXNavigatorHeader
                left={ greyNavigationBackIcon }
                style={styles.nav}
                title={ this.state.navTitle }
                titleStyle={styles.navTitle}
                onLeftPress={ () => {this.props.navigation.goBack() }}
            />
            <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style = {styles.avatarView}>
                        <Image source = {AvatarIcon}/>
                    </View>
                    <View style = {styles.nameTitle}>
                        <Text style = {styles.nameTitleText}>
                            {this.state.name}
                        </Text>
                    </View>
                    <View style = {styles.avatarViewLine}>
                    </View>
                    <View style = {styles.flatList}>
                        <FlatList
                            scrollEnabled={true}
                            extraData={this.state}
                            data={this.state.contactsDetail}
                            keyExtractor={(item,index)=> item.name}
                            renderItem={this.renderRow}
                            />
                    </View>
                    <View style = {{backgroundColor: LVColor.separateLine,height: 1,paddingRight:15,paddingLeft:15,width:MXUtils.getDeviceWidth() - 18 * PixelRatio.get()}}>
                    </View>
                    <MXButton
                                style={styles.button}
                                title={LVStrings.contact_Detail_Button}
                                isEmptyButtonType={false}
                                rounded
                                onPress={this.onAccountTransferDone}
                    /> 
                </View>
            </ScrollView>
            
            </View>
       );
    }
}

const styles = StyleSheet.create({
    nav: {
        backgroundColor : LVColor.profileNavBack
    },
    navTitle: {
        color: LVColor.profileNavTitleColor
    },
    rootView: {
        flex:1,
        backgroundColor: LVColor.white
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    avatarView: {
        marginTop:20,
        height: 60
    },
    nameTitle:{
        marginTop: 8
    },
    nameTitleText:{
        fontSize: 18,
        color: LVColor.primary
    },
    avatarViewLine: {
        marginTop: 14,
        backgroundColor: LVColor.separateLine,
        height: 1,
        width: "100%"
    },
    cellContentContainer: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white,
        paddingRight: 15,
        paddingLeft: 15,
    },
    cellLeftContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cellRightContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    flatList:{marginTop: 0,
        height: 4 * 60,
        width: '100%'
    },
    cellNameText:{fontSize:15,
        color:LVColor.text.grey2
    },
    cellNameValueText:{
        fontSize: 14,
        color: LVColor.text.placeHolder
    },
    button:{
        height: 50,
        width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get(),
        marginTop:125,
        marginBottom:100,
    }
});