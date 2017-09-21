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

const receiveIcon = require("../../assets/images/tab_receive.png");

class ReceiveScreen extends Component {
    static navigationOptions = {
        header: null
    };


    
    render() {
        let pic = {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
          };

        //   return (
        //     <View style={styles.container}>
        //       <View style={styles.avatar} />
        //       <View style={styles.badge} />
        //     </View>
        //   );
        
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>
                        我的收款码
                    </Text>
                    <Image source={receiveIcon} style={styles.qrcode_icon}></Image>
                </View>
                {/* <View style={styles.mainContainerBackground}> */}

                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    钱包地址
                </Text>
                <Text style={styles.address}>
                    abcdefhigjklmopqrst
                </Text>

                <Image source={pic} style={styles.qrcode_pic}></Image>

                <MXButton
                    title={"复制地址"}
                    onPress = {() => {
                    alert("button clicked");
                    }}
                    themeStyle={"active"}
                /> 
                <MXButton
                    title={"保存二维码"}
                    onPress = {() => {
                    alert("button clicked");
                    }}
                    themeStyle={"active"}
                />
                </View>
                <Image source={receiveIcon} style={styles.share}></Image>

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

    // avatar: {
    //     backgroundColor: 'black',
    //     width: 60,
    //     height: 60,
    //   },
    //   badge: {
    //     backgroundColor: 'red',
    //     width: 20,
    //     height: 20,
    //     translateY: -60,
    //   },

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
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: LVColor.navigationBar,
        padding:40,
    },

    qrcode_icon: {
        height:20,
        width:5,
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
        { translateY:-30,}
        ],
    }
    
});

const notificationStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginTop:  20,
        opacity: 0,
        width: "100%",
        height: 0,
        backgroundColor: "blue"
    },
    netLost: {
        opacity: 1,
        height: 50
    },
    text: {
        marginLeft: 15,
        marginRight: 15,
        fontSize: 14,
        textAlign: "center",
        color: "black"
    }
});

export default ReceiveScreen;