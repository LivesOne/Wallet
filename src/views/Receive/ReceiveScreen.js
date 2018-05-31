/*
 * Project: Venus
 * File: src/views/Receive/ReceiveScreen.js
 * @flow
 */
"use strict";

import React, { Component } from 'react';

import { StyleSheet,Share, View, Platform,Text,Image,ScrollView ,Clipboard,CameraRoll ,ActionSheetIOS} from 'react-native';

import PropTypes from 'prop-types';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';

import MxImage from  './MxImage'
import MXButton from '../../components/MXButton';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVSelectWalletModal from '../Common/LVSelectWalletModal';


import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';
import { StringUtils } from '../../utils';

import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import Toast from 'react-native-root-toast';
import TransferUtils from '../Transfer/TransferUtils';


// import QRCode from 'react-native-qrcode';
const receive_share = require("../../assets/images/receive_share.png");
const lvt = require("../../assets/images/lvt.png");
const receive_change_wallet = require("../../assets/images/receive_change_wallet.png");
const receive_wallet_blank = require("../../assets/images/wallet_blank.png");
const goback_gray = require("../../assets/images/goback_gray.png");
const share_qrcode = require("../../assets/images/share_qrcode.png");

// var PasteBoard = require('react-native-pasteboard');

class ReceiveHeader extends Component {

    onPressButton = () => {
        if (this.props.callback) {
            this.props.callback();
        }
    };

    onLeftPress = ()=> {
        if (this.props.screenProps.dismiss) {
            this.props.screenProps.dismiss();
        } else {
            this.props.navigation.goBack();
        }
    }

    static propTypes = {
        callback: PropTypes.func
    };


    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <MXNavigatorHeader
                title={LVStrings.receive_title}
                titleStyle={{color: LVColor.text.grey2, fontSize: LVSize.large}}
                left = {goback_gray}
                onLeftPress = {this.onLeftPress}
                right={share_qrcode}
                onRightPress={this.onPressButton}
            />

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
        // const {wallet} = this.props.navigation.state.params;
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

    onWalletShare(wallet) {

       if (wallet && wallet.address) {
            const title: string = wallet.name + ' ' + LVStrings.wallet_backup_title_suffix;
            const message: string =  TransferUtils.convertToHexHeader(this.state.wallet.address);
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

    
    saveQrToDisk() {
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
              .then((success) => {
                  return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+"/some-name.png", 'photo')
                  .then((data) => {
                    //   Toast.show("data:"+data);
                      Toast.show(LVStrings.receive_save_finish)

                  }).catch((err) => {
                      Toast.show(err.message);
                    //   Toast.show(err.replace("Error:",""));
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

    onCopyWalletAddress(){
        Clipboard.setString(TransferUtils.convertToHexHeader(this.state.wallet.address));
        Toast.show(LVStrings.common_done)
    };

  
  
    render() {

        const { walletIsBlank } = this.state;
        //TransferUtils.log(TransferUtils.convertAddr2Iban(this.state.wallet.address));
        if(walletIsBlank) {

         return (
            <View style={styles.container}>
                <ReceiveHeader callback={() => {this.onWalletShare(this.state.wallet)}} screenProps={this.props.screenProps} />

                <View style={styles.mainContainer2}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ width:'100%', }}  contentContainerStyle={styles.contentContainer}>
                    <View style={styles.mainContainer}>

                        <Text style={styles.name} >
                                {this.state.wallet.name + LVStrings.receive_name_suffix}

                        </Text>
                        <Text ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
                            {StringUtils.converAddressToDisplayableText(this.state.wallet.address, 9, 11)}
                        </Text>

                        <QRCode
                        getRef={(c) => (this.svg = c)}
                        style={styles.qrcode_pic}
                        value={TransferUtils.convertAddr2Iban(this.state.wallet.address)}
                        size={162}
                        /* logo={lvt} */
                        bgColor='white'
                        fgColor='black'/>

                        <MXButton
                            rounded = {true}
                            style={styles.button}
                            title={LVStrings.receive_copy}
                            onPress = {() => {this.onCopyWalletAddress()}}
                            isEmptyButtonType = {true}
                            themeStyle={"active"}
                            /> 
                    </View>
                    <View style={styles.share_container}>
                        {/* <MxImage source={receive_share}
                            onPress = { () => {

                                this.onWalletShare();
                            }
                            }
                        ></MxImage> */}
                    </View>
                    </ScrollView>
                </View>

                {/* <LVSelectWalletModal
                    isOpen={this.state.openSelectWallet}
                    onClosed={this.onSelectWalletClosed}
                    selectedWalletId={this.state.walletId}
                    onSelected={this.onWalletSelected}
                /> */}

            </View>
        );
    }else {
        return (
            <View style={styles.container}>
                <ReceiveHeader callback={this.onPressSelectWallet} screenProps={this.props.screenProps} />
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
        backgroundColor:LVColor.primaryBack,
        
        
    },
    contentContainer: {
        // paddingVertical: 20,
        // backgroundColor: 'blue',
        // height:'100%',
        alignItems: 'center',
        justifyContent:'center',
    },

    button:{
        marginTop:30,
        marginBottom:75,
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
        
        backgroundColor: LVColor.white,
        // backgroundColor:'black',
        elevation: 20,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding:30,
        marginTop: 30,
     },

     mainContainer2:{
         flex:7,
         width:'100%',
         flexDirection:'column',
         alignItems: 'center', 
         justifyContent:'center',
         marginTop: 10,
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
        height:50,
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