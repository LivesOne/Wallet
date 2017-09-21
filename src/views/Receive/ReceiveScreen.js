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

        
        
        // return (
        //     <View style={styles.container}>
        //       <View style={styles.rec} />
        //     </View>
        //   );

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.qrcode_icon}></Text>
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

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: 'red',
//     },
//     rec: {
//       height: 120,
//       width: 120,
//       backgroundColor: 'green',
//       elevation: 20,
//       shadowOffset: {width: 5, height: 5},
//       shadowColor: 'blue',
//       shadowOpacity: 20,
//       shadowRadius: 10,
//     }
//   });
  
  


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
        padding:50,
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
        elevation: 21,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 5,
    }
    
});


export default ReceiveScreen;