/**
 * @flow
 */
'use strict';

import React, { Component } from 'react'
import { Base, ActiveStyles, InActiveStyles, NormalStyles ,ActiveEmptyStyles ,NormalEmptyStyles} from './styles'
import { TouchableHighlight, View, ViewPropTypes, Image, Text } from 'react-native'
import LVColor from '../../styles/LVColor'
import PropTypes from 'prop-types';

type State = {
    pressStatus: boolean
};

type Props = {
    title: string,
    rounded: boolean,
	disabled?: boolean,
	isEmptyButtonType?:boolean,
    style: ViewPropTypes.style,
    onPress: Function
};

class MXButton extends Component<Props,State> {
	static defaultProps = {
    disabled: false, // ...but we have a default prop for foo.
    isEmptyButtonType: false,
	};

	constructor(props: any) {
    super(props);
    this.state = { 
      pressStatus: false,
      isEmptyButtonType: false
	};
  }

  getTheme(disabled:?boolean) {
    if (disabled) {
      return InActiveStyles;
    } else {
		  console.log(this.props.isEmptyButtonType);
		  console.log(this.props.isEmptyButtonType);
     	 return this.state.pressStatus ? (this.props.isEmptyButtonType? ActiveEmptyStyles: ActiveStyles) : (this.props.isEmptyButtonType? NormalEmptyStyles: NormalStyles);
    }
  }

  render() {
    const {title, rounded, style, onPress, disabled} = this.props;
    const theme = this.getTheme(disabled);

    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled = {disabled}
        underlayColor={this.props.isEmptyButtonType?LVColor.button.buttoneEmptyActive :LVColor.button.buttonActive}
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
