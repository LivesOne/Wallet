//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View } from 'react-native'
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';


export class ExportPurse extends Component {

    static navigationOptions = {
        header: null
    };
    
    render() {
        return (
            <View>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_purse_export }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}/>
                <Text> ExportPurse </Text>
            </View>
        )
    }
}

export default ExportPurse