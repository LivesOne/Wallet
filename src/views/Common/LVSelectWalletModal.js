/*
 * Project: Venus
 * File: src/views/Common/LVSelectWalletModal.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Easing, FlatList, TouchableOpacity } from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import LVColor from '../../styles/LVColor';
import MXTouchableImage from '../../components/MXTouchableImage';
import LVWalletManager from '../../logic/LVWalletManager';
import LVNotification from '../../logic/LVNotification';
import LVNotificationCenter from '../../logic/LVNotificationCenter';

const closeIcon = require('../../assets/images/close_modal.png');
const itemSelected = require('../../assets/images/list_item_selected.png');
const itemUnselected = require('../../assets/images/list_item_unselected.png');
const walletSelected = require('../../assets/images/wallet_selected.png');
const walletUnselected = require('../../assets/images/wallet_unselected.png');

export default class LVSelectWalletModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onClosed: PropTypes.func,
        onSelected: PropTypes.func
    };

    state: {
        selectedId: number,
        data: ?Array<Object>
    };

    constructor(props: any) {
        super(props);
        this.state = {
            selectedId: LVWalletManager.selectedIndex,
            data: LVWalletManager.wallets.map((w, i) => ({ id: i, name: w.name }))
        };

        this.onClosed = this.onClosed.bind(this);
        this.onPressCloseButton = this.onPressCloseButton.bind(this);
    }

    onPressCloseButton = () => {
        this.refs.modal.close();
    };

    onClosed = () => {
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    };

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: number) => {
        this.setState({ selectedId: id });
        
        LVWalletManager.selectedIndex = id;
        LVNotificationCenter.postNotification(LVNotification.walletChanged);

        this.refs.modal.close();
    };

    _renderItem = ({ item }) => (
        <LVSelectWalletItem
            id={item.id}
            walletName={item.name}
            selected={item.id === this.state.selectedId}
            onPressItem={this._onPressItem}
        />
    );

    render() {
        return (
            <Modal
                ref={'modal'}
                isOpen={this.props.isOpen}
                style={[styles.modal]}
                position={'bottom'}
                coverScreen={true}
                backButtonClose={true}
                backdropOpacity={0.5}
                animationDuration={300}
                easing={Easing.elastic(0.75)}
                onClosed={this.onClosed}
            >
                <View style={styles.content}>
                    <FlatList
                        style={styles.list}
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem.bind(this)}
                        ItemSeparatorComponent={() => <Separator insetRight={15} tintColor={LVColor.separateLine} />}
                    />
                    <MXTouchableImage style={styles.button} source={closeIcon} onPress={this.onPressCloseButton} />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '46%'
    },
    content: {
        flex: 1
    },
    list: {
        flex: 1
    },
    button: {
        height: 47
    }
});

class LVSelectWalletItem extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        selected: PropTypes.bool.isRequired,
        walletName: PropTypes.string.isRequired,
        onPressItem: PropTypes.func
    };

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {
        const { selected, walletName } = this.props;

        return (
            <TouchableOpacity style={itemStyles.container} activeOpacity={0.7} onPress={this._onPress.bind(this)}>
                <View style={itemStyles.left}>
                    <Image source={selected ? walletSelected : walletUnselected} />
                    <Text style={itemStyles.text}>{walletName}</Text>
                </View>
                <Image style={itemStyles.selected} source={selected ? itemSelected : itemUnselected} />
            </TouchableOpacity>
        );
    }
}

const itemStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: 66,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    left: {
        marginLeft: 12.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    selected: {
        marginRight: 13.5
    },
    text: {
        marginLeft: 5,
        fontSize: 14,
        color: LVColor.text.grey1
    }
});
