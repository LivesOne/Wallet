//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import LVColor from './../../styles/LVColor';
import LVStrings from './../../assets/localization';
import QRCodeScanner from 'react-native-qrcode-scanner';
import TransferUtils from '../Transfer/TransferUtils';


const CAMERA_WIDTH = Dimensions.get('window').width * 0.6;

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
            this.props.barcodeReceived(TransferUtils.getAddrFromIbanIfNeeded(event.data));
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
                    style={{ flex: 1}}
                    onRead={this.onBarcodeReceived.bind(this)}
                    showMarker={false}
                    notAuthorizedView={(
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            }}>
                            <Text style={{ textAlign: 'center', fontSize: 16}}>{LVStrings.common_camera_not_authorized}</Text>
                        </View>
                    )}
                    containerStyle={{backgroundColor: 'rgba(40, 41, 44, 0.5)'}}
                    topContent={(
                        <View style= {styles.header}>
                        <Text 
                            onPress={this.onClosed.bind(this)}
                            style={styles.left}>{LVStrings.common_close}</Text>
                        <Text style={styles.title}>{LVStrings.qrScan_title}</Text>
                        <View style={styles.right}></View>
                        </View> )}
                    topViewStyle={styles.topViewStyle}
                    cameraStyle={ styles.cameraStyle }
                    bottomContent={
                        (<View style= {{flex:1, }}>
                            <Text style={styles.qrScanHint}>{LVStrings.qrScan_hint}</Text>
                        </View>)  }
                    bottomViewStyle={{flex:1, }}>
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
        backgroundColor: 'rgba(40, 41, 44, 0.1)'
    },
    left: {
        width: 50,
        marginLeft: 15,
        color: LVColor.primary,
        fontSize: 16,
        textAlign:'left'
    },
    title: {
        color: 'white',
        fontSize: 16,
    },
    right: {
        width: 50
    },
    qrScanHint: {
        color: 'white',
        fontSize: 16,
        marginTop: 30,
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
      cameraStyle: {
        width: CAMERA_WIDTH, 
        height:CAMERA_WIDTH, 
        alignItems: 'center',
        marginTop: CAMERA_WIDTH/2, 
        backgroundColor: 'transparent',
        borderWidth: 2, 
        padding: 2,
        borderColor: LVColor.primary,
        justifyContent: 'center', 
        alignSelf: 'center'
      },
      topViewStyle: {
        flex: 0, 
        justifyContent: 'center',
        alignItems: 'center'
      }
});


export default LVQrScanModal