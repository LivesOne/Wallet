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
                        {this.props.title && (
                            <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
                        )}
                        
                        {message ? <Text style={[styles.message, this.props.messageStyle]}>{message}</Text> : null}
                    </View>
                    
                    <View style={styles.dialogContent} onPress={this.props.onPressContent}>
                        {this.props.children}
                        {buttonTitle ? (
                            <MXButton
                                rounded={true}
                                title={buttonTitle}
                                isEmptyButtonType = {true}
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
        this.refs.dialog.open();
    }

    dismiss() {
        this.refs.dialog.close();
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
            justifyContent: 'center',
            alignItems: 'center'
        };
        const buttonStyle = {
            width:'50%',
            height:'100%',
            justifyContent: 'center',
            alignItems: 'center'
        };
        const buttonTitleStyle = {
            fontSize: 16,
            color: LVColor.text.grey1
        };
        const confirmButtonTitleStyle = {
            fontSize: 16,
            color: LVColor.text.yellow,
        };
        const lineWidth = StyleSheet.hairlineWidth;
        const lineColor = "#F5F6FA";

        const { confirmTitle, cancelTitle } = this.props;
        const childrenHeight = this.props.children ? ( this.props.children.props.height || 64) : 0;
        const modalWidth = { width: this.props.width || '90%' };
        const modalHeight = {
            height: this.props.height || 120 + childrenHeight
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
                    <View style={styles.confirmDialogTopPanel}>
                        {this.props.title && (
                            <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
                        )}
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>{this.props.children}</View>
                    </View>
                    
                    <View style={styles.confirmDialogBottomPanel} onPress={this.props.onPressContent}>
                        <View style={{ flex : 1}}>
                            <View style={buttonPanelStyle}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={buttonStyle}
                                    onPress={this.onPressCancel.bind(this)}>
                                    <Text style={[buttonTitleStyle, this.props.cancelTitleStyle]}>{cancelTitle}</Text>
                                </TouchableOpacity>
                                <View style={{ width: 2, height: 20, backgroundColor: lineColor }} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={buttonStyle}
                                    onPress={this.onPressConfirm.bind(this)}>
                                    <Text style={[confirmButtonTitleStyle, this.props.confirmTitleStyle]}>{confirmTitle}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
        borderRadius: 5
    },
    title: {
        color: LVColor.text.grey2,
        fontSize: 15,
        marginBottom: 15
    },
    message: {
        paddingLeft: 25,
        paddingRight: 25,
        color: '#697585',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 20
    },
    dialog: {
        flex: 1,
        width: '100%',
        flexDirection: 'column'
    },
    dialogTopPanel: {
        flex:0.7,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmDialogTopPanel: {
        flex:0.7,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialogContent: {
        flex: 0.3,
        width: '100%',
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmDialogBottomPanel: {
        flex: 0.3,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
