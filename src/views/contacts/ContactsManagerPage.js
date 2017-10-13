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
import AddContactPage from './AddContactPage';
import {greyNavigationBackIcon} from '../../assets/LVIcons';
const AddIcon = require('../../assets/images/add_contact.png');

export default class ContactsManagerPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };
    
    render() {
        return (
            <View>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.contact_list_nav_title }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right={AddIcon}
                    rightStyle={styles.navRightStyle}
                    onRightPress={ () => this.props.navigation.navigate('AddContactPage') }
                />
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
    navRightStyle: {
        marginRight: 12.5
    }
});