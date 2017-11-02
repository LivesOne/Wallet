//@flow
'use strict'

import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Image,
    ViewPropTypes,
    TouchableOpacity
} from 'react-native';
import LVColor from './../../styles/LVColor';
import PropTypes from 'prop-types';
const AddContractsIcon = require('../../assets/images/transfer_add_contracts.png');
const QrScanIcon = require('../../assets/images/transfer_scan.png');

export class ImageTextInput extends Component {

    state: {
        text: ?string,
      }
    
    constructor(props: any) {
        super(props);
        this.state = { text: null};
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText = function(newText: string) {
        this.setState({ text:newText });
        this.props.onTextChanged && this.props.onTextChanged(newText);
    }

    static propTypes = {
        placeholder: PropTypes.string,
        style: ViewPropTypes.style,
        onTextChanged: PropTypes.func,
        onAddClicked: PropTypes.func,
        onScanClicked: PropTypes.func,
        KeyboardType: PropTypes.string,
        value: PropTypes.string,
    };

    render() {
        const { style, placeholder, secureTextEntry, keyboardType, onAddClicked, onScanClicked, value} = this.props;
        return (
            <View style={[styles.container, style]}>
                <TextInput style={styles.textInput}
                    placeholder={placeholder}
                    underlineColorAndroid = {'transparent'}
                    placeholderTextColor = { LVColor.text.placeHolder }
                    onChangeText = {this.onChangeText}
                    value={value}/>
                    <TouchableOpacity
                        onPress={onAddClicked} >
                        <Image source={AddContractsIcon}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={ styles.qrScan }
                        onPress={onScanClicked} >
                        <Image  source={QrScanIcon}></Image>
                    </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        height: 50,
        width: '100%',
        borderWidth:  StyleSheet.hairlineWidth,
        backgroundColor: 'white',
        borderColor : "transparent",
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor: LVColor.border.editTextBottomBoarder,
    },
    textInput: {
        flex:1,
        fontSize:15,
        color: LVColor.text.editTextContent,
    },
    qrScan : {
        marginLeft:15, 
        marginRight:2
    }
});

export default ImageTextInput