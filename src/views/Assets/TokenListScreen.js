/*
 * Project: Venus
 * File: src/views/Assets/TokenListScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Keyboard, FlatList, RefreshControl } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVUtils from '../../utils';
import LVStrings from '../../assets/localization';
import LVTokens from '../../logic/LVTokens';
import LVWallet from '../../logic/LVWallet';
import LVWalletManager from '../../logic/LVWalletManager';
import MXSearchBar from '../../components/MXSearchBar';
import MXTouchableImage from '../../components/MXTouchableImage';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';

const addTokenIcon = require('../../assets/images/add_token.png');
const addTokenDisableIcon = require('../../assets/images/add_token_disable.png');
const searchEmptyIcon = require('../../assets/images/search_result_empty.png');

type Props = { navigation: Object };
type State = {
    wallet: LVWallet,
    records: Array<Object>,
    loading: boolean,
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
            records: [],
            loading: true,
            searching: false,
            searchingText: null
        };

        this.onSearchBarTextChanged = this.onSearchBarTextChanged.bind(this);
        this.onSearchBarEndEditing = this.onSearchBarEndEditing.bind(this);
        this.onSearchBarFocus = this.onSearchBarFocus.bind(this);
    }

    componentDidMount() {
        this.loadRecordsWhileRefetchTokens(false);
    }

    openWebView = () => {
        if (LVUtils.isNavigating()) {
            return;
        }
        this.lostBlur();
        this.props.navigation.navigate('WebView', { url: 'https://lives.one' });
    };

    lostBlur = () => {
        Keyboard.dismiss();
    };

    onSearchBarTextChanged = async (text: string) => {
        if (LVUtils.isNotEmptyString(text)) {
            this.setState({ searching: true, searchingText: text });
        } else {
            this.setState({ searching: false, searchingText: null });
        }
    };

    onSearchBarFocus = () => {
        this.setState({ searching: true });
    };

    onSearchBarEndEditing = () => {};

    loadRecordsWhileRefetchTokens = async (refetch: boolean) => {
        let tokens = LVTokens.supported;

        if (refetch || tokens === null || tokens === undefined || tokens.length == 0) {
            await LVTokens.updateSupportedTokens();
            tokens = LVTokens.supported;
        }

        // record objects
        const records = tokens.map(token => {
            return {
                token: token,
                image: LVTokens.icons.normal(token),
                fullname: LVTokens.fullname(token),
                available: this.state.wallet.isAvailable(token),
            };
        });

        this.setState({ records: records, loading: false });
    };

    _onRefresh = async () => {
        await this.loadRecordsWhileRefetchTokens(true);
    };

    _keyExtractor = (item, index) => index.toString();

    _renderItem = ({ item }) => (
        <LVTokenRecordItem
            token={item.token.toUpperCase()}
            image={item.image}
            fullname={item.fullname}
            available={item.available}
            onPressAddButton={() => {
                this._onPressAddButton(item);
            }}
        />
    );

    _onPressAddButton = async (item: Object) => {
        if (item.available) {
            this.state.wallet.removeAvailableToken(item.token);
        } else {
            this.state.wallet.addAvailableToken(item.token);
        }

        await LVWalletManager.saveToDisk();
        await this.loadRecordsWhileRefetchTokens(false);

        LVNotificationCenter.postNotification(LVNotification.walletChanged);
    };

    render() {
        const { records, loading, searching, searchingText } = this.state;

        let data = records;
        let searchResultEmpty = false;

        if (searching && searchingText != null) {
            const text = searchingText.trim().toLowerCase();
            data = records.filter(r => r.token.toLowerCase().match(text) != null);
            if (data === null || data === undefined || data.length === 0) {
                searchResultEmpty = true;
            }
        }

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
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.touchContainer} onPress={this.lostBlur.bind(this)} />

                    <MXSearchBar
                        ref={'searchBar'}
                        style={{ marginTop: 10 }}
                        placeholder={LVStrings.token_list_search_placeholder}
                        onFocus={this.onSearchBarFocus}
                        onTextChanged={this.onSearchBarTextChanged}
                        onEndEditing={this.onSearchBarEndEditing}
                    />

                    {searchResultEmpty ? (
                        <View style={styles.searchEmpty}>
                            <Image style={styles.searchEmptyImage} source={searchEmptyIcon} />
                            <TouchableOpacity activeOpacity={0.8} onPress={this.openWebView.bind(this)}>
                                <Text style={styles.searchEmptyText}>{LVStrings.token_list_search_result_empty}</Text>
                                <Text style={styles.searchEmptyText}>{LVStrings.token_list_add_token}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            style={{ flex: 1, marginTop: 10 }}
                            data={data}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={() => <View />}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={this._onRefresh.bind(this)} />
                            }
                        />
                    )}
                </View>
            </View>
        );
    }
}

type ItemProps = {
    token: string,
    image: any,
    available: boolean,
    fullname: string,
    onPressAddButton: ?Function
};

class LVTokenRecordItem extends React.Component<ItemProps> {
    onPressButton = () => {
        if (this.props.onPressAddButton) {
            this.props.onPressAddButton();
        }
    };

    render() {
        const { token, image, available, fullname } = this.props;
        const buttonIcon = available ? addTokenDisableIcon : addTokenIcon;
        return (
            <View style={styles.record}>
                <Image style={styles.icon} source={image} resizeMode="contain" />
                <View style={styles.middle}>
                    <Text style={styles.token}>{token}</Text>
                    <Text style={styles.fullname}>{fullname}</Text>
                </View>
                <MXTouchableImage source={buttonIcon} onPress={this.onPressButton.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white
    },
    touchContainer: {
        ...StyleSheet.absoluteFillObject
    },
    record: {
        height: 60,
        marginLeft: 16,
        marginRight: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    icon: {
        width: 29,
        height: 29
    },
    middle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 8
    },
    token: {
        fontSize: 15,
        fontFamily: 'SFProText-Semibold',
        textAlign: 'left',
        color: LVColor.text.grey2
    },
    fullname: {
        fontSize: 11,
        fontFamily: 'SFProText-Regular',
        textAlign: 'left',
        color: LVColor.text.placeHolder
    },
    searchEmpty: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    searchEmptyImage: {
        marginTop: 100,
        marginBottom: 12
    },
    searchEmptyText: {
        alignSelf: 'center',
        marginBottom: 5,
        fontSize: 15,
        color: LVColor.text.yellow,
        textDecorationLine: 'underline'
    }
});
