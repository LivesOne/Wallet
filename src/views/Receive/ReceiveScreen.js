/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet,Share, View, Text,Image,ScrollView } from 'react-native';


import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import MxImage from  './MxImage'
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
            <ScrollView contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.change_purse_container}></Text>
                    <Text style={styles.title}>
                        {LVStrings.receive_title}
                    </Text>
                    <View style={styles.change_purse_container}>
                    <Image source={receive_change_purse} style={styles.change_purse}></Image>
                    </View>
                </View>

                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    {LVStrings.receive_name}
                </Text>
                <Text style={styles.address}>
                    abcdefhigjklmopqrst
                </Text>

                <Image source={pic} style={styles.qrcode_pic}></Image>

                <MXButton
                    style={styles.button}
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
                <View style={styles.share_container}>
                {/* <Image source={receive_share} style={styles.share}></Image> */}
                <MxImage source={receive_share}
                    onPress = { () => {
                        Share.share({
                            url: 'http://bam.tech',
                            title: 'Share your code?'
                          }, {
                            // Android only:
                            dialogTitle: 'Share your code',
                            // iOS only:
                            excludedActivityTypes: [
                              'com.apple.UIKit.activity.PostToTwitter'
                            ]
                          })                       
                    }
                    }
                   ></MxImage>
                </View>

            </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: "center",
    },
    contentContainer: {
        paddingVertical: 20,
        backgroundColor: LVColor.white,

    },

    topContainer:{
        flex:1,
        flexDirection:'row',
        alignItems: "center",
        paddingBottom:20,
    },

    title:{
        flex:6,
        fontSize:18,
        color:LVColor.grey2,
        alignItems: "center",
        textAlign:'center',
    },

    button:{
        marginBottom:15,
    },

    name:{
        fontSize:18,
        color:LVColor.grey2,
        textAlign:'center',
        paddingBottom:5,
        
    },

    address:{
        fontSize:15,
        color:"#c3c8d3",
        paddingBottom:30,
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

    change_purse_container: {
        // backgroundColor:'red',
        flex:1,
        alignItems: 'center',
        
    },
    change_purse: {
        height:30,
        width:30,
        resizeMode:'stretch',
        // backgroundColor:'blue',
    },

    qrcode_pic:{
        height:162,
        width:162,
        marginBottom:30,
    },

    share_container: {
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
    },
    share:{
        height:50,
        width:50,
        flex:1,
    }
    
});


export default ReceiveScreen;