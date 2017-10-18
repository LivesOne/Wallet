/*
 * Project: Venus
 * File: src/views/contacts/ContactsManagerPage.js
 * Author: Charles Liu
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, Image,TouchableHighlight, FlatList } from 'react-native';
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

const AddIcon = require('../../assets/images/add_contact.png');
const AvatarIcon = require('../../assets/images/contact_avatar.png');
const ShowDetailsIcon = require('../../assets/images/show_detail_arrow.png');
const EmptyContactListIndicatorIcon = require('../../assets/images/contant_list_empty.png');

export default class ContactsManagerPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    renderRow : Function;
    onDeleteContact: Function;

    constructor() {
        super();
        this.state = {
            contacts: [],
            toDeDeletedContactName: null
        };
        this.renderRow = this.renderRow.bind(this);
        this.onDeleteContact = this.onDeleteContact.bind(this);
    }

    state: {
        contacts: Array<Object>,
        toDeDeletedContactName: ?string
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
    }

    componentDidMount() {
        this.loadContacts();
    }

    renderRow({item, separators}) {
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
                autoClose={true}>
                <TouchableHighlight
                    onPressIn={separators.highlight}
                    onPressOut={separators.unhighlight}
                    underlayColor={LVColor.white}
                    onPress={()=>{
                        this.props.navigation.navigate('AddEditContactPage', {
                        callback:()=> this.loadContacts(),
                        mode: 'edit', model: item})
                    }}>
                    <View style={styles.cellContentContainer}>
                        <View style={styles.cellLeftContentContainer}>
                            <Image source={AvatarIcon}/>
                            <View style={styles.cellLeftDetailsContainer}>
                                <Text style={styles.nameTextStyle}>{item.name}</Text>
                                <Text style={styles.addressTextStyle}>{converAddressToDisplayableText(item.address,9,9)}</Text>
                            </View>
                        </View>
                        <Image source={ShowDetailsIcon}/>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }
    
    render() {
        const { contacts } = this.state;

        return (
            <View style={styles.rootContainer}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.contact_list_nav_title }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right={AddIcon}
                    onRightPress={ () => this.props.navigation.navigate('AddEditContactPage', {
                            callback:()=> this.loadContacts(),
                            mode: 'add'
                        }) }
                />
                <View style={styles.listContainer}>
                    <FlatList
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
        marginTop: 5,
        color: LVColor.text.editTextContent,
        fontSize: 15
    }
});