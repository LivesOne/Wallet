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

const closeIcon = require('../../assets/images/close_modal.png');
const itemSelected = require('../../assets/images/list_item_selected.png');
const itemUnselected = require('../../assets/images/list_item_unselected.png');
const walletSelected = require('../../assets/images/wallet_selected.png');
const walletUnselected = require('../../assets/images/wallet_unselected.png');

const testData = [
    { id: '1', name: 'Gavin的钱包', address: '2426c3d0a70efa0de3b6526625d113057953563b' },
    { id: '2', name: 'ETH', address: '6842e93c53042f937b639fb485dbebff7d3d912c' },
    { id: '3', name: '傲游LivesToken', address: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7' },
    { id: '4', name: '加密测试钱包', address: '95000fed9fb60da827c995cdd61faad715e667dc' },
    { id: '5', name: '交易测试钱包', address: '16b74b54d0c321795cdf52ea7899728f6b54d1d8' },
    { id: '6', name: '收款测试钱包', address: '601c28cd84bdc0155cff6e0a2bb54be4192b7253' }
];

export default class LVSelectWalletModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onClosed: PropTypes.func,
        selectedWalletId: PropTypes.string,
        onSelected: PropTypes.func,
    };

    state: {
        selectedWalletId: string,
        selected: Map<string, boolean>,
        data: ?Array<Object>
    };

    constructor(props: any) {
        super(props);
        this.state = {
            selectedWalletId: props.selectedWalletId,
            selected: (new Map(): Map<string, boolean>),
            data: testData
        };
        if (props.selectedWalletId) {
            this.state.selected.set(props.selectedWalletId, true);
        }
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

    _onPressItem = (id: string) => {
        this.setState(state => {
            const selected = new Map();
            selected.set(id, !selected.get(id)); // toggle
            return { selected };
        });
        if (id && this.state.data && this.props.onSelected) {
            const walletObject = this.state.data.find((value, index, arr) => { return value.id === id });
            this.props.onSelected(walletObject);
        }
    };

    _renderItem = ({ item }) => (
        <LVSelectWalletItem
            id={item.id}
            walletName={item.name}
            selected={!!this.state.selected.get(item.id)}
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
                        renderItem={this._renderItem}
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
        id: PropTypes.string.isRequired,
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
            <TouchableOpacity style={itemStyles.container} activeOpacity={0.7} onPress={this._onPress.bind(this)} >
                <View style={itemStyles.left}>
                    <Image source={selected ? walletSelected : walletUnselected} />
                    <Text style={itemStyles.text} >{walletName}</Text>
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
        marginRight: 13.5,
    },
    text: {
        marginLeft: 5,
        fontSize: 14,
        color: LVColor.text.grey1,
    }
});
