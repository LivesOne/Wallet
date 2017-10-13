/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet,Share, View, Text,Image,ScrollView ,Clipboard} from 'react-native';

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import MxImage from  './MxImage'
import MXButton from '../../components/MXButton';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';

import QRCode from 'react-native-qrcode';
const receive_share = require("../../assets/images/receive_share.png");
const receive_change_wallet = require("../../assets/images/receive_change_wallet.png");
const receive_wallet_blank = require("../../assets/images/wallet_blank.png");

// var PasteBoard = require('react-native-pasteboard');

class ReceiveHeader extends Component {

    onPressButton = () => {
        if (this.props.callback) {
            this.props.callback();
        }
    };

    static propTypes = {
        callback: PropTypes.func
    };


    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <View style={styles.topContainer}>
            <Text style={styles.change_wallet_container}></Text>
            <Text style={styles.title}>
                {LVStrings.receive_title}
            </Text>
            <View style={styles.change_wallet_container}>
            <MxImage 
                source={receive_change_wallet}  
                style={styles.change_wallet}
                onPress={this.onPressButton.bind(this)}               
            ></MxImage>
            </View>
        </View>

        );
    }
}

class ReceiveScreen extends Component {
    static navigationOptions = {
        header: null
    };

    
    state:{
        // walletAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
        // text: 'http://facebook.github.io/react-native/',
        walletId: string,
        walletName: string,
        walletAddress: string,
        openSelectWallet: boolean,
        walletIsBlank:boolean,
        
    };

    constructor(props: any) {
        super(props);
        this.state = {
            walletId: '3',
            walletName: '傲游LivesToken',
            walletAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            openSelectWallet: false,
            // walletIsBlank:false,
            walletIsBlank:true,
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.onWalletSelected = this.onWalletSelected.bind(this);
    }

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };

    onWalletSelected = (walletObj: Object) => {
        this.setState({
            walletId: walletObj.id,
            walletName: walletObj.name,
            walletAddress: walletObj.address,
            openSelectWallet: false
        });
    };

    render() {

        const { walletIsBlank } = this.state;
        if(walletIsBlank) {

         return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor:LVColor.white }}  contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.container}>
                <ReceiveHeader callback={this.onPressSelectWallet}/>

                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    {LVStrings.receive_name}
                </Text>
                <Text ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
                    {this.state.walletAddress}
                   
                </Text>

                <QRCode
                style={styles.qrcode_pic}
                value={this.state.walletAddress}
                size={162}
                bgColor='white'
                fgColor='black'/>

                <MXButton
                    style={styles.button}
                    title={LVStrings.receive_copy}
                    onPress = {() => {
                        Clipboard.setString(this.state.walletAddress);
                        alert("copy your address to clipboard");
                    }}
                    themeStyle={"active"}
                /> 
                <MXButton
                    title={LVStrings.receive_save}
                    style={styles.button_save}
                    onPress = {() => {
                    alert("button clicked");
                    this.props.navigation.navigate("ReceiveTip")
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
                            title: 'Share your code?',
                            message:'http://m.sohu.com',
                          }, {
                            // Android only:
                            dialogTitle: 'Share your code for title',
                            // iOS only:
                            excludedActivityTypes: [
                              'com.apple.UIKit.activity.PostToTwitter'
                            ]
                          })                       
                    }
                    }
                   ></MxImage>
                </View>

                <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
                    selectedWalletId={this.state.walletId}
                    onSelected={this.onWalletSelected}
                />

            </View>
            </ScrollView>
        );
    }else {
        return (
            <View style={styles.container}>
                <ReceiveHeader callback={this.onPressSelectWallet}/>
                <View style={styles.mainContainer2}>
                <Image source={receive_wallet_blank}/>
                <Text >
                   {LVStrings.receive_empty }
                </Text>
                </View>
                <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
                    selectedWalletId={this.state.walletId}
                    onSelected={this.onWalletSelected}
                />
            </View>
        )
    }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: "center",
        // backgroundColor:'red',
        
        
    },
    contentContainer: {
        paddingVertical: 20,
        backgroundColor: LVColor.white,
        // height:'100%',
    },

    topContainer:{
        flex:1,
        flexDirection:'row',
        alignItems: "center",
        paddingTop:10,
        paddingBottom:20,
        justifyContent:'center',
    },

    title:{
        flex:6,
        fontSize:18,
        color:LVColor.grey2,
        alignItems: "center",
        textAlign:'center',
    },

    button:{
        marginTop:30,
        marginBottom:15,
    },
    button_save:{
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
        textAlign:'center',
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
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding:30,
     },

     mainContainer2:{
         flex:6,
         flexDirection:'column',
         alignItems: 'center', 
        //  backgroundColor:'red',
         justifyContent:'center',
     },

    change_wallet_container: {
        // backgroundColor:'red',
        flex:1,
        alignItems: 'center',
        
    },
    change_wallet: {
        height:30,
        width:30,
        // resizeMode:'stretch',
        // backgroundColor:'blue',
    },

    qrcode_pic:{
        height:162,
        width:162,
    },

    share_container: {
        flex:1,
        transform: [
        { translateY:-30,},
        // {'translate':[0,-30,1]
        ],
        elevation: 21,
        
    },
    share:{
        height:50,
        width:50,
        flex:1,
    }
    
});


export default ReceiveScreen;