/**
 * @flow
 */
'use strict'

import React, { Component, PropTypes } from 'react'
import {View, TextInput, TouchableOpacity, Image,} from 'react-native'
import { Base, DefaultStyles, LightStyles, WhiteStyles } from './styles';

import PLColors from '../../assets/MXColors';


class MXTextInputWithClear extends Component {

  state: {
    text: ?string,
    hasFocus: boolean,
  }

  constructor(props: any) {
    super(props);
    this.state = {
      text: null,
      hasFocus: false
    };
    this.onChangeText = this.onChangeText.bind(this);
  }

  static propTypes = {
    placeHolder: PropTypes.string,
    rounded: PropTypes.bool,
    themeStyle: PropTypes.string,
    style: View.propTypes.style,
    secureTextEntry: PropTypes.bool,
    callbackParent: PropTypes.func.isRequired
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
    this.props.callbackParent(newText);
  }

  render() {

    const { rounded, style,
       placeholder, secureTextEntry} = this.props;

    const theme = this.getTheme();

    return (
    <View style={
      [Base.main,
        style,
        theme.main,
        rounded ? Base.rounded : null,
        ]
    }>
      <TextInput
        placeholder = {placeholder}
        underlineColorAndroid = {'transparent'}
        placeholderTextColor = { PLColors.PL_TEXT_BLACK_LIGHT }
        defaultValue={ this.props.defaultValue}
        value={this.state.text}
        keyboardType = {'ascii-capable'}
        style={[
          Base.label,
          theme.label,
          ]}
        secureTextEntry={secureTextEntry}
        onChangeText = {this.onChangeText}
        onFocus={() => this.setState({hasFocus : true})}
        onEndEditing={() => this.setState({hasFocus : false})}
      />

      {this.state.text !== "" && this.state.hasFocus && <TouchableOpacity
        style={Base.clearButton}
        activeOpacity={0.8}
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

export default MXTextInputWithClear;
