//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor'
import MXCrossTextInput from './../../../components/MXCrossTextInput';

export class ModifyWalletName extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
        newName: string,
    }

    constructor() {
        super();
        this.state = {
            newName: ''
        }
    }

    onTextChanged(newName: string) {
        this.setState({newName: newName})
    }

    onSavePressed() {
        alert(this.state.newName)
    }
    
    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1}}>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_wallet_modify_name }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right = { LVStrings.profile_wallet_save }
                    rightTextColor = { LVColor.primary }
                    onRightPress={this.onSavePressed.bind(this)}/>
                    <View style= {{ paddingHorizontal:12.5}}>
                        <Text style={styles.text}>
                        { LVStrings.profile_wallet_name }</Text>
                        <MXCrossTextInput
                            style={styles.textInput}
                            placeholder= { LVStrings.profile_wallet_new_name }
                            onTextChanged={ this.onTextChanged.bind(this) }
                        />
                    </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginTop: 15, 
        marginBottom:5, 
        color: LVColor.primary, 
        fontSize: 16,
    },
    textInput: {
        width: '100%'
    }
});

export default ModifyWalletName