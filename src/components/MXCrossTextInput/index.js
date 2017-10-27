/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ViewPropTypes, Keyboard, Platform } from 'react-native';
import { Base, DefaultStyles, LightStyles, WhiteStyles, TextAlignCenterStyles } from './styles';

import LVColor from '../../styles/LVColor';
import PropTypes from 'prop-types';

class MXCrossTextInput extends Component {
    state: {
        text: ?string,
        defaultValue: string,
        hasFocus: boolean,
    };

    constructor(props: any) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue,
            text: props.value || props.defaultValue,
            hasFocus: false,
        };
        this.onChangeText = this.onChangeText.bind(this);
    }

    firstMounted = true;

    static propTypes = {
        placeholder: PropTypes.string,
        rounded: PropTypes.bool,
        themeStyle: PropTypes.string,
        style: ViewPropTypes.style,
        defaultValue: PropTypes.string,
        secureTextEntry: PropTypes.bool,
        onTextChanged: PropTypes.func,
        withUnderLine: PropTypes.bool,
        KeyboardType: PropTypes.string,
        withClearButton: PropTypes.bool,
        rightComponent: PropTypes.element,
        setFocusWhenMounted: PropTypes.bool,
        textAlignCenter: PropTypes.bool,
        value: PropTypes.string,
        boarderLineHeight: PropTypes.number,
    };

    static defaultProps = {
        withUnderLine: true,
        withClearButton: true
    };

    getTheme() {
        switch (this.props.themeStyle) {
            case 'lightTheme':
                return LightStyles;
            case 'whiteStyles':
                return WhiteStyles;
            default:
                return DefaultStyles;
        }
    }

    setText(newText: string) {
        this.setState({text: newText, hasFocus: true});
        this.props.onTextChanged && this.props.onTextChanged(newText);
    }

    onChangeText = function(newText: string) {
        this.setState({
            text: newText
        });
        this.props.onTextChanged && this.props.onTextChanged(newText);
    };

    componentDidMount() {
        if (this.props.setFocusWhenMounted) {
            this.refs.textinput.focus();
        }
    }

    componentDidUpdate() {
        this.firstMounted = false;
    }

    onPressClear() {
        this.setText('')
    }

    render() {
        const { rounded, style, placeholder, secureTextEntry, withUnderLine, keyboardType, textAlignCenter, boarderLineHeight } = this.props;

        const theme = this.getTheme();

        const lineHeight = withUnderLine ? (boarderLineHeight ? boarderLineHeight : StyleSheet.hairlineWidth) : 0;

        const textAreaStyle = textAlignCenter ? TextAlignCenterStyles.textArea : Base.textArea;
        const buttonAreaStyle = textAlignCenter ? TextAlignCenterStyles.buttonArea : Base.buttonArea;

        return (
            <View
                style={[
                    Base.main,
                    theme.main,
                    rounded ? Base.rounded : null,
                    !withUnderLine ? { borderBottomColor: 'transparent' } : null,
                    style,
                ]}
            >
                <View style={[Base.content]}>
                    <TouchableOpacity style={[textAreaStyle]} activeOpacity={1} onPress={
                        () => {
                            this.setState({hasFocus: true})
                            this.refs.textinput.focus()
                        }
                         } >
                        <TextInput
                            ref={'textinput'}
                            placeholder={placeholder}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={LVColor.text.placeHolder}
                            value={this.state.text}
                            selectTextOnFocus={this.firstMounted && this.props.setFocusWhenMounted}
                            tintColor={LVColor.primary}
                            keyboardType={keyboardType}
                            style={[Base.label, theme.label]}
                            secureTextEntry={secureTextEntry}
                            clearButtonMode={this.props.withClearButton ? 'while-editing' : 'never'}
                            onChangeText={this.onChangeText.bind(this)}
                            onFocus={() => this.setState({ hasFocus: true })}
                            onEndEditing={() => this.setState({ hasFocus: false })}
                        />
                    </TouchableOpacity>

                    <View style={[buttonAreaStyle]}>
                        { (Platform.OS === 'android') && 
                            this.props.withClearButton &&
                            this.state.text !== null &&
                            this.state.text !== '' && 
                            this.state.text !== undefined &&
                            this.state.hasFocus && (
                                <TouchableOpacity style={Base.clearButton} onPress={this.onPressClear.bind(this)}>
                                    <Image source={require('../../assets/images/edit_clear.png')} />
                                </TouchableOpacity>
                            )}

                        {this.props.rightComponent && (
                            <View style={[Base.rightComponent]}>{this.props.rightComponent}</View>
                        )}
                    </View>
                </View>
                <View style={{width: '100%', height: lineHeight, backgroundColor: LVColor.separateLine}} />
            </View>
        );
    }
}

export default MXCrossTextInput;
