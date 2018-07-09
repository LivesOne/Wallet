/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ViewPropTypes, Keyboard, Platform ,Text} from 'react-native';
import { Base, DefaultStyles, LightStyles, WhiteStyles, TextAlignCenterStyles } from './styles';

import LVColor from '../../styles/LVColor';

type State = {
    text: ?string,
    defaultValue: string,
    hasFocus: boolean,
};

type Props = {
    placeholder?: string,
    rounded?: boolean,
    themeStyle?: string,
    style?: ViewPropTypes.style,
    defaultValue?: string,
    secureTextEntry?: boolean,
    onTextChanged?: Function,
    withUnderLine?: boolean,
    keyboardType?: string,
    onSubmitEditing?: Function,
    blurOnSubmit?:boolean,
    returnKeyType?:string,
    withClearButton?: boolean,
    rightComponent?: any,
    setFocusWhenMounted?: boolean,
    textAlignCenter?: boolean,
    value?: string,
    boarderLineHeight?: number,
    titleText?: string,
    inputContainerStyle ? : ViewPropTypes.style,
};
class MXCrossTextInput extends Component<Props,State> {

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

    focus(){
        this.refs.textinput.focus();
    }

    setText(newText: string) {
        this.setState({text: newText, hasFocus: true});
        this.props.onTextChanged && this.props.onTextChanged(newText);
    }

    onChangeText = function(newText: string) {
        if (Platform.OS === 'android') {
            this.setState({text: newText});
        } else if (Platform.OS === 'ios' && newText === '') {
            this.setState({text: newText});
        }
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

    clearFocus() {
        this.refs.textinput.blur();
    }

    onPressClear() {
        this.setText('');
    }

    render() {
        const { rounded, style, placeholder, secureTextEntry, withUnderLine, keyboardType, textAlignCenter, boarderLineHeight,titleText,inputContainerStyle,returnKeyType,blurOnSubmit,onSubmitEditing } = this.props;

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
                    {this.props.titleText && (
                        <Text style = {Base.titleLabel}>
                            {titleText}
                        </Text>
                    )}
                    <View style = {[Base.textInputView , inputContainerStyle]}>
                    <TouchableOpacity style={[textAreaStyle,this.props.titleText && {marginTop:10},]} activeOpacity={1} onPress={
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
                            blurOnSubmit={blurOnSubmit}
                            returnKeyType={returnKeyType}
                            style={[Base.label, theme.label , {padding : 0}]}
                            secureTextEntry={secureTextEntry}
                            clearButtonMode={this.props.withClearButton ? 'while-editing' : 'never'}
                            onChangeText={this.onChangeText.bind(this)}
                            onSubmitEditing= {()=>{
                                onSubmitEditing && onSubmitEditing();
                            }}
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
                </View>
                <View style={{width: '100%', height: lineHeight, backgroundColor: LVColor.separateLine,position: 'absolute',bottom: 1}} />
            </View>
        );
    }
}

export default MXCrossTextInput;
