// @flow

'use strict'

import React, { Component } from 'react'
import {
    Text,
    View,
    ViewPropTypes,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import LVDialog from './LVDialog';
import LVStrings from './../../assets/localization';
import LVColor from '../../styles/LVColor';
import console from 'console-browserify';
import {  beautifyBalanceShow } from '../../utils/MXStringUtils';
const CloseIcon = require('../../assets/images/close_modal.png');
import Modal from 'react-native-modalbox';

const MAX_BALANCE_LENGTH_LIMIT = 13;
const FRAGMENT_LENGTH = 2;

export class LVBalanceShowView extends Component {

    static propTypes = {
        title: PropTypes.string,
        symble: PropTypes.string,
        unit: PropTypes.string,
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        balance: PropTypes.object.isRequired,
    };

    render() {
        let v = beautifyBalanceShow(this.props.balance);
        const {symble, title, unit} = this.props;
        const values = symble ? symble + v.result : v.result; 
        return (
            <TouchableOpacity style = {this.props.style} activeOpacity={0.8} onPress = {()=>{
                if (v.hasShrink) {
                    this.refs.alert.open();
                }
                }} >
                <Modal 
                    ref={'alert'} 
                    {...this.props}
                    isOpen={false}
                    style={{width:'80%', height:'25%', borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}
                    entry={'top'}
                    position={'center'}
                    coverScreen={true}
                    backButtonClose={true}
                    swipeToClose={false}
                    backdropOpacity={0.5}
                    animationDuration={300}
                    >
                    <View {...this.props} style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'flex-end',marginRight: 10, marginTop: 10,
                                alignItems: 'center'}} onPress={()=>{this.refs.alert.close()}}>
                            <Image style={{}} source={CloseIcon}></Image>
                        </TouchableOpacity>
                        <Text style={{fontSize: 18,  color: LVColor.text.grey2, marginBottom: 10, marginTop: -15}}>{title}</Text>
                        <TextInput  
                            underlineColorAndroid = {'transparent'}
                            multiline= {true}
                            editable={false} 
                            selectTextOnFocus={false}
                            style={ [styles.textInput, {padding: 20}] }>{ this.props.balance.toFixed() + " " + unit}
                        </TextInput>
                    </View>

                </Modal>
                <Text style={[styles.text, this.props.textStyle]}> { values } </Text>
            </TouchableOpacity>
        )
    }
}
const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};
const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "#f8f9fb", 
        width: Window.width * 0.7,
        height: '100%',
        flex: 1,
        marginTop: 10,
        marginBottom: 30,
        fontSize: 16,
        color: LVColor.text.grey2,
        borderRadius: 3,
    },
    text : {
        color: LVColor.text.grey2,
        fontSize: 16,
    }
});

export default LVBalanceShowView