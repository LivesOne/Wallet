
/*
 * Project: Venus
 * File: src/views/contacts/AddContactPage.js
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

export default class AddContactPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    render() {
        return (
            <View style={styles.rootView}>
                <MXNavigatorHeader
                    left={ greyNavigationBackIcon }
                    style={styles.nav}
                    title={ LVStrings.contact_add_nav_title }
                    titleStyle={styles.navTitle}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    right={LVStrings.common_done}
                    rightTextColor={'#c3c8d3'}
                    onRightPress={ () => this.props.navigation.goBack() }
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_nickname}
                            withClearButton={false}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_address}
                            withClearButton={false}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_cellphone}
                            withClearButton={false}/>
                        <MXCrossTextInput style={styles.textInputStyle} 
                            placeholder={LVStrings.contact_add_place_holder_email}
                            withClearButton={false}/>
                        <MXCrossTextInput style={styles.textInputStyle}
                             placeholder={LVStrings.contact_add_place_holder_remarks}
                             withClearButton={false}/>
                    </View>
                </ScrollView>
                
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