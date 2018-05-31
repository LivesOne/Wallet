//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Easing, TextInput, Clipboard } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import MXButton from './../../../components/MXButton';
import LVColor from './../../../styles/LVColor';
import * as MXUtils from './../../../utils/MXUtils';
import LVStrings from './../../../assets/localization';
import Toast from 'react-native-root-toast';

export class WalletExportModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onClosed: PropTypes.func,
        privateKey: PropTypes.string,
    };

    constructor(props: any) {
        super(props);
        this.onClosed = this.onClosed.bind(this);
    }

    onClosed = () => {
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    };

    onCopyKey() {
        Clipboard.setString(this.props.privateKey);
        Toast.show(LVStrings.wallet_export_private_key_copied_to_clipboard)
        setTimeout(() => {
            this.refs.dialog.close();
        }, 500);
    }

    render() {
        return (
            <Modal 
                ref={'dialog'}
                isOpen={this.props.isOpen}
                style={styles.modal}
                position={'center'}
                coverScreen={true}
                backButtonClose={true}
                backdropOpacity={0.5}
                animationDuration={300}
                onClosed={this.onClosed}
                >
                <View style={styles.container}>
                    <Text style={styles.title}> {LVStrings.profile_wallet_my_private_key} </Text>
                    <TextInput  
                        textAlignVertical={'top'}             
                        underlineColorAndroid = {'transparent'}
                        multiline= {true} 
                        editable={false} 
                        selectTextOnFocus={false}
                        style={ styles.textInput }>{ this.props.privateKey }
                    </TextInput>
                    <Text style={{fontSize: 15, color: LVColor.text.yellow, marginTop: 15,  fontWeight: '200', textAlign: 'left'}}>{LVStrings.profile_wallet_export_warnning}</Text>
                    <MXButton
                        rounded
                        isEmptyButtonType = {true}
                        style={ styles.btn }
                        onPress={this.onCopyKey.bind(this)}
                        title={ LVStrings.prifile_wallet_export_copy_key }/>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: MXUtils.getDeviceHeight() / 2,
        width: '90%',
        borderRadius: 5,
      },
    container: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20, 
        width: '100%', 
        padding: 20
    },
    title: {
        fontSize: 20, 
        color: LVColor.text.grey1
    },
    textInput: {
        backgroundColor: "#f8f9fb", 
        width: '100%',
        height: 80,
        fontSize: 16,
        color: LVColor.text.grey2,
        marginTop: 30,
        borderRadius: 3,
        padding : 10,
    },
    warnning: {
        fontSize: 15, 
        color: LVColor.text.red, 
        marginTop: 15,  
        fontWeight: '100',
    },
    btn: {
        marginTop: 20,
        width: MXUtils.getDeviceWidth() /2,
    }
});


export default WalletExportModal