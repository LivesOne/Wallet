//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import BarcodeScanner from 'react-native-barcodescanner';
import LVColor from './../../styles/LVColor';
import LVStrings from './../../assets/localization';
import QRCodeScanner from 'react-native-qrcode-scanner';


export class QrScanner extends Component {
    
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
        alert(event.data)
        if (this.props.barcodeReceived) {
            this.props.barcodeReceived(event);
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
                <QRCodeScanner
                    onRead={this.onBarcodeReceived.bind(this)}
                    showMarker={true}
                    topContent={(
                    <Text style={styles.centerText}>
                        Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                    </Text>
        )}
                    style={{ flex: 1}}>
                </QRCodeScanner>
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
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
      },
    
      textBold: {
        fontWeight: '500',
        color: '#000',
      },
});


export default QrScanner