/*
 * Project: Venus
 * File: src/views/contacts/ContactsManagerPage.js
 * Author: Charles Liu
 * @flow
 */
"use strict";

import React, { Component } from 'react'
import { Dimensions, Text, View, StyleSheet, Image,TouchableHighlight, FlatList ,PixelRatio,ScrollView,TouchableOpacity} from 'react-native';
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
import LVKeyboardSpacer from '../Common/LVKeyboardSpacer';

const AvatarIcon = require('../../assets/images/contact_avatar.png');
const ShowDetailsIcon = require('../../assets/images/show_detail_arrow.png');
const EmptyContactListIndicatorIcon = require('../../assets/images/contant_list_empty.png');
const ItemEditIcon = require('../../assets/images/contant_list_itemEdit.png');
const ItemDeleteIcon = require('../../assets/images/contant_list_itemDelete.png');
const ItemSelected = require('../../assets/images/contact_selected.png');
const ItemUnselected = require('../../assets/images/contact_unSelected.png');
const dismissKeyboard = require('dismissKeyboard');

type Props = {navigation: Object };

type State =  {
        contacts: Array<Object>,
        toDeDeletedContactName: ?string,
        scrollEnabled: boolean,
        readonly: boolean,
        callback: Function,
        searchContacts:Array<Object>,
        isSearchingStatus:boolean,
        currentSearchText:string,
        isItemSelected:Array<boolean>,
        currentSelectItem:any
};

export default class ContactsManagerPage extends  Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    renderRow : Function;
    onDeleteContact: Function;
    onChangedText:Function;
    onSelectedItem:Function;

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
            isItemSelected:[false],
            currentSelectItem:null
        };
        this.renderRow = this.renderRow.bind(this);
        this.onDeleteContact = this.onDeleteContact.bind(this);
        this.onChangedText = this.onChangedText.bind(this);
        this.onSelectedItem = this.onSelectedItem.bind(this);
    }

    onSelectedItem = (item:any,index:number) => {
        if (this.state.isItemSelected[index]) {
            this.state.isItemSelected[index] = false,
            this.setState({
                currentSelectItem:null,
            })
        } else {
            this.state.isItemSelected[index]  = true;

            for (let i = 0; i < this.state.isItemSelected.length; i++) {
                const element = this.state.isItemSelected;
                if (i !== index) {
                    element[i] = false
                }
            }
            this.setState({
                currentSelectItem:item
            });
        }
    };

    onChangedText = async (text:string)=>{
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
        if ((text !== null &&
            text !== '' && 
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
        dismissKeyboard();
        if ((this.state.currentSearchText === null ||
            this.state.currentSearchText === '' || 
            this.state.currentSearchText === undefined) &&
            this.state.isSearchingStatus
        ) {
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
        if (this.state.isSearchingStatus) {
            const index = this.state.searchContacts.findIndex((contact)=> {
                return contact.name === this.state.toDeDeletedContactName;
            });
            if (index !== -1) {
                this.state.searchContacts.splice(index);
            }
        }
        this.state.toDeDeletedContactName = null;
    }

    componentDidMount() {
        this.loadContacts();
    }

    renderRow({item,index,separators}: any) {
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
                backgroundColor = {LVColor.white}
                autoClose={true}
                buttonWidth={50}
                disabled = {this.state.readonly}
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
                        if (this.state.readonly) {
                            this.onSelectedItem(item,index);
                        } else {
                            this.setState({toDeDeletedContactName: null});
                            this.props.navigation.navigate('LVTContactDetailPage', {
                                 model: item});    
                        }
                }}>
                    <View style={styles.cellContentContainer}>
                        <View style={styles.cellLeftContentContainer}>
                            <Image source={AvatarIcon}/>
                            <View style={styles.cellLeftDetailsContainer}>
                                <Text style={styles.nameTextStyle} numberOfLines={1}>{item.name}</Text>
                            </View>
                        </View>
                        {this.state.readonly ?
                        <TouchableHighlight 
                        underlayColor={LVColor.white}  
                        onPress={()=>{
                            this.onSelectedItem(item,index);
                        }}>
                            <View style = {styles.cellRightContentContainer}>
                                {this.state.isItemSelected[index]? <Image source = {ItemSelected}/> : <Image source = {ItemUnselected}/>}
                            </View>    
                        </TouchableHighlight> : null
                        }
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }
    
    render() {
        const { contacts,isSearchingStatus,searchContacts } = this.state;
        const { params } = this.props.navigation.state;

        return (
            <View style={styles.rootContainer}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.contact_list_nav_title }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {
                        if (this.state.currentSelectItem !== null) {
                            this.state.callback(this.state.currentSelectItem['address']);
                        }
                        this.props.navigation.goBack()
                     }}
                    right={this.state.readonly?' ':LVStrings.contact_add_nav_right}
                    rightTextColor= {LVColor.text.grey2}
                    onRightPress={ () =>{
                        if(this.state.readonly) {
                            return;
                        }
                        this.setState({toDeDeletedContactName: null});
                        this.props.navigation.navigate('AddEditContactPage', {
                            callback:()=> this.loadContacts(),
                            mode: 'add'
                        })
                    }}
                />
                <TouchableOpacity 
                activeOpacity = {1}
                onPress={this.lostBlur.bind(this)}
                >
                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}
                >
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
                <LVKeyboardSpacer/>
                </ScrollView>
                <LVConfirmDialog ref={'deleteConfirm'} 
                            title={''}  
                            dismissAfterConfirm = {true}
                            message={LVStrings.contact_confirm_delete_contact} 
                            onConfirm={this.onDeleteContact} />
                </TouchableOpacity>
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
    cellRightContentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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