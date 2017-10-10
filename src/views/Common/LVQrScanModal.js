//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import BarcodeScanner from 'react-native-barcodescanner';
import LVColor from './../../styles/LVColor';
import LVStrings from './../../assets/localization';

export class LVQrScanModal extends Component {
    
    static propTypes = {
        barcodeReceived: PropTypes.func,
        onClosed: PropTypes.func,
    };

    state: {
        torchMode: string,
        cameraType: string
    }

    constructor(props: any) {
        super(props);

        this.state = {
          torchMode: 'off',
          cameraType: 'back',
        };
    }

    onClosed = () =>  {
        if (this.props.onClosed) {
            this.props.onClosed();
        } 
    };

    onBarcodeReceived(event: any) {
        if (this.props.barcodeReceived) {
            this.props.onBarcodeReceived(event);
        }
        this.onClosed();
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen}
                style={styles.modal}
                position={'center'}
                entry={'top'}
                coverScreen={true}
                swipeToClose={false}
                backButtonClose={true}
                animationDuration={0}
                onClosed={this.onClosed}
                >
                <BarcodeScanner
                    viewFinderBackgroundColor={'transparent'}
                    onBarCodeRead={this.onBarcodeReceived.bind(this)}
                    viewFinderBorderColor={LVColor.primary}
                    viewFinderBorderWidth={2}
                    style={{ flex: 1}}
                    torchMode={this.state.torchMode}
                    cameraType={this.state.cameraType}>
                    <View style= {styles.header}>
                        <Text 
                            onPress={this.onClosed.bind(this)}
                            style={styles.left}>{LVStrings.common_close}</Text>
                        <Text style={styles.title}>{LVStrings.qrScan_title}</Text>
                        <View style={styles.right}></View>
                    </View>
                </BarcodeScanner>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
      },
    header: {
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        width: '100%',
        height: Platform.OS === 'ios' ? 70 : 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(40, 41, 44, 0.7)'
    },
    left: {
        width: 50,
        color: LVColor.primary,
        fontSize: 16,
        textAlign:'center'
    },
    title: {
        color: 'white',
        fontSize: 16,
    },
    right: {
        width: 50
    }
});


export default LVQrScanModal