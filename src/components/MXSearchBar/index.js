/*
 * Project: Wallet
 * File: src/components/MXSearch/index.js
 * @flow
 */

'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ViewPropTypes, Image, PixelRatio, Text, TouchableOpacity, TextInput ,Platform} from 'react-native';
import LVColor from '../../styles/LVColor';
import LVFontSize from '../../styles/LVFontSize';
import { width } from 'window-size';
import * as MXUtils from "../../utils/MXUtils";

const searchIcon = require('../../assets/images/searchBar_icon.png');

type Props = {
    placeholder?:string,
    style?:ViewPropTypes.style,
    keyboardType?:any,
    onTextChanged?:Function,
    onFocus?:Function,
    onEndEditing?:Function,
    text?:string,
}

type State = {
    hasFocus:boolean,
    currentText:string
}

export default class MXSearchBar extends Component<Props,State> {
    setText:Function;
    constructor(props: any) {
        super(props);
        this.state = {
            text:'',
            hasFocus:false,
            currentText:''
        };
    }

    setText = (text:string)=>{
        this.setState({
            currentText: text,
        });
        this.props.onTextChanged && this.props.onTextChanged(text);
    };
    
    onChangeText = (newText:string) => {
        this.setState({
            currentText: newText,
        });
        this.props.onTextChanged && this.props.onTextChanged(newText);
    };

    onPressClear = ()=>{
        this.setText('');
    };

    render (){
        const {placeholder,keyboardType,style,onFocus,onEndEditing,text} = this.props;
        return (
            <View style = {[styles.containView,style]}>
                <View style = {{marginLeft:10}}>
                    <Image source = {searchIcon}/>
                </View>
                <TextInput
                            ref={'searchtextinput'}
                            placeholder={placeholder}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={LVColor.text.placeHolder}
                            value={text}
                            keyboardType={keyboardType}
                            style={styles.textInput}
                            clearButtonMode={'while-editing'}
                            onChangeText={this.onChangeText.bind(this)}
                            onFocus={() => {
                                onFocus && onFocus();
                                this.refs.searchtextinput.focus();
                                this.setState({
                                    hasFocus:true
                                })
                            }}
                            onEndEditing={() => {
                                onEndEditing && onEndEditing();
                                this.refs.searchtextinput.blur();
                                this.setState({
                                    hasFocus:false
                                })
                            }}
                        />
                <View style={{justifyContent:'center'}}>
                        { (Platform.OS === 'android') &&
                            this.state.currentText !== null &&
                            this.state.currentText !== '' && 
                            this.state.currentText !== undefined &&
                            this.state.hasFocus && (
                                <TouchableOpacity style={{}} onPress={this.onPressClear.bind(this)}>
                                    <Image source={require('../../assets/images/edit_clear.png')} />
                                </TouchableOpacity>
                            )}
                    </View>	
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containView:{
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: LVColor.searchBar.background,
        borderRadius: 8,
        width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get(),
    },
    textInput:{
        fontSize: 17,
        textAlign:'left',
        fontWeight: '500',
        // width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get() - 40,
        marginLeft:5,
        color:LVColor.primary,
        flex:1
    },
});