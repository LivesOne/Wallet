
/*
 * Project: Venus
 * File: src/views/contacts/AddEditContactPage.js
 * Author: Charles Liu
 * @flow
 */
import React, { Component } from 'react'
import { Alert, TextInput, View, StatusBar, StyleSheet,TouchableOpacity, ScrollView, Keyboard, Platform,PixelRatio } from 'react-native';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import MXCrossTextInput from '../../components/MXCrossTextInput';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import * as ContactLib from '../../logic/LVContactManager';
import { checkValidPhone, checkValidEmail, isEmptyString, isNotEmptyString } from '../../utils/MXUtils';
import { isAddress, getCharLength } from '../../utils/MXStringUtils';
import LVDialog from '../Common/LVDialog';
import LVQrScanModal from '../Common/LVQrScanModal';
import Permissions from 'react-native-permissions';
import LVLocalization from '../../assets/localization';
import MXTouchableImage from '../../components/MXTouchableImage';
import TransferUtils from '../Transfer/TransferUtils';
import MXButton from '../../components/MXButton';
import * as MXUtils from "../../utils/MXUtils";
import LVKeyboardSpacer from '../Common/LVKeyboardSpacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MXCrossInputHeight } from '../../styles/LVStyleSheet';

const scanImg = require('../../assets/images/transfer_scan.png');
const navButtonEnableColor = '#FFAE1F';
const navButtonDisableColor = '#c3c8d3';
const dismissKeyboard = require('dismissKeyboard');

type Props = {navigation: Object};

type State =  {
    name: string,
    address: string,
    cellPhone: string,
    email: string,
    alertMessage: string,
    navTitle: string,
    mode: string,
    editModel: ?Object,
    showQrScanModal: boolean
};

