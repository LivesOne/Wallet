//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import PurseInfoView from '../../Assets/PurseInfoView';
import LVSize from '../../../styles/LVFontSize';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import MXButton from './../../../components/MXButton';

const IconPurseModifyName = require('../../../assets/images/purse_modify_name.png');
const IconPurseModifyPwd = require('../../../assets/images/purse_modify_pwd.png');
const IconPurseExportPK = require('../../../assets/images/purse_export_pk.png');
const IconShowDetailArrow = require('../../../assets/images/show_detail_arrow.png');

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
        <View style={{alignItems: 'center', flexDirection: 'row', width: '100%', paddingVertical: 10 }}>
            <Image source={props.source}></Image> 
            <Text
                allowFontScaling
                numberOfLines={1}
                style={{ flex: 1, fontSize: 16, marginLeft: 10, color: '#677384'}}
            >{props.title}</Text>
            <Image source={IconShowDetailArrow}></Image> 
        </View>
        }
        highlightActiveOpacity={0.8}
        highlightUnderlayColor={'grey'}
        onPress={props.onPress}
        contentContainerStyle = {{height: 65}}
    />
);

export class PurseManagerPage extends Component {

    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={ styles.container }>
                <MXNavigatorHeader
                    left={require('../../../assets/images/back_grey.png')}
                    style={{backgroundColor:'#F8F9FB'}}
                    title={'傲游LivesToken'}
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    />
                <PurseInfoView 
                    style={styles.purseInfo} title={ '2,100,000 LVT' } 
                    address={'0x2A609SF354346FDHFHFGHGFJE6ASD119cB7'}
                    titleStyle={styles.purseTitle}
                    addressStyle={styles.purseAddress}
                    purseIcon={require('../../../assets/images/purse_grey.png')}
                     />
                <TableView>
                    <Section>
                        <CellVariant title="修改钱包名称" source={ IconPurseModifyName } onPress = {()=>{alert('click me')}}/>
                        <CellVariant title="修改钱包密码" source={ IconPurseModifyPwd }/>
                        <CellVariant title="导出私钥" source={ IconPurseExportPK }/>
                    </Section>
                </TableView>
                <View style={{flex: 1, justifyContent:'flex-end'}}>
                    <MXButton style={{marginBottom: 15}} title={ '备份Keystore'} rounded></MXButton>
                    <MXButton style={{marginBottom: 25}}title={ '删除钱包' } rounded></MXButton>
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
        height: 125,
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