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
    errorText: ?string,
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
    onValidation?: Function
};
class MXCrossTextInput extends Component<Props,State> {
    constructor(props: any) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue,
            text: props.value || props.defaultValue,
            hasFocus: false,
            errorText: null
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.onValidation = this.onValidation.bind(this);
        this.validate = this.validate.bind(this);
        this.setErrorText = this.setErrorText.bind(this);
        this.suppressValidator = this.suppressValidator.bind(this);
        this.enableValidator = this.enableValidator.bind(this);
    }

    firstMounted = true;
    _isValid: boolean = true;
    _validatorEnabled: boolean = true;
    setErrorText: Function;
    suppressValidator: Function;
    enableValidator: Function;
    validate: Function;

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

    isValid() {
        return this._isValid;
    }

    setText(newText: string) {
        this.setState({text: newText, hasFocus: true});
        this.props.onTextChanged && this.props.onTextChanged(newText);
    }
    
    setErrorText(newText: string) {
        this.setState({
            errorText: newText
        });
        this._isValid = newText === null;
    }

    onChangeText = function(newText: string) {
        if (Platform.OS === 'android') {
            this.setState({text: newText});
        } else if (Platform.OS === 'ios' && newText === '') {
            this.setState({text: newText});
        }
        this.props.onTextChanged && this.props.onTextChanged(newText);
    };

    validate(): boolean {
        if(!this._validatorEnabled) {
            return true;
        }

        if(this.props.onValidation) {
            const errorText = this.props.onValidation(this.state.text);
            this.setState({
                errorText: errorText
            });
            this._isValid = errorText === null;
        }
        return this._isValid;
    }

    onValidation = function() {
        this.validate();
    }

    suppressValidator() {
        this._validatorEnabled = false;
    }

    enableValidator() {
        this._validatorEnabled = true;
    }

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
                    style,
                ]}
            >  
                <View style={[Base.content]}>
                    <View style={Base.titleAndInputContainer}>
                        {this.props.titleText && (
                            <Text style = {Base.titleLabel}>
                                {titleText}
                            </Text>
                        )}
                        <View style = {[Base.defaultTextAreaStyle, inputContainerStyle]}>
                            <View style={{flex:1,flexDirection:'row', justifyContent:'space-between'}}>
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
                                    style={[Base.label, theme.label , {padding : 0,flex:1}]}
                                    secureTextEntry={secureTextEntry}
                                    clearButtonMode={this.props.withClearButton ? 'while-editing' : 'never'}
                                    onChangeText={this.onChangeText.bind(this)}
                                    onSubmitEditing= {()=>{
                                        onSubmitEditing && onSubmitEditing();
                                    }}
                                    onBlur={()=> this.onValidation()}
                                    onFocus={() => this.setState({ hasFocus: true })}
                                    onEndEditing={() => this.setState({ hasFocus: false })}
                                />
                                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
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
                        <View style={{height:13}}>
                            {this.state.errorText && (<Text style={Base.errorLabel}>{this.state.errorText}</Text>)}
                        </View>
                    </View>
                    {withUnderLine && (
                        <View style={[Base.bottomStyle, {height:lineHeight}]}>
                            <View style={{flex: 1, backgroundColor: LVColor.separateLine}} />
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

export default MXCrossTextInput;
