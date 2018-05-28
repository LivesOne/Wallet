// @flow
'use strict'

import * as React from 'react';
import { Text, View, ViewPropTypes, Keyboard, TouchableOpacity } from 'react-native';

type Props = { 
    style?: ViewPropTypes.style,
    children?: React.ChildrenArray<React.Element<any>>
 };

export class LVKeyboardDismissView extends React.Component<Props> {

    render() {
        return (
            <TouchableOpacity 
                activeOpacity = {1}
                style={[{flex: 1}, this.props.style]} onPress={()=>{Keyboard.dismiss()}} {...this.props}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
}

export default LVKeyboardDismissView