/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';
import { StyleSheet,Share, View, Text,Image,ScrollView,ActionSheetIOS,Platform } from 'react-native';


import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import MxImage from  './MxImage'
import MXButton from '../../components/MXButton';
import { StringUtils } from '../../utils';



// import QRCode from 'react-native-qrcode';
import QRCode from 'react-native-qrcode-svg';


import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVWalletManager from '../../logic/LVWalletManager';

const IconBack = require('../../assets/images/back_grey.png');
const receive_share = require("../../assets/images/receive_share.png");
const lvt = require("../../assets/images/lvt.png");
class ReceiveTip extends Component {
    static navigationOptions = {
        header: null
    };



    
    state:{
        wallet: ?Object,       
    };

    

    constructor(props) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
        };
    }

    onWalletShare() {
        const wallet = this.state.wallet;

       if (wallet && wallet.address) {
            const title: string = wallet.name + ' ' + LVStrings.wallet_backup_title_suffix;
            const message: string =  this.state.wallet.address;
            // const message: string =  StringUtils.converAddressToDisplayableText(this.state.wallet.address, 9, 9);

            const options = {
                title: title,
                message: message,
                subject: title
            };

            if (Platform.OS === 'ios') {
                ActionSheetIOS.showShareActionSheetWithOptions(
                    options,
                    error => console.log(error),
                    (success, activityType) => {
                        if (success) {
                        } else {
                            console.log('User did not share');
                        }
                    }
                );
            } else {
                Share.share(options)
                    // .then(this._shareResult.bind(this))
                    .catch(error => console.log('share error'));
            }
        } 
    }
 
    render() {
        return (
           
            <View style={styles.container}>
             <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB',paddingTop:0}}
                    title={ ' ' }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    />
            
                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    {LVStrings.receive_name}
                </Text>
                <Text ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
                         {StringUtils.converAddressToDisplayableText(this.state.wallet.address, 9, 9)}            
                </Text>

                <QRCode
                style={styles.qrcode_pic}
                value={this.state.wallet.address}
                size={162}
                logo={lvt}
                bgColor='white'
                fgColor='black'/>

                <Text 
                   style = {styles.eth_tip}
                >
                    {LVStrings.transfer_insufficient} 
                </Text>
                
                </View>
                <View style={styles.share_container}>
                {/* <Image source={receive_share} style={styles.share}></Image> */}
                <MxImage source={receive_share}
                onPress = { () => {
                        this.onWalletShare();                   
                }
                }
               ></MxImage>
                </View>

            </View>
         );
    }
}


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 20,
        backgroundColor:'#F8F9FB',
        
        
    },
    contentContainer: {
        backgroundColor: LVColor.navigationBar,

        height:'100%',
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
        // backgroundColor: LVColor.navigationBar,
        
    },

    mainContainer:{
        flex:2,
        width:'90%',
        flexDirection:'column',
        alignItems: 'center',
        backgroundColor: LVColor.white,
        // backgroundColor:'black',
        elevation: 20,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding:30,
     },

    change_purse_container: {
        // backgroundColor:'red',
        flex:1,
        alignItems: 'center',
        
    },
    change_purse: {
        height:30,
        width:30,
        // resizeMode:'stretch',
        // backgroundColor:'blue',
    },

    eth_tip: {
        paddingTop:20,
        width:'90%',
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


export default ReceiveTip;