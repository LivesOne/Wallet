/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ViewPropTypes, Keyboard } from 'react-native';
import { Base, DefaultStyles, LightStyles, WhiteStyles } from './styles';

import LVColor from '../../styles/LVColor';
import PropTypes from 'prop-types';

class MXCrossTextInput extends Component {
    state: {
        text: ?string,
        hasFocus: boolean
    };

    constructor(props: any) {
        super(props);
        this.state = {
            text: props.defaultValue,
            hasFocus: false
        };
        this.onChangeText = this.onChangeText.bind(this);
    }

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

    onPressClear() {
        this.setState({
            text: '',
            hasFocus: true
        });
        this.props.onTextChanged && this.props.onTextChanged('');
    }

    render() {
        const { rounded, style, placeholder, secureTextEntry, withUnderLine, keyboardType } = this.props;

        const theme = this.getTheme();

        const lineHeight = withUnderLine ? StyleSheet.hairlineWidth : 0;

        return (
            <View
                style={[
                    Base.main,
                    style,
                    theme.main,
                    rounded ? Base.rounded : null,
                    !withUnderLine ? { borderBottomColor: 'transparent' } : null
                ]}
            >
                <View style={[Base.content]}>
                    <TouchableOpacity style={[Base.textArea]} activeOpacity={1} onPress={() => this.refs.textinput.focus() } >
                        <TextInput
                            ref={'textinput'}
                            placeholder={placeholder}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={LVColor.text.placeHolder}
                            defaultValue={this.props.defaultValue}
                            value={this.state.text}
                            selectTextOnFocus={this.props.setFocusWhenMounted}
                            tintColor={LVColor.primary}
                            keyboardType={keyboardType}
                            style={[Base.label, theme.label]}
                            secureTextEntry={secureTextEntry}
                            onChangeText={this.onChangeText.bind(this)}
                            onFocus={() => this.setState({ hasFocus: true })}
                            onEndEditing={() => this.setState({ hasFocus: false })}
                        />
                    </TouchableOpacity>

                    <View style={[Base.buttonArea]}>
                        {this.props.withClearButton &&
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