export default class AddEditContactPage extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onAddingDone : Function;
    onSubmitEditing: Function;
    constructor(props: any) {
        super();

        const { params } = props.navigation.state;
        const navTitle = params.mode === 'add' ?  LVStrings.contact_add_nav_title : LVStrings.contact_edit_nav_title;
        const model = params.model;
        if(!model) {
            this.state = {
                name: '',
                address: '',
                cellPhone: '',
                email: '',
                alertMessage: '',
                navTitle: navTitle,
                mode: params.mode,
                editModel: null,
                showQrScanModal: false
            };
        } else {
            this.state = {
                name: model.name,
                address: model.address,
                cellPhone: model.cellPhone,
                email: model.email,
                alertMessage: '',
                navTitle: navTitle,
                mode: params.mode,
                editModel: model,
                showQrScanModal: false
            };
        }
       
        this.onAddingDone = this.onAddingDone.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
    }

    async onAddingDone() {
        if (!this.refs.nickNameInput.validate()
            || this.refs.addressTextInput.validate()
            || this.refs.phone.validate()
            ||this.refs.emailInput.validate() ) {
            return;
        }

        if(this.state.mode === 'add') {
            if(ContactLib.instance.containsContact(this.state.name)) {
                this.setState({alertMessage: LVLocalization.contact_alert_contact_exists});
                this.refs.alert.show();
                return;
            }

            const contact = ContactLib.LVContactManager.createContact(this.state.name,
                TransferUtils.convertToHexHeader(this.state.address),
                this.state.cellPhone,
                this.state.email);
            ContactLib.instance.add(contact);
        } else if(this.state.editModel) {
            const originalName = this.state.editModel.name;

            if(originalName !== this.state.name
                && ContactLib.instance.containsContact(this.state.name)) {
                    this.setState({alertMessage: LVLocalization.contact_alert_contact_exists});
                    this.refs.alert.show();
                    return;
            }
            this.state.editModel.name = this.state.name;
            this.state.editModel.address = this.state.address;
            this.state.editModel.cellPhone = this.state.cellPhone;
            this.state.editModel.email = this.state.email;
        }
        
        await ContactLib.instance.saveToDisk();
        const {params} = this.props.navigation.state;
        this.props.navigation.goBack();
        params.callback();
    }

    componentWillMount() {
        StatusBar.setBarStyle('default', true);
    }

    onValidateNilkName = (value:?string)=>{
        if(isEmptyString(this.state.name)) {
            return LVLocalization.contact_alert_name_required;
        }
        if(getCharLength(this.state.name) > 40) {
            return LVLocalization.contact_alert_name_exceeds_limit;
        }
        return null;
    }

    onValidateAddressName = (value:?string)=>{
        if(isEmptyString(this.state.address)) {
            return LVLocalization.contact_alert_address_required;
        }
        if(!isAddress(this.state.address)) {
            return LVLocalization.contact_alert_address_invalid;
        }
        return null;
    }

    onValidateCellphone = (value:?string)=>{
        if (isNotEmptyString(this.state.cellPhone) && !checkValidPhone(this.state.cellPhone)) {
            return LVLocalization.contact_alert_Phone_invalid;
        }
        return null;
    }

    onValidateEmail = (value:?string)=>{
        if (isNotEmptyString(this.state.email) && !checkValidEmail(this.state.email)) {
            return LVLocalization.contact_alert_Email_invalid;
        }
        return null;
    }

    onSubmitEditing=(textInput:string)=>{
        if (textInput === 'addressTextInput') {
            this.refs.addressTextInput.focus();
        } else if (textInput === 'phone') {
            this.refs.phone.focus();
        }
    }

    async onPressScan() {
        if (Platform.OS === 'android') {
            await Keyboard.dismiss();
            setTimeout(() => {
                this.setState({ showQrScanModal: true });
            }, 100);
        }
        else if (Platform.OS === 'ios') {
            const response = await Permissions.request('camera');
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response === 'authorized') {
                this.setState({ showQrScanModal: true });
            } else {
                Alert.alert(
                    LVStrings.can_not_access_camera,
                    LVStrings.please_set_camera_author,
                    [
                        {
                            text: LVStrings.common_cancel,
                            onPress: () => console.log('Permission denied'),
                            style: 'cancel',
                        },
                        { text: LVStrings.common_open_ettings, onPress: Permissions.openSettings },
                    ],
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.rootView}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ this.state.navTitle }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={1.0} onPress={()=>{
                    dismissKeyboard();
                }}>
                    <View style={styles.container}>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            ref = {'nickNameInput'}
                            placeholder={LVStrings.contact_add_place_holder_nickname}
                            withClearButton
                            defaultValue={this.state.name}
                            returnKeyType= {'next'}
                            withUnderLine = {false}
                            onSubmitEditing={()=>{
                                this.onSubmitEditing('addressTextInput');
                            }}
                            blurOnSubmit={false}
                            onValidation={this.onValidateNilkName.bind(this)}
                            titleText={LVStrings.contact_add_place_nickname}
                            onTextChanged= {(text) => this.setState({name: text})}/>
                        <MXCrossTextInput ref={'addressTextInput'}
                            style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_address}
                            withClearButton={true}
                            defaultValue={this.state.address}
                            returnKeyType= {'next'}
                            withUnderLine = {false}
                            onSubmitEditing={()=>{
                                this.onSubmitEditing('phone');
                            }}
                            blurOnSubmit={false}
                            onValidation={this.onValidateAddressName.bind(this)}
                            titleText={LVStrings.contact_add_place_address}
                            rightComponent={<MXTouchableImage source={scanImg} onPress={ async () => {
                                if (Platform.OS === 'android') {
                                    await Keyboard.dismiss();
                                }
                                this.onPressScan();
                                }} />}
                            onTextChanged= {(text) => this.setState({address: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            ref = {'phone'}
                            placeholder={LVStrings.contact_add_place_holder_cellphone}
                            withClearButton
                            keyboardType = {'phone-pad'}
                            returnKeyType= {'next'}
                            defaultValue={this.state.cellPhone}
                            withUnderLine = {false}
                            onValidation={this.onValidateCellphone.bind(this)}
                            titleText={LVStrings.contact_add_place_cellphone}
                            onTextChanged= {(text) => this.setState({cellPhone: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            ref = {'emailInput'}
                            placeholder={LVStrings.contact_add_place_holder_email}
                            withClearButton
                            keyboardType = {'email-address'}
                            returnKeyType= {'done'}
                            defaultValue={this.state.email}
                            withUnderLine = {false}
                            onValidation={this.onValidateEmail.bind(this)}
                            titleText={LVStrings.contact_add_place_email}
                            onTextChanged= {(text) => this.setState({email: text})}/>
                        <MXButton
                                style={styles.button}
                                title={LVStrings.profile_wallet_save}
                                isEmptyButtonType={false}
                                rounded
                                onPress={this.onAddingDone}
                        />    
                    </View>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <LVQrScanModal 
                    barcodeReceived={(data)=>{
                        this.refs.addressTextInput.setText(data);
                    }} 
                    isOpen= {this.state.showQrScanModal}
                    onClosed = {()=>{this.setState({ showQrScanModal: false })}}/>
                <LVDialog ref={'alert'} title={LVStrings.alert_hint} message={this.state.alertMessage} buttonTitle={LVStrings.alert_ok}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nav: {
        backgroundColor : LVColor.profileNavBack
    },
    navTitle: {
        color: LVColor.profileNavTitleColor
    },
    rootView: {
        flex:1,
        backgroundColor: LVColor.white
    },
    container: {
        flex:1,
        marginLeft:15,
        marginRight:15,
    },
    textInputStyle: {
        height: MXCrossInputHeight
    },
    button: {
        height: 50,
        width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get(),
        marginTop:125,
        marginBottom:100,        
    },
});