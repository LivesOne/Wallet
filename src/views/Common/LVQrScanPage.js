//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import LVStrings from './../../assets/localization';
import LVColor from '../../styles/LVColor';

export class LVQrScanPage extends Component {

    static navigationOptions = {
        header: null
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

    barcodeReceived(e:any) {
        alert('Type: ' + e.type + '\nData: ' + e.data);
    }
    
    render() {
        return (
                <BarcodeScanner
                    viewFinderBackgroundColor={'transparent'}
                    onBarCodeRead={this.barcodeReceived}
                    viewFinderShowLoadingIndicator={true}
                    viewFinderBorderColor={LVColor.primary}
                    viewFinderBorderWidth={2}
                    style={{ flex: 1}}
                    torchMode={this.state.torchMode}
                    cameraType={this.state.cameraType}>
                    <View style= {styles.header}>
                        <Text 
                            onPress={()=>{this.props.navigation.goBack();}}
                            style={styles.left}>{LVStrings.common_close}</Text>
                        <Text style={styles.title}>{LVStrings.qrScan_title}</Text>
                        <View style={styles.right}></View>
                    </View>
                </BarcodeScanner>
        )
    }
}

const styles = StyleSheet.create({
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

export default LVQrScanPage