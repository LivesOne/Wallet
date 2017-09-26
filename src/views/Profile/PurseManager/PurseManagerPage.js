//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import PurseInfoView from '../../Assets/PurseInfoView';
import LVSize from '../../../styles/LVFontSize';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import MXButton from './../../../components/MXButton';
import LVStrings from '../../../assets/localization';

const IconPurseModifyName = require('../../../assets/images/purse_modify_name.png');
const IconPurseModifyPwd = require('../../../assets/images/purse_modify_pwd.png');
const IconPurseExportPK = require('../../../assets/images/purse_export_pk.png');
const IconShowDetailArrow = require('../../../assets/images/show_detail_arrow.png');
const IconPurse = require('../../../assets/images/purse_grey.png');
const IconBack = require('../../../assets/images/back_grey.png');

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
        <View style={{alignItems: 'center', flexDirection: 'row', width: '100%', paddingVertical: 10 }}>
            <Image source={props.source}></Image> 
            <Text
                numberOfLines={1}
                style={{ flex: 1, fontSize: 16, marginLeft: 10, color: '#677384'}}
            >{props.title}</Text>
            <Image source={IconShowDetailArrow}></Image> 
        </View>
        }
        highlightActiveOpacity={0.8}
        highlightUnderlayColor={'grey'}
        onPress={props.onPress}
        contentContainerStyle = {{height: 55}}
    />
);

export class PurseManagerPage extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
        purseTitle: string,
        purseAddress: string,
    }

    constructor() {
        super();
        this.state = {
            purseTitle: '2,100,000 LVT',
            purseAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7'
        }
    }

    render() {
        return (
            <View style={ styles.container }>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_purse_title }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    />
                <PurseInfoView 
                    style={styles.purseInfo} title={ this.state.purseTitle } 
                    address={ this.state.purseAddress }
                    titleStyle={styles.purseTitle}
                    addressStyle={styles.purseAddress}
                    purseIcon={ IconPurse }
                     />
                <TableView>
                    <Section>
                        <CellVariant title= { LVStrings.profile_purse_modify_name } source={ IconPurseModifyName } 
                        onPress = {()=>{this.props.navigation.navigate('ModifyPurseName')}}/>
                        <CellVariant title= { LVStrings.profile_purse_modify_password } source={ IconPurseModifyPwd }
                        onPress = {()=>{this.props.navigation.navigate('ModifyPursePwd')}}/>
                        <CellVariant title= { LVStrings.profile_purse_export } source={ IconPurseExportPK }
                        onPress = {()=>{this.props.navigation.navigate('ExportPurse')}}/>
                    </Section>
                </TableView>
                <View style={{width: '100%', flex: 1, justifyContent:'flex-end', alignItems:'center', backgroundColor: 'white'}}>
                    <MXButton style={{marginBottom: 15}} title={ LVStrings.profile_purse_backup } rounded></MXButton>
                    <MXButton style={{marginBottom: 25}}title={ LVStrings.profile_purse_delete_purse } rounded></MXButton>
                </View>
                
            </View>
        )
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8F9FB'
    },
    purseInfo: {
        width: Window.width,
        height: 115,
        paddingHorizontal: 12.5,
        backgroundColor: 'white'
    },
    purseTitle: {
        marginTop: 2.5,
        marginBottom: 2.5,
        color: '#6d798a',
        backgroundColor: 'transparent',
        fontSize: LVSize.large,
        fontWeight: '500'
    },
    purseAddress: {
        color: '#bec4d0',
        width: 170,
        fontSize: LVSize.xsmall
    }
});

export default PurseManagerPage