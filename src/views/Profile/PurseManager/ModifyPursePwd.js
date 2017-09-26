//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
const IconBack = require('../../../assets/images/back_grey.png');
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor'
import MXCrossTextInput from './../../../components/MXCrossTextInput';

export class ModifyPursePwd extends Component {

    static navigationOptions = {
        header: null
    };

    state: {
        curPwd: string,
        newPwd: string,
        newConfirmPwd: string,
    }

    constructor() {
        super();
        this.state = {
            curPwd: '',
            newPwd: '',
            newConfirmPwd: ''
        }
    }

    onSavePressed() {
        alert(this.state.newPwd)
    }

    onCurPwdChanged(curPwd: string) {
        this.setState({curPwd: curPwd})
    }

    onNewPwdChanged(newPwd: string) {
        this.setState({newPwd: newPwd})
    }

    onConfirmPwdChanged(newConfirmPwd: string) {
        this.setState({newConfirmPwd: newConfirmPwd})
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1}}>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ LVStrings.profile_purse_modify_password }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right = { LVStrings.profile_purse_save }
                    rightTextColor = { LVColor.primary }
                    onRightPress={ this.onSavePressed.bind(this) }/>
                <View style= {{ paddingHorizontal:12.5}}>
                    <Text style={styles.text}>  
                    { LVStrings.profile_purse_cur_password }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.profile_purse_cur_password }
                        onTextChanged={ this.onCurPwdChanged.bind(this) }
                    />
                    <Text style={styles.text}>
                    { LVStrings.profile_purse_new_password }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.assets_import_private_password_hint }
                        onTextChanged={ this.onNewPwdChanged.bind(this) }
                    />
                    <Text style={styles.text}>
                    { LVStrings.profile_purse_password_confirm }</Text>
                    <MXCrossTextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder= { LVStrings.assets_import_private_pwd_confirm_hint }
                        onTextChanged={ this.onConfirmPwdChanged.bind(this) }
                    />
                    <View style={{ marginTop: 25, flexDirection: 'row'}}>
                        <Text style={{color: LVColor.text.editTextContent}}>{ LVStrings.profile_purse_password_hint }
                            <Text style={{marginLeft: 10, color: '#1f7fff'}}
                                onPress={()=>{alert('press')}}>
                                { LVStrings.profile_purse_import_right_now }
                            </Text>
                        </Text>
                    </View>
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
        fontSize: 16
    },
    textInput: {
        width: '100%'
    }
});
export default ModifyPursePwd