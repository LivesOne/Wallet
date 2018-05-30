/*
 * Project: Venus
 * File: src/views/contacts/ContactsManagerPage.js
 * Author: Charles Liu
 * @flow
 */
"use strict";

import React, { Component } from 'react'
import { Dimensions, Text, View, StyleSheet, Image,TouchableHighlight, FlatList ,PixelRatio,ScrollView,TouchableWithoutFeedback} from 'react-native';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVStrings from '../../assets/localization';
import LVColor from '../../styles/LVColor';
import AddEditContactPage from './AddEditContactPage';
import LVTContactDetailPage from './LVTContactDetailPage';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
import * as ContactLib from '../../logic/LVContactManager';
import Swipeout from 'react-native-swipeout';
import { Separator } from 'react-native-tableview-simple';
import { LVConfirmDialog } from '../Common/LVDialog';
import LVLocalization from '../../assets/localization';
import MXSearchBar from '../../components/MXSearchBar/index';
import * as MXUtils from "../../utils/MXUtils";

const AddIcon = require('../../assets/images/add_contact.png');
const AvatarIcon = require('../../assets/images/contact_avatar.png');
const ShowDetailsIcon = require('../../assets/images/show_detail_arrow.png');
const EmptyContactListIndicatorIcon = require('../../assets/images/contant_list_empty.png');
const ItemEditIcon = require('../../assets/images/contant_list_itemEdit.png');
const ItemDeleteIcon = require('../../assets/images/contant_list_itemDelete.png');

type Props = {navigation: Object };

type State =  {
        contacts: Array<Object>,
        toDeDeletedContactName: ?string,
        scrollEnabled: boolean,
        readonly: boolean,
        callback: Function,
        searchContacts:Array<Object>,
        isSearchingStatus:boolean,
        currentSearchText:string
};

export default class ContactsManagerPage extends  Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    renderRow : Function;
    onDeleteContact: Function;
    onChangedText:Function;
    constructor(props: any) {
        super();

        const { params } = props.navigation.state;
        this.state = {
            contacts: [],
            toDeDeletedContactName: null,
            scrollEnabled: true,
            readonly: params.readonly,
            callback: params.callback,
            searchContacts:[],
            isSearchingStatus:false,
            currentSearchText:'',
        };
        this.renderRow = this.renderRow.bind(this);
        this.onDeleteContact = this.onDeleteContact.bind(this);
        this.onChangedText = this.onChangedText.bind(this);
    }

    onChangedText = (text:string)=>{
        this.setState({
            currentSearchText:text,
        });
        const { contacts } = this.state;
        var len = contacts.length;
        var arr = [];
        for(var i=0;i<len;i++){
            //如果字符串中不包含目标字符会返回-1
            if(contacts[i].name.toLowerCase()
            .indexOf(text.toLowerCase()
        )>=0){
                arr.push(contacts[i]);
            }
        }
        if ((text !== null ||
            text !== '' || 
            text !== undefined)) {
                this.setState({
                    isSearchingStatus: true,
                    searchContacts:arr,
                    currentSearchText:text,
                });
        }
    };

    lostBlur = ()=>{
        //失去焦点实现
        if ((this.state.currentSearchText === null ||
            this.state.currentSearchText === '' || 
            this.state.currentSearchText === undefined) &&
            this.state.isSearchingStatus
        ) {
            this.refs.searchtextinput.blur();
            this.setState({
                isSearchingStatus: false,
            });
        }
    };

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
                component:<View style = {{flex:1,alignItems:"center",justifyContent:"center",marginRight:15}}>
                <Image source={ItemEditIcon}/>
                </View>,
                backgroundColor: LVColor.white,
                onPress: () => { 
                    this.setState({toDeDeletedContactName: null});
                    this.props.navigation.navigate('AddEditContactPage', {
                                callback:()=> this.loadContacts(),
                                mode: 'edit', model: item})
                }
            },
            {
                component:<View style = {{flex:1,alignItems:"center",justifyContent:"center",marginRight:15}}>
                    <Image source={ItemDeleteIcon}/>
                </View>,
                backgroundColor: LVColor.white,
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
                buttonWidth={50}
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
                        this.setState({toDeDeletedContactName: null});
                        this.props.navigation.navigate('LVTContactDetailPage', {
                             model: item});
                }}>
                    <View style={styles.cellContentContainer}>
                        <View style={styles.cellLeftContentContainer}>
                            <Image source={AvatarIcon}/>
                            <View style={styles.cellLeftDetailsContainer}>
                                <Text style={styles.nameTextStyle} numberOfLines={1}>{item.name}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }
    
    render() {
        const { contacts,isSearchingStatus,searchContacts } = this.state;
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
                <TouchableWithoutFeedback  
                onPress={this.lostBlur.bind(this)}>  
                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                <MXSearchBar
                    ref = {'searchbar'}
                    style = {{marginTop: 10}}
                    placeholder = {LVStrings.contact_add_place_holder_nickname}
                    onTextChanged = {this.onChangedText}
                    onFocus = {()=>{
                        if (this.state.currentSearchText !== null &&
                            this.state.currentSearchText !== '' && 
                            this.state.currentSearchText !== undefined &&
                            this.state.isSearchingStatus) {
                                this.setState({
                                    isSearchingStatus: true,
                                });
                        }
                    }}
                    onEndEditing = {() => {
                        if ((this.state.currentSearchText === null ||
                            this.state.currentSearchText === '' || 
                            this.state.currentSearchText === undefined) &&
                            this.state.isSearchingStatus
                        ) {
                            this.setState({
                                isSearchingStatus: false,
                            });
                        }
                    }}
                    />
                <View style={styles.listContainer}>
                    <FlatList
                        scrollEnabled={this.state.scrollEnabled}
                        extraData={this.state}
                        data={isSearchingStatus?searchContacts:contacts}
                        keyExtractor={(item,index)=> item.name}
                        renderItem={this.renderRow}
                        ListEmptyComponent={()=> 
                            <View style={styles.emptyListContainer}>
                                <Image source={EmptyContactListIndicatorIcon}/>
                                <Text style={styles.emptyListTextStyle}>{isSearchingStatus? LVLocalization.contact_Search_Empty_Button: LVLocalization.contact_empty_list_demonstration}</Text>
                            </View>
                        }/>
                </View>
                </ScrollView>
                </TouchableWithoutFeedback>
                <LVConfirmDialog ref={'deleteConfirm'} 
                            title={''}  
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
        paddingLeft: 15
    },
    cellContentContainer: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white,
        paddingRight: 15
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
        fontSize: 14,
        color: LVColor.text.grey2,
        fontWeight: '500'
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
        color: LVColor.text.editTextNomal,
        fontSize: 15
    }
});