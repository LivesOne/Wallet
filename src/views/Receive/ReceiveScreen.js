/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';


import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';


import MXButton from '../../components/MXButton';

const receive_share = require("../../assets/images/receive_share.png");
const receive_change_purse = require("../../assets/images/receive_change_purse.png");

class ReceiveScreen extends Component {
    static navigationOptions = {
        header: null
    };


    
    render() {
        let pic = {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
          };

        
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.qrcode_icon}></Text>
                    <Text style={styles.title}>
                        {LVStrings.receive_title}
                    </Text>
                    <Image source={receive_change_purse} style={styles.qrcode_icon}></Image>
                </View>
                {/* <View style={styles.mainContainerBackground}> */}

                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    {LVStrings.receive_name}
                </Text>
                <Text style={styles.address}>
                    abcdefhigjklmopqrst
                </Text>

                <Image source={pic} style={styles.qrcode_pic}></Image>

                <MXButton
                    title={LVStrings.receive_copy}
                    onPress = {() => {
                    alert("button clicked");
                    }}
                    themeStyle={"active"}
                /> 
                <MXButton
                    title={LVStrings.receive_save}
                    onPress = {() => {
                    alert("button clicked");
                    }}
                    themeStyle={"active"}
                />
                </View>
                <Image source={receive_share} style={styles.share}></Image>

                {/* </View> */}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: LVColor.white,
    },


    topContainer:{
        flex:1,
        flexDirection:'row',
        alignItems: "center",
        
    },

    title:{
        flex:6,
        fontSize:18,
        color:LVColor.grey2,
        alignItems: "center",
        textAlign:'center',
    },

    name:{
        fontSize:18,
        color:LVColor.grey2,
        textAlign:'center',
    },

    address:{
        fontSize:15,
        color:"#c3c8d3",
    },

    mainContainerBackground:{
        padding:30,
        backgroundColor: LVColor.navigationBar,
        
    },

    mainContainer:{
        flex:6,
        width:'90%',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: LVColor.navigationBar,
        // backgroundColor:'black',
        elevation: 20,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 5,
        padding:30,
        zIndex:4,
     },

    qrcode_icon: {
        height:40,
        width:40,
        flex:1,
    },

    qrcode_pic:{
        height:162,
        width:162,
    },

    share:{
        height:50,
        width:50,
        flex:1,
        transform: [
        { translateY:-30,},
        // {'translate':[0,-30,1]
        ],
        elevation: 21,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 5,
        zIndex:3,
        
    }
    
});


export default ReceiveScreen;