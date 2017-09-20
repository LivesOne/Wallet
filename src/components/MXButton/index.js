/**
 * @flow
 */
'use strict'

import React, { Component, PropTypes } from 'react'
import { Base, ActiveStyles, LightStyles, InActiveStyles, NormalStyles } from './styles'
import { TouchableOpacity, View, ViewPropTypes, Image, Text } from 'react-native'

class MXButton extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    titleFont: PropTypes.number,
    icon: PropTypes.node,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    themeStyle: PropTypes.string,
    style: View.propTypes.style,
    onPress: PropTypes.func,
  };

  getTheme() {
    switch (this.props.themeStyle) {
      case "normal":
        return NormalStyles;
      case "light":
        return LightStyles;
      case "active":
        return ActiveStyles;
      case "inactive":
        return InActiveStyles;
    }
    return ActiveStyles;
  }

  render() {

    const theme = this.getTheme();
    const {title, icon, rounded, style, titleFont, onPress, disabled, } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled = {disabled}
        style={[
          Base.main,
          theme.main,
          rounded ? Base.rounded : null,
          style]}
        onPress={onPress}
      >
        <View style={Base.inner}>
          {icon ? <Image source={icon.source} style={[Base.icon, theme.icon]} {...icon.props}/> : null}
          <Text style={[
            Base.label,
            theme.label,
            icon ? {marginLeft: 5} : null,
            titleFont ? {fontSize: titleFont} : null,
          ]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default MXButton;
