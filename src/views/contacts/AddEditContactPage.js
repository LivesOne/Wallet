
/*
 * Project: Venus
 * File: src/views/contacts/AddEditContactPage.js
 * Author: Charles Liu
 * @flow
 */
import React, { Component } from 'react'
import { TextInput, View, StyleSheet,ScrollView } from 'react-native';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import MXCrossTextInput from '../../components/MXCrossTextInput';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import * as ContactLib from '../../logic/LVContactManager';
import { isEmptyString } from '../../utils/MXUtils';
import { isAddress } from '../../utils/MXStringUtils';
import LVDialog from '../Common/LVDialog';
import LVLocalization from '../../assets/localization';
import MXTouchableImage from '../../components/MXTouchableImage';

const scanImg = require('../../assets/images/transfer_scan.png');

export default class AddEditContactPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
        name: string,
        address: string,
        cellPhone: string,
        email: string,
        remarks: string,
        alertMessage: string,
        navTitle: string,
        mode: string,
        editModel: ?Object
    }

    onAddingDone : Function;

    constructor() {
        super();

        this.state = {
            name: '',
            address: '',
            cellPhone: '',
            email: '',
            remarks: '',
            alertMessage: '',
            navTitle: '',
            mode: 'add',
            editModel: null
        };

        this.onAddingDone = this.onAddingDone.bind(this);
    }

    async onAddingDone() {
        if(isEmptyString(this.state.name)) {
            this.setState({alertMessage: LVLocalization.contact_alert_name_required});
            this.refs.alert.show();
            return;
        }
        if(ContactLib.instance.containsContact(this.state.name)) {
            this.setState({alertMessage: LVLocalization.contact_alert_contact_exists});
            this.refs.alert.show();
            return;
        }
        if(isEmptyString(this.state.address)) {
            this.setState({alertMessage: LVLocalization.contact_alert_address_required});
            this.refs.alert.show();
            return;
        }
        if(!isAddress(this.state.address)) {
            this.setState({alertMessage: LVLocalization.contact_alert_address_invalid});
            this.refs.alert.show();
            return;
        }

        if(this.state.mode === 'add') {
            const contact = ContactLib.LVContactManager.createContact(this.state.name,
                this.state.address,
                this.state.cellPhone,
                this.state.email,
                this.state.remarks);
            ContactLib.instance.add(contact);
        } else if(this.state.editModel) {
            this.state.editModel.name = this.state.name;
            this.state.editModel.address = this.state.address;
            this.state.editModel.cellPhone = this.state.cellPhone;
            this.state.editModel.email = this.state.email;
            this.state.editModel.remarks = this.state.remarks;
        }
        
        await ContactLib.instance.saveToDisk();
        const {params} = this.props.navigation.state;
        this.props.navigation.goBack();
        params.callback();
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const navTitle = params.mode === 'add' ?  LVStrings.contact_add_nav_title : LVStrings.contact_edit_nav_title;
        const model = params.model;
        if(!model) {
            this.setState({
                navTitle: navTitle,
                mode: params.mode
            });
        } else {
            this.setState({
                navTitle: navTitle,
                name: model.name,
                address: model.address,
                cellPhone: model.cellPhone,
                email: model.email,
                remarks: model.remarks,
                mode: params.mode,
                editModel: model
            });
        }
    }

    onPressScan() {
        alert('onPressScan');
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
                    right={LVStrings.common_done}
                    rightTextColor={'#c3c8d3'}
                    onRightPress={this.onAddingDone}
                />
                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_nickname}
                            withClearButton
                            defaultValue={this.state.name}
                            onTextChanged= {(text) => this.setState({name: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_address}
                            withClearButton={true}
                            defaultValue={this.state.address}
                            rightComponent={<MXTouchableImage source={scanImg} onPress={this.onPressScan.bind(this)} />}
                            onTextChanged= {(text) => this.setState({address: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_cellphone}
                            withClearButton
                            defaultValue={this.state.cellPhone}
                            onTextChanged= {(text) => this.setState({cellPhone: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_email}
                            withClearButton
                            defaultValue={this.state.email}
                            onTextChanged= {(text) => this.setState({email: text})}/>
                        <MXCrossTextInput style={styles.textInputStyle}
                             placeholder={LVStrings.contact_add_place_holder_remarks}
                             withClearButton
                             defaultValue={this.state.remarks}
                             onTextChanged= {(text) => this.setState({remarks: text})}/>
                    </View>
                </ScrollView>
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
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 12.5,
        paddingRight: 12.5
    },
    textInputStyle: {
        height: 60
    }
});