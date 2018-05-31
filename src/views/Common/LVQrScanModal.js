//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';
import LVColor from './../../styles/LVColor';
import LVStrings from './../../assets/localization';
import QRCodeScanner from 'react-native-qrcode-scanner';
import TransferUtils from '../Transfer/TransferUtils';
import { getDeviceHeight } from '../../utils/MXUtils';

const CAMERA_WIDTH = Dimensions.get('window').width;
const CAMERA_HEIGHT = getDeviceHeight();

type Props = {
    isOpen: boolean,
    barcodeReceived: Function,
    onClosed: Function
};

type State = {
    torchMode: string,
    cameraType: string
}

export class LVQrScanModal extends React.Component<Props, State> {

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
                    containerStyle={{backgroundColor: '#88000000'}}
                    topViewStyle={styles.topViewStyle}
                    cameraStyle={ styles.cameraStyle }
                    bottomContent={
                        (<View style= {     {
                            position: 'absolute',
                            height: CAMERA_HEIGHT,
                            flexDirection: 'column',
                            width: CAMERA_WIDTH,
                            top: -CAMERA_HEIGHT + 20, 
                            backgroundColor:'transparent'}}>
                            <View style= {styles.header}>
                                <Text 
                                    onPress={this.onClosed.bind(this)}
                                    style={styles.left}>{LVStrings.common_close}</Text>
                                <Text style={styles.title}>{LVStrings.qrScan_title}</Text>
                                <View style={styles.right}></View>
                            </View>
                            <View style={styles.top}></View>
                            <View style={styles.middle}>
                                <View style={styles.middleSide}></View>
                                <View style={styles.middleCenter}></View>
                                <View style={styles.middleSide}></View>
                            </View>
                            <View style={styles.bottom}>
                                <Text style={styles.qrScanHint}>{LVStrings.qrScan_hint}</Text>
                            </View>

                            
                        </View> ) }
                    bottomViewStyle={{flex:1}}>
                </QRCodeScanner>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
      },
    header: {
        width: '100%',
        height: Platform.OS === 'ios' ? 70 : 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    top: {
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    middle : {
        height: CAMERA_WIDTH * 0.6,
        width: "100%",
        flexDirection: 'row',
    },
    bottom : {
        flex:4,  
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    middleSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    middleCenter: {
        width: CAMERA_WIDTH * 0.6,
        height: CAMERA_WIDTH * 0.6,
        borderWidth: 2,
        borderColor: LVColor.text.yellow
    },
    left: {
        width: 50,
        marginLeft: 15,
        color: LVColor.text.yellow,
        fontSize: 16,
        textAlign:'left'
    },
    title: {
        color: 'white',
        fontSize: 16,
    },
    right: {
        width: 50,
        marginRight: 15,
    },
    qrScanHint: {
        color: 'white',
        fontSize: 14,
        marginTop: 20,
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
        width: "100%", 
        height:"100%", 
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2, 
        padding: 2,
        justifyContent: 'center', 
        alignSelf: 'center'
      },
      topViewStyle: {
        flex: 0, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }
});


export default LVQrScanModal