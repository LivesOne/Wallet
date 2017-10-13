/**
 * @flow
 */
'use strict'

import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, Image, ViewPropTypes, Keyboard } from 'react-native';
import { Base, DefaultStyles, LightStyles, WhiteStyles } from './styles';

import LVColor from '../../styles/LVColor'
import PropTypes from 'prop-types';


class MXCrossTextInput extends Component {

  state: {
    text: ?string,
    hasFocus: boolean,
  }

  constructor(props: any) {
    super(props);
    this.state = {
      text: null,
      hasFocus: false,
    };
    this.onChangeText = this.onChangeText.bind(this);
  }

  static propTypes = {
    placeholder: PropTypes.string,
    rounded: PropTypes.bool,
    themeStyle: PropTypes.string,
    style: ViewPropTypes.style,
    secureTextEntry: PropTypes.bool,
    onTextChanged: PropTypes.func,
    withUnderLine: PropTypes.bool,
    KeyboardType: PropTypes.string,
    withClearButton: PropTypes.bool
  };

  static defaultProps = {
    withUnderLine: true,
    withClearButton: true
 };

  getTheme() {
    switch (this.props.themeStyle) {
      case "lightTheme":
        return LightStyles;
      case "whiteStyles":
        return WhiteStyles;
      default:
        return DefaultStyles;
    }
  }



  onChangeText = function(newText: string) {
    this.setState({
      text:newText,
      hasFocus: true
    });
    this.props.onTextChanged && this.props.onTextChanged(newText);
  }

  render() {

    const { rounded, style,
       placeholder, secureTextEntry, withUnderLine, keyboardType } = this.props;

    const theme = this.getTheme();

    return (
    <View style={
      [Base.main,
        style,
        theme.main,
        rounded ? Base.rounded : null,
        !withUnderLine ? {borderBottomColor: 'transparent'} : null,
        ]
    }>
      <TextInput
        placeholder = {placeholder}
        underlineColorAndroid = {'transparent'}
        placeholderTextColor = { LVColor.text.placeHolder }
        defaultValue={ this.props.defaultValue}
        value={this.state.text}
        tintColor={LVColor.primary}
        keyboardType = { keyboardType }
        style={[
          Base.label,
          theme.label,
          ]}
        secureTextEntry={secureTextEntry}
        onChangeText = {this.onChangeText}
        onFocus={() => this.setState({hasFocus : true})}
        onEndEditing={() => this.setState({hasFocus : false})}
      />

      {this.props.withClearButton && this.state.text !== "" && this.state.hasFocus && <TouchableOpacity
        style={Base.clearButton}
        onPress={() => {
          this.onChangeText("")
        }}
      >
        <Image
          source={require('../../assets/images/edit_clear.png')}
        />
    
      </TouchableOpacity>

      }
    </View>

    );
  }
}

export default MXCrossTextInput;
