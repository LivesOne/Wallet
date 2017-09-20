/**
 * @flow
 */
'use strict'

import React, { Component, PropTypes } from 'react'
import { Base, ActiveStyles, InActiveStyles, NormalStyles } from './styles'
import { TouchableHighlight, View, ViewPropTypes, Image, Text } from 'react-native'

class MXButton extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    style: View.propTypes.style,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { 
      pressStatus: false,
    };
  }

  getTheme(disabled: boolean) {
    if (disabled) {
      return InActiveStyles;
    } else {
      return this.state.pressStatus ? ActiveStyles : NormalStyles;
    }
  }

  render() {
    const {title, rounded, style, onPress, disabled,} = this.props;
    const theme = this.getTheme(disabled);

    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled = {disabled}
        onPressOut={() => {this.setState({ pressStatus: false })}}
        onPressIn={() => {this.setState({ pressStatus: true })}}
        style={[
          Base.main,
          theme.main,
          rounded ? Base.rounded : null,
          style]}
        onPress={onPress}
      >
        <View style={Base.inner}>
          <Text style={[
            Base.label,
            theme.label,
          ]}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default MXButton;
