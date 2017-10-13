/*
 * Project: Venus
 * File: src/views/Common/LVDialog.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Easing } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor';
import MXButton from '../../components/MXButton';

class LVDialog extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        message: PropTypes.string,
        buttonTitle: PropTypes.string,
        onPress: PropTypes.func,
        width: PropTypes.number,
        height: PropTypes.number
    };

    show() {
        this.refs.dialog.open();
    }

    dismiss() {
        this.refs.dialog.close();
    }

    onPressButton() {
        if (this.props.onPress) {
            this.props.onPress();
        } else {
            this.dismiss();
        }
    }

    render() {
        const message = this.props.message;
        const buttonTitle = this.props.buttonTitle;

        const modalWidth = { width: this.props.width || '90%' };
        const modalHeight = { height: this.props.height || (buttonTitle ? 250 : 200) };

        return (
            <Modal
                ref={'dialog'}
                isOpen={false}
                style={[styles.modal, modalWidth, modalHeight]}
                entry={'top'}
                position={'center'}
                coverScreen={true}
                backButtonClose={true}
                backdropOpacity={0.5}
                animationDuration={300}
                backdropPressToClose={false}
                easing={Easing.elastic(0.75)}
            >
                <View style={styles.dialog}>
                    <View style={styles.dialogTopPanel}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        {message ? <Text style={{ color: '#697485', fontSize: 14, lineHeight: 20 }}>{message}</Text> : null}
                    </View>
                    {this.props.children}
                    {buttonTitle ? (
                        <MXButton
                            style={styles.button}
                            rounded={true}
                            title={buttonTitle}
                            onPress={this.onPressButton.bind(this)}
                        />
                    ) : null}
                </View>
            </Modal>
        );
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    modal: {
        marginTop: -44,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        padding: 25,
        color: LVColor.text.grey1,
        fontSize: 18
    },
    titleText: {
        marginBottom: 25,
        fontSize: 14,
        color: '#697485'
    },
    dialog: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25
    },
    dialogTopPanel: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        marginBottom: 40
    }
});

export default LVDialog;
