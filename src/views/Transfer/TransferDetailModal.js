//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Image } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import MXButton from './../../components/MXButton';
import LVColor from './../../styles/LVColor';
import * as MXUtils from './../../utils/MXUtils';
import LVStrings from './../../assets/localization';
import { LightStyles } from '../../components/MXCrossTextInput/styles';
import MXTouchableImage from './../../components/MXTouchableImage';
import TransferUtils from './TransferUtils';
const CloseIcon = require('../../assets/images/close_modal.png');

const DetailItem = ({leftText, rightText}) => 
(<View
    style={[styles.detailContainer, leftText === LVStrings.transfer_address_in ? {height: 60} : null]}>
    <Text style={styles.left}>{leftText}</Text>
    <Text style={[styles.right, leftText === LVStrings.transfer_address_in ? {width: '50%'} : null]}>{rightText}</Text>
</View>);

type Props = {
    isOpen: bool,
    onClosed: Function,
    address: string,
    amount: number,
    minerGap: number,
    //remarks: PropTypes.string,
    onTransferConfirmed: Function,
};

export class TransferDetailModal extends Component<Props> {

    constructor(props: any) {
        super(props);
        this.onClosed = this.onClosed.bind(this);
    }

    onClosed = () => {
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    };

    render() {
        const {isOpen, onClosed, address, amount, minerGap, onTransferConfirmed } = this.props;
        return (
            <Modal 
                isOpen={isOpen}
                style={styles.modal}
                position={'bottom'}
                coverScreen={true}
                backButtonClose={true}
                backdropOpacity={0.5}
                animationDuration={300}
                onClosed={this.onClosed}
                >
                <View style={styles.container}>
                  <View style={ styles.titleContainer }>
                    <View style={{width: 40}}></View>
                    <Text style={styles.title}> {LVStrings.transfer_payment_details}</Text>
                    <MXTouchableImage style={{width: 40}} source={CloseIcon} onPress={this.onClosed}></MXTouchableImage>
                  </View>
                  <DetailItem leftText={LVStrings.transfer_address_in} rightText={address}></DetailItem>
                  <DetailItem leftText={LVStrings.transfer_amount} rightText={amount + ' LVT'}></DetailItem>
                  <DetailItem leftText={LVStrings.transfer_miner_tips} rightText={TransferUtils.convertMinnerGap(minerGap) + ' ETH'}></DetailItem>
                  {/* <DetailItem leftText={LVStrings.transfer_remarks} rightText={remarks}></DetailItem> */}
                <MXButton title={LVStrings.transfer} rounded={true} style={styles.btn} onPress = {onTransferConfirmed}></MXButton>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        height: '60%'
      },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20, 
    },
    titleContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: 50, 
        alignItems: 'center', 
        borderWidth: StyleSheet.hairlineWidth,  
        borderColor: 'transparent', 
        borderBottomColor: LVColor.border.editTextBottomBoarder
    },
    title: {
        fontSize: 18, 
        color: LVColor.text.grey1,
    },
    detailContainer: {
        flexDirection: 'row', 
        height: 50, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderWidth: StyleSheet.hairlineWidth, 
        borderColor: 'transparent', 
        borderBottomColor: LVColor.border.editTextBottomBoarder,
        marginHorizontal: 20,
    },
    left: {
        color: LVColor.text.grey1, 
        fontSize: 16
    },
    right: {
        color: LVColor.text.grey1, 
        fontSize: 16,  
        textAlign: 'right',
        textAlignVertical: 'center',
    },
    btn: {
        alignSelf: 'center',
        marginTop: 30
    }
});


export default TransferDetailModal