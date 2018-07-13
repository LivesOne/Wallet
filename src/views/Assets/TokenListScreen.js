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
import LVTokenIcons from '../../assets/LVTokenIcons';
import LVWallet from '../../logic/LVWallet';
import LVWalletManager from '../../logic/LVWalletManager';
import MXSearchBar from '../../components/MXSearchBar';
import MXTouchableImage from '../../components/MXTouchableImage';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';

const tokenDescriptions = {
    eth: 'Ethereum Foundation',
    LVTC: 'LivesToken',
    DGD: 'Digix DAO',
    OMG: 'OmiseGo',
    XRP: 'Ripple',
};

const addTokenIcon = require('../../assets/images/add_token.png');
const addTokenDisableIcon = require('../../assets/images/add_token_disable.png');

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

    componentWillUnmount() {}

    lostBlur = () => {
        Keyboard.dismiss();
        if (LVUtils.isEmptyString(this.state.searchingText) && this.state.searching) {
            this.setState({ searching: false });
        }
    };

    onSearchBarTextChanged = async (text: string) => {
        console.log(text);
        this.setState({ searching: true, searchingText: text });
    };

    onSearchBarFocus = () => {
        this.setState({ searching: true, searchingText: null });
    };

    onSearchBarEndEditing = () => {
        this.setState({ searching: false, searchingText: null });
    };

    loadRecordsWhileRefetchTokens = async (refetch: boolean) => {
        let tokens = LVWalletManager.supportTokens;

        if (refetch || tokens === null || tokens === undefined || tokens.length == 0) {
            await LVWalletManager.updateSupportTokens();
            tokens = LVWalletManager.supportTokens;
        }

        // remove the token that has no icon
        tokens = tokens.filter((token) => { return LVTokenIcons.has(token) });

        // record objects
        const records = tokens.map((token) => {
            return {
                token: token,
                image: LVTokenIcons.get(token),
                available: this.state.wallet.available_tokens.includes(token),
                description: tokenDescriptions[token]
            };
        });

        this.setState({ records: records, loading: false });
    }

    _onRefresh = async () => {
        await this.loadRecordsWhileRefetchTokens(true);
    }

    _keyExtractor = (item, index) => index.toString();

    _renderItem = ({ item }) => (
        <LVTokenRecordItem
            token={item.token.toUpperCase()}
            image={item.image}
            available={item.available}
            description={item.description}
            onPressAddButton={() => {
                this._onPressAddButton(item);
            }}
        />
    );

    _onPressAddButton = (item: Object) => {
    };

    render() {
        const { records, loading, searching, searchingText } = this.state;

        let data = records;

        if (searching && searchingText != null) {
            const text = searchingText.trim().toLowerCase();
            data = records.filter(r => r.token.toLowerCase().match(text) != null);
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
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this.lostBlur.bind(this)}>
                    <MXSearchBar
                        style={{ marginTop: 10 }}
                        placeholder={LVStrings.token_list_search_placeholder}
                        onFocus={this.onSearchBarFocus}
                        onTextChanged={this.onSearchBarTextChanged}
                        onEndEditing={this.onSearchBarEndEditing}
                    />
                    <FlatList
                        style={{ flex: 1, paddingTop: 10 }}
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
                </TouchableOpacity>
            </View>
        );
    }
}

type ItemProps = {
    token: string,
    image: any,
    available: boolean,
    description: string,
    onPressAddButton: ?Function
};

class LVTokenRecordItem extends React.Component<ItemProps> {
    
    onPressButton = () => {
        if (this.props.onPressAddButton) {
            this.props.onPressAddButton();
        }
    }

    render() {
        const { token, image, available, description } = this.props;
        const buttonIcon = available ? addTokenDisableIcon : addTokenIcon;
        return (
            <View style={styles.record}>
                <Image style={styles.icon} source={image} resizeMode="contain" />
                <View style={styles.middle}>
                    <Text style={styles.token} >{token}</Text>
                    <Text style={styles.description} >{description}</Text>
                </View>
                <MXTouchableImage source={buttonIcon} onPress={this.onPressButton.bind(this)}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: LVColor.white
    },
    record: {
        height: 60,
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
    description: {
        fontSize: 11,
        fontFamily: 'SFProText-Regular',
        textAlign: 'left',
        color: LVColor.text.placeHolder
    }
});
