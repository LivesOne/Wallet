
'use strict';

import React, { Component } from 'react';
import {
    AppState,
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
    ListView,
    RefreshControl,
    Image,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    NativeModules,
} from 'react-native';
import Toast from 'react-native-root-toast';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import MXButton from '../../components/MXButton';
import MXCrossTextInput from '../../components/MXCrossTextInput';
import LVWalletManager from '../../logic/LVWalletManager';
import LVWallet from '../../logic/LVWallet';
import LVLoadingToast from '../Common/LVLoadingToast';

const  AUTH_PASSWORD = 'password'; // 密码验证
const  AUTH_TOUCH_ID = 'touchid'; // touchid 验证
const  AUTH_FACE_ID = 'faceid'; // faceid 验证

const AUTH_ERROR_SWITCH = "1";// 超出错误次数，切换验证方式
const AUTH_ERROR_RETRY = "2";// 发生不匹配错误，点击重试

const walletIcon = require('../../assets/images/assets_wallet.png');


type Props = {
    needShowAuthChange : Function,
    selectWallet : ?Object,
}


export default class LVAuthView extends Component<Props> {

    authSupportList = [];
    currentAuthIndex = 0;

    getFirstAuth(){
        if(this.authSupportList.length > 0){
            if(this.authSupportList.length === 1){
                this.currentAuthIndex = 0;
            }
            return this.authSupportList[this.currentAuthIndex];
        }
    }

    getSecondAuth(){
        let secondAuthIndex = this.currentAuthIndex === 0 ? 1 : 0;
        if(this.authSupportList.length > 1){
            return this.authSupportList[secondAuthIndex];
        }
    }

    constructor(props: any) {
        super(props);
        this.state = {
            firstAuth : null,
            secondAuth : null,
            inputPassword : null,
            isAuthing : false,
        };
        this.onTextChanged = this.onTextChanged.bind(this);
        this.passwordAuth = this.passwordAuth.bind(this);
        this.startAuth = this.startAuth.bind(this);
        // this.initAuthSupport = this.initAuthSupport.bind(this);
    }

    componentWillMount(){
        this.initAuthSupport();
    }

    initAuthSupport = async () => {
        const authSupportString = await NativeModules.LVReactExport.getAuthSupport();
        const authSupport = JSON.parse(authSupportString);
        this.authSupportList = [];
        if(authSupport.faceid === true){
            this.authSupportList.push(AUTH_FACE_ID);
        }else if(authSupport.touchid === true){
            this.authSupportList.push(AUTH_TOUCH_ID);
        }

        // if(authSupport.password === true){
            this.authSupportList.push(AUTH_PASSWORD);
        // }
        this.currentAuthIndex = 0;
        this.setState({
            firstAuth : this.getFirstAuth(),
            secondAuth : this.getSecondAuth(),
        });
    }

    switchAuth(){
        if(this.authSupportList.length > 1){
            this.currentAuthIndex = this.currentAuthIndex === 0 ? 1 : 0;;
            this.setState({
                firstAuth : this.getFirstAuth(),
                secondAuth : this.getSecondAuth(),
                isAuthing : false,
            });
        }
    }

    async startAuth(){
        if(this.state.isAuthing){
            return ;
        }
        this.setState({
            isAuthing : true,
        });
        NativeModules.LVReactExport.startAuth(this.state.firstAuth)
        .then(result => {
            this.setState({
                isAuthing : false,
            });
            this.pass();
        })
        .catch(error => {
            console.log("authSupport --- error:" + error + "--code:" + error.code);
            this.setState({
                isAuthing : false,
            });
            if(error.code === AUTH_ERROR_SWITCH){
                this.switchAuth();
            }else if(error.code === AUTH_ERROR_RETRY){
            }
        });
    }

    async passwordAuth(){
        this.refs.toast.show();
        var verifyResult = await LVWalletManager.verifyPassword(this.state.inputPassword, this.props.selectWallet.keystore);
        console.log("authSupport , passwordAuth verifyResult :" + verifyResult)
        if(verifyResult === true){
            this.refs.toast.dismiss();
            this.pass();
        } else {
            Toast.show(LVStrings.wallet_password_incorrect);
            this.refs.toast.dismiss();
        }
    }

    onTextChanged(newText){
        this.setState({
            inputPassword : newText,
        });
    }

    pass(){
        this.props.needShowAuthChange && this.props.needShowAuthChange(false);
    }

    render(){
        const {firstAuth , secondAuth} = this.state;

        let bottomText = LVStrings.auth_use_password;
        let bottomVisible = false;
        if(secondAuth){
            bottomVisible = true;
            if(secondAuth === AUTH_FACE_ID){
                bottomText = LVStrings.auth_use_face_id;
            }else if(secondAuth === AUTH_TOUCH_ID){
                bottomText = LVStrings.auth_use_finger;
            }else if(secondAuth === AUTH_PASSWORD){
                bottomText = LVStrings.auth_use_password;
            }
        }

        let authVisible = true;
        let passwordVisible = true;

        if(firstAuth === AUTH_FACE_ID){
            authVisible = true;
            passwordVisible = false;
        }else if(firstAuth === AUTH_TOUCH_ID){
            authVisible = true;
            passwordVisible = false;
        }else if(firstAuth === AUTH_PASSWORD){
            authVisible = false;
            passwordVisible = true;
        }

        const wallet = this.props.selectWallet || LVWallet.emptyWallet();
        return (
            <View style={styles.container}>
                {authVisible && <TouchableOpacity style = {styles.authContainer}
                    onPress = {this.startAuth}>
                    <Image source = {require('../../assets/images/face_id.png')}/>
                    {!this.state.isAuthing && <Text style = {styles.wakeText}>{LVStrings.auth_wake_text}</Text>}
                </TouchableOpacity>}

                {passwordVisible && <View style = {[styles.passwordContainer]}>
                    <Image source={this.props.walletIcon || walletIcon} style={styles.img} resizeMode="contain" />
                    <Text style = {styles.nameText}>{wallet.name}</Text>
                    <TextInput style = {styles.passwordInput}
                        secureTextEntry={true}
                        onChangeText = {this.onTextChanged}
                        underlineColorAndroid={"transparent"}
                        placeholder = {LVStrings.wallet_create_password_required}
                    ></TextInput>
                    <MXButton 
                        title = {LVStrings.common_confirm}
                        style = {{
                            width : 240,
                            height : 50,
                            marginTop : 20,
                        }}
                        onPress= {() => {
                            this.passwordAuth();
                        }}
                        />
                </View>}

                {bottomVisible && <MXButton style = {styles.bottomText}
                    title = {bottomText}
                    isEmptyButtonType={true}
                    rounded
                    visible = {bottomVisible}
                    onPress={() => {
                        this.switchAuth();
                    }}
                    />}
                    
                <LVLoadingToast ref={'toast'} title={LVStrings.password_verifying} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        left : 0 , 
        top : 0,
        position:'absolute',
        backgroundColor : LVColor.white,
        width : '100%' , 
        height : '100%',
    },
    authContainer : {
        alignItems : 'center',
    },

    wakeText : {
        fontSize : 14,
        color : '#677384',
        marginTop : 30,
    },
    passwordContainer : {
        alignItems : 'center',
    },
    nameText : {
        fontSize : 18 ,
        color : '#27347D',
    },
    passwordInput : {
        width : 240,
        height : 50,
        backgroundColor : "#fff9f9fa",
        fontSize : 14,
    },
    bottomText : {
        alignSelf : 'center',
        marginTop : 100,
    },
    img: {
        width: 100,
        height: 100,
    }
});
