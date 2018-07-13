/*
 * Project: Venus
 * File: src/views/Assets/TokenListScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Keyboard } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVUtils from '../../utils';
import LVStrings from '../../assets/localization';
import LVWallet from '../../logic/LVWallet';
import LVWalletManager from '../../logic/LVWalletManager';
import MXSearchBar from '../../components/MXSearchBar';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';

type Props = { navigation: Object };
type State = {
    wallet: LVWallet,
    refreshing: boolean,
    searching: boolean,
    searchingText: ?string
};

export default class TokenListScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    constructor(props: any) {
        super(props);
        const wallet = LVWalletManager.getSelectedWallet() || LVWallet.emptyWallet();
        this.state = {
            wallet: wallet,
            refreshing: false,
            searching: false,
            searchingText: null
        };

        this.onSearchBarTextChanged = this.onSearchBarTextChanged.bind(this);
        this.onSearchBarEndEditing = this.onSearchBarEndEditing.bind(this);
        this.onSearchBarFocus = this.onSearchBarFocus.bind(this);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    lostBlur = () => {
        Keyboard.dismiss();
        if (LVUtils.isEmptyString(this.state.searchingText) && this.state.searching) {
            this.setState({ searching: false });
        }
    };

    onSearchBarTextChanged = async (text: string) => {};

    onSearchBarFocus = () => {};

    onSearchBarEndEditing = () => {};

    render() {
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title={LVStrings.token_list_title}
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ fontSize: LVSize.large, color: LVColor.text.grey2 }}
                    left={require('../../assets/images/back_grey.png')}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this.lostBlur.bind(this)}>
                    <MXSearchBar
                        style={{ marginTop: 10 }}
                        placeholder={LVStrings.token_list_search_placeholder}
                        onFocus={this.onSearchBarFocus}
                        onTextChanged={this.onSearchBarTextChanged}
                        onEndEditing={this.onSearchBarEndEditing}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: LVColor.white
    }
});
