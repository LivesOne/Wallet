/*
 * Project: Venus
 * File: src/views/Common/LVDialog.js
 * @flow
 */
'use strict';

import * as React from 'react';
import { StyleSheet, Dimensions, View, ViewPropTypes, Text, Easing, TouchableOpacity } from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import Modal from 'react-native-modalbox';
import LVColor from '../../styles/LVColor';
import LVStrings from '../../assets/localization';
import MXButton from '../../components/MXButton';
import MXCrossTextInput from '../../components/MXCrossTextInput';

type Props = {
    style?: ViewPropTypes.style,
    title: string,
    titleStyle?: Text.propTypes.style,
    message?: string,
    messageStyle?: Text.propTypes.style,
    buttonTitle?: string,
    onPress?: Function,
    onPressContent?: Function,
    tapToClose: boolean,
    width?: any,
    height?: number,
    children?: React.Element<any>,
};

export default class LVDialog extends React.Component<Props> {
    static defaultProps = {
        message: '',
        tapToClose: false,
    }

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
        const childrenHeight = this.props.children ? this.props.children.props.style.height : 0;
        const modalHeight = {
            height: this.props.height || 50 + (message ? 40 : 0) + childrenHeight + (buttonTitle ? 100 : 10)
        };

        return (
            <Modal
                ref={'dialog'}
                isOpen={false}
                style={[styles.modal, modalWidth, modalHeight]}
                entry={'top'}
                position={'center'}
                coverScreen={true}
                backButtonClose={true}
                swipeToClose={false}
                backdropOpacity={0.5}
                animationDuration={300}
                backdropPressToClose={this.props.tapToClose === true}
                easing={Easing.elastic(0.75)}
            >
                <View style={styles.dialog}>
                    <View style={styles.dialogTopPanel}>
                        <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
                    </View>
                    <View style={styles.dialogContent} onPress={this.props.onPressContent}>
                        {message ? <Text style={[styles.message, this.props.messageStyle]}>{message}</Text> : null}
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
                </View>
            </Modal>
        );
    }
}


type ConfirmDialogProps = Props & {
    confirmTitle: string,
    cancelTitle: string,
    confirmTitleStyle?: Text.propTypes.style,
    cancelTitleStyle?: Text.propTypes.style,
    onConfirm: Function,
    onCancel?: Function,
    dismissAfterConfirm: boolean,
    disableConfirm: boolean,
    disableCancel: boolean
};

export class LVConfirmDialog extends React.Component<ConfirmDialogProps> {

    static defaultProps = {
        confirmTitle: LVStrings.common_confirm,
        cancelTitle: LVStrings.common_cancel,
        dismissAfterConfirm: false,
        disableConfirm: false,
        disableCancel: false,
        tapToClose: false,
    }

    show() {
        this.refs.dialog.show();
    }

    dismiss() {
        this.refs.dialog.dismiss();
    }

    onPressCancel() {
        if (this.props.disableCancel) {
            return;
        }

        if (this.props.onCancel) {
            this.props.onCancel();
        }
        this.dismiss();
    }

    onPressConfirm() {
        if (this.props.disableConfirm) {
            return;
        }

        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
        if (this.props.dismissAfterConfirm != false) {
            this.dismiss();
        }
    }

    render() {
        const buttonPanelStyle = {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        };
        const buttonStyle = {
            width: '50%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        };
        const buttonTitleStyle = {
            fontSize: 16,
            color: LVColor.text.grey1
        };
        const lineWidth = StyleSheet.hairlineWidth;
        const lineColor = LVColor.separateLine;

        const { confirmTitle, cancelTitle } = this.props;

        const childrenHeight = this.props.children ? ( this.props.children.props.height || 64) : 0;
        const modalHeight = 50 + childrenHeight;

        return (
            <LVDialog ref={'dialog'} {...this.props}>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', height: modalHeight }}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>{this.props.children}</View>
                    <View style={{ width: '100%', height: 50 }}>
                        <View style={{ width: '100%', height: lineWidth, backgroundColor: lineColor }} />
                        <Separator insetLeft={0} tintColor={LVColor.separateLine} />
                        <View style={buttonPanelStyle}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={buttonStyle}
                                onPress={this.onPressConfirm.bind(this)}
                            >
                                <Text style={[buttonTitleStyle, this.props.confirmTitleStyle]}>{confirmTitle}</Text>
                            </TouchableOpacity>
                            <View style={{ width: lineWidth, height: '100%', backgroundColor: lineColor }} />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={buttonStyle}
                                onPress={this.onPressCancel.bind(this)}
                            >
                                <Text style={[buttonTitleStyle, this.props.cancelTitleStyle]}>{cancelTitle}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LVDialog>
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
        alignItems: 'center'
    },
    title: {
        color: LVColor.text.grey1,
        fontSize: 18
    },
    message: {
        paddingLeft: 25,
        paddingRight: 25,
        color: '#697485',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 20
    },
    dialog: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    dialogTopPanel: {
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialogContent: {
        flex: 1,
        width: '100%',
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        marginBottom: 20
    }
});
