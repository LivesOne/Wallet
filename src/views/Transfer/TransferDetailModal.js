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
import { converAddressToDisplayableText } from '../../utils/MXStringUtils';
const CloseIcon = require('../../assets/images/close_modal.png');

const DetailItem = ({leftText, rightText}) => 
(<View
    style={[styles.detailContainer, leftText === LVStrings.transfer_address_in ? {height: 60} : null]}>
    <Text style={styles.left}>{leftText}</Text>
    <Text style={[styles.right, leftText === LVStrings.transfer_address_in ? {width: '80%'} : null]}>{rightText}</Text>
</View>);

type Props = {
    isOpen: bool,
    onClosed: Function,
    address: string,
    amount: number,
    minerGap: number,
    type: string,
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

    getShowAddress= (address: string) => {
        return converAddressToDisplayableText(TransferUtils.removeHexHeader(address),9,9)
    }

    render() {
        const {isOpen, onClosed, address, amount, minerGap, onTransferConfirmed, type} = this.props;
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
                    <Text style={styles.title}> {LVStrings.transfer_payment_details}</Text>
                    <MXTouchableImage style={{position:'absolute', right:20}} source={CloseIcon} onPress={this.onClosed}></MXTouchableImage>
                  </View>
                  <DetailItem leftText={LVStrings.transfer_address_in} rightText={this.getShowAddress(address)}></DetailItem>
                  <DetailItem leftText={LVStrings.transfer_amount} rightText={amount + ' ' + type.toUpperCase()}></DetailItem>
                  <DetailItem leftText={LVStrings.transfer_miner_tips} rightText={TransferUtils.convertMinnerGap(minerGap) + ' ETH'}></DetailItem>
                  {/* <DetailItem leftText={LVStrings.transfer_remarks} rightText={remarks}></DetailItem> */}
                  <View style={styles.btnContainer}>
                    <MXButton title={LVStrings.transfer} rounded={true} style={styles.btn} onPress = {onTransferConfirmed}></MXButton>
                  </View>
                
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        height: '50%'
      },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20, 
    },
    titleContainer: {
        flex:1,
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        height: MXUtils.getDeviceHeight() / 6, 
        borderWidth: StyleSheet.hairlineWidth,  
        borderColor: 'transparent', 
        paddingHorizontal: 20,
        borderBottomColor: LVColor.border.editTextBottomBoarder
    },
    title: {
        fontSize: 16, 
        color: LVColor.text.grey1,
        alignSelf: 'center',
    },
    detailContainer: {
        flex:1,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between', 
        height: MXUtils.getDeviceHeight() / 6, 
        
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
    btnContainer: {
        flex:2,
        alignItems: 'center',
        justifyContent: 'center', 
        marginHorizontal: 20,
        borderWidth: StyleSheet.hairlineWidth, 
        borderColor: 'transparent', 
        borderTopColor: LVColor.border.editTextBottomBoarder,
    },
    btn: {
        width: '100%',
    }
});


export default TransferDetailModal