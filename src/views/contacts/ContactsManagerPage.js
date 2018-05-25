/*
 * Project: Venus
 * File: src/views/contacts/ContactsManagerPage.js
 * Author: Charles Liu
 * @flow
 */
"use strict";

import React, { Component } from 'react'
import { Dimensions, Text, View, StyleSheet, Image,TouchableHighlight, FlatList } from 'react-native';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import AddEditContactPage from './AddEditContactPage';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
import * as ContactLib from '../../logic/LVContactManager';
import Swipeout from 'react-native-swipeout';
import { Separator } from 'react-native-tableview-simple';
import { converAddressToDisplayableText} from '../../utils/MXStringUtils';
import { LVConfirmDialog } from '../Common/LVDialog';
import LVLocalization from '../../assets/localization';
import TransferUtils from '../Transfer/TransferUtils';

const AddIcon = require('../../assets/images/add_contact.png');
const AvatarIcon = require('../../assets/images/contact_avatar.png');
const ShowDetailsIcon = require('../../assets/images/show_detail_arrow.png');
const EmptyContactListIndicatorIcon = require('../../assets/images/contant_list_empty.png');

type Props = {navigation: Object };

type State =  {
        contacts: Array<Object>,
        toDeDeletedContactName: ?string,
        scrollEnabled: boolean,
        readonly: boolean,
        callback: Function
};

export default class ContactsManagerPage extends  Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    renderRow : Function;
    onDeleteContact: Function;
    
    constructor(props: any) {
        super();

        const { params } = props.navigation.state;
        this.state = {
            contacts: [],
            toDeDeletedContactName: null,
            scrollEnabled: true,
            readonly: params.readonly,
            callback: params.callback
        };
        this.renderRow = this.renderRow.bind(this);
        this.onDeleteContact = this.onDeleteContact.bind(this);
    }


    async loadContacts (){
        await ContactLib.instance.loadLocalContacts();
        this.setState({
            contacts: ContactLib.instance.getContacts()
        });
    }

    onDeleteContact() {
        if(!this.state.toDeDeletedContactName) {
            return;
        }

        const contact = ContactLib.instance.getContactWithName(this.state.toDeDeletedContactName);
        if(!contact) {
            return;
        }

        ContactLib.instance.remove(contact);
        ContactLib.instance.saveToDisk();
        this.loadContacts();
        this.state.toDeDeletedContactName = null;
    }

    componentDidMount() {
        this.loadContacts();
    }

    renderRow({item, separators}: any) {
        const swipeBts = [
            {
                text: LVStrings.common_delete,
                backgroundColor: '#f25656',
                color: LVColor.white,
                buttonWidth: 65,
                onPress: () => { 
                    this.setState({
                        toDeDeletedContactName: item.name
                    });
                    this.refs.deleteConfirm.show();
                 }
            }
        ];
        return (
            <Swipeout right={swipeBts} 
                autoClose={true}
                scroll={ (scrollEnabled)=> {this.setState({scrollEnabled: scrollEnabled});}}
                close={!(this.state.toDeDeletedContactName == item.name)}
                onOpen={(sectionID, rowID) => {
                    this.setState({
                        toDeDeletedContactName: item.name
                    });
                }}>
                <TouchableHighlight
                    onPressIn={separators.highlight}
                    onPressOut={separators.unhighlight}
                    underlayColor={LVColor.white}
                    onPress={()=>{
                        if(this.state.callback) {
                            this.state.callback(item.address);
                            this.props.navigation.goBack();
                        } else {
                            this.setState({toDeDeletedContactName: null});
                            this.props.navigation.navigate('AddEditContactPage', {
                                callback:()=> this.loadContacts(),
                                mode: 'edit', model: item})
                        }
                    }}>
                    <View style={styles.cellContentContainer}>
                        <View style={styles.cellLeftContentContainer}>
                            <Image source={AvatarIcon}/>
                            <View style={styles.cellLeftDetailsContainer}>
                                <Text style={styles.nameTextStyle} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.addressTextStyle}>{converAddressToDisplayableText(TransferUtils.removeHexHeader(item.address),9,9)}</Text>
                            </View>
                        </View>
                        {!this.state.readonly && <Image source={ShowDetailsIcon}/>}
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }
    
    render() {
        const { contacts } = this.state;
        const { params } = this.props.navigation.state;

        let addIcon = AddIcon;

        return (
            <View style={styles.rootContainer}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.contact_list_nav_title }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right={LVStrings.contact_add_nav_right}
                    rightTextColor= {LVColor.text.grey2}
                    onRightPress={ () =>{
                        if(!addIcon) {
                            return;
                        }
                        this.setState({toDeDeletedContactName: null});
                        this.props.navigation.navigate('AddEditContactPage', {
                            callback:()=> this.loadContacts(),
                            mode: 'add'
                        })
                    }}
                />
                <View style={styles.listContainer}>
                    <FlatList
                        scrollEnabled={this.state.scrollEnabled}
                        extraData={this.state}
                        data={contacts}
                        keyExtractor={(item,index)=> item.name}
                        renderItem={this.renderRow}
                        ItemSeparatorComponent={()=><Separator insetLeft={0} insetRight={12.5} tintColor={LVColor.separateLine} />}
                        ListEmptyComponent={()=> 
                            <View style={styles.emptyListContainer}>
                                <Image source={EmptyContactListIndicatorIcon}/>
                                <Text style={styles.emptyListTextStyle}>{LVLocalization.contact_empty_list_demonstration}</Text>
                            </View>
                        }/>
                </View>
                <LVConfirmDialog ref={'deleteConfirm'} 
                            title={LVStrings.alert_hint}  
                            message={LVStrings.contact_confirm_delete_contact} 
                            onConfirm={this.onDeleteContact} />
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
    rootContainer: {
        flex: 1,
        backgroundColor: LVColor.white,
    },
    listContainer: {
        flex: 1,
        paddingLeft: 12.5
    },
    cellContentContainer: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white,
        paddingRight: 12.5
    },
    cellLeftContentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cellLeftDetailsContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    nameTextStyle: {
        width: Dimensions.get('window').width - 90,
        fontSize: 15,
        color: LVColor.text.grey1
    },
    addressTextStyle: {
        fontSize: 12,
        color: LVColor.text.grey3
    },
    emptyListContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 125
    },
    emptyListTextStyle: {
        marginTop: 10,
        color: LVColor.text.editTextContent,
        fontSize: 15
    }
});