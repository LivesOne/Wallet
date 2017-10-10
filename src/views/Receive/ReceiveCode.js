

"use strict";

import React,{Component} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

import LVColor from '../../styles/LVColor';
import LVString from '../../assets/localization';

import QRCode from 'react-native-qrcode';



class ReceiveCode extends Component {

    state = {
        purseName:'code',
        purseAddress:'0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.purseName}>
                    {this.state.purseName}
                </Text>

                <Text numberOfLines={1} style={styles.purseAddress}>
                    {this.state.purseAddress}
                </Text>

                <QRCode
                style={styles.purseQrCode}
                value={this.state.purseAddress}
                bgColor='white'
                fgColor='black'/>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'column',
        backgroundColor:'red',
    },
    purseName: {
        fontSize:18,
        color:LVColor.gray2,
        textAlign:'center',
        paddingBottom:5,

    },

    purseAddress: {
        fontSize:15,
        color:"#c3c8d3",
        textAlign:'center',
        paddingBottom:30,

    },
    purseQrCode: {
        height:162,
        width:162,
    }
});

export default ReceiveCode;
