/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';

import { StyleSheet,Share, View, Platform,Text,Image,ScrollView ,Clipboard,CameraRoll ,ActionSheetIOS} from 'react-native';

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import MxImage from  './MxImage'
import MXButton from '../../components/MXButton';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';


import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import { StringUtils } from '../../utils';

import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import Toast from 'react-native-simple-toast';


// import QRCode from 'react-native-qrcode';
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
        wallet: ?Object,       
        openSelectWallet: boolean,
        walletIsBlank:boolean,
        
    };

    

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet();
        this.state = {
            wallet: wallet,
            openSelectWallet: false,
            // walletIsBlank:false,
            walletIsBlank:true,
        };
        this.onPressSelectWallet = this.onPressSelectWallet.bind(this);
        this.onSelectWalletClosed = this.onSelectWalletClosed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        this.refreshWalletDatas();
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }

    refreshWalletDatas = async () => {
        const wallet = LVWalletManager.getSelectedWallet();
        if (wallet) {
            try {
                this.setState({wallet: wallet});

                LVNotificationCenter.postNotification(LVNotification.balanceChanged);
                LVWalletManager.saveToDisk();
            } catch (error) {
                console.log('error in refresh wallet datas : ' + error);
            }
        }
    }

    onWalletShare() {
        const wallet = this.state.wallet;

       if (wallet && wallet.address) {
            const title: string = wallet.name + ' ' + LVStrings.wallet_backup_title_suffix;
            const message: string = JSON.stringify(wallet.address);

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

    
    saveQrToDisk() {
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
              .then((success) => {
                  return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/some-name.png", 'photo')
                  .then((data) => {
                    //   Toast.show("data:"+data);
                      Toast.show(LVStrings.receive_save_finish)

                  }).catch((err) => {
                      Toast.show("err"+err);
                  });
                // Toast.show("ok");
              })
              .then(() => {
                  this.setState({ busy: false, imageSaved: true  })
                //   Toast.show(LVStrings.receive_save_finish)
              })
        })
   }

    handleWalletChange = async () => {
        await this.refreshWalletDatas();
    }

    onPressSelectWallet = () => {
        this.setState({ openSelectWallet: true });
    };

    onSelectWalletClosed = () => {
        this.setState({ openSelectWallet: false });
    };



  
  
    render() {

        const { walletIsBlank } = this.state;
        if(walletIsBlank) {

         return (
            
            <View style={styles.container}>
                <ReceiveHeader callback={this.onPressSelectWallet}/>

                <View style={styles.mainContainer2}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ width:'100%', }}  contentContainerStyle={styles.contentContainer}>
                <View style={styles.mainContainer}>

                <Text style={styles.name} >
                    {LVStrings.receive_name}

                </Text>
                <Text ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
                    {StringUtils.converAddressToDisplayableText(this.state.wallet.address, 9, 9)}
                </Text>

                <QRCode
                getRef={(c) => (this.svg = c)}
                style={styles.qrcode_pic}
                value={this.state.wallet.address}
                size={162}
                bgColor='white'
                fgColor='black'/>

                <MXButton
                    rounded = {true}
                    style={styles.button}
                    title={LVStrings.receive_copy}
                    onPress = {() => {
                        Clipboard.setString(this.state.wallet.address);
                        // alert(LVStrings.receive_save_finish);
                        Toast.show(LVStrings.common_done)

                    }}
                    themeStyle={"active"}
                /> 
                <MXButton
                    rounded = {true} 
                    title={LVStrings.receive_save}
                    style={styles.button_save}
                    onPress = {() => {
                    // alert("button clicked");
                    // this.props.navigation.navigate("ReceiveTip")
                    this.saveQrToDisk();
                    // this.test2();
                    }}
                    themeStyle={"active"}
                />
                </View>
                <View style={styles.share_container}>
                {/* <Image source={receive_share} style={styles.share}></Image> */}
                <MxImage source={receive_share}
                    onPress = { () => {
                        // Share.share({
                        //     url: this.state.wallet.address,
                        //     title: 'Share your wallet address ?',
                        //     message: this.state.wallet.address,
                        //   }, {
                        //     // Android only:
                        //     dialogTitle: 'Share your wallet address ',
                        //     // iOS only:
                        //     excludedActivityTypes: [
                        //       'com.apple.UIKit.activity.PostToTwitter'
                        //     ]
                        //   })                       

                        this.onWalletShare();
                    }
                    }
                   ></MxImage>
                </View>
                </ScrollView>
                </View>

                <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
                    selectedWalletId={this.state.walletId}
                    onSelected={this.onWalletSelected}
                />

            </View>
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
        // paddingVertical: 20,
        // backgroundColor: 'blue',
        // height:'100%',
        alignItems: 'center',
        justifyContent:'center',
    },

    topContainer:{
        flex:1,
        flexDirection:'row',
        alignItems: "center",
        paddingTop:10,
        paddingBottom:10,
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
        justifyContent:'center',
        
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
         flex:7,
         width:'100%',
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