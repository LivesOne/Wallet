// @flow
'use strict'

import React, { Component } from 'react'
import { Text, View, Keyboard, TouchableOpacity } from 'react-native';

export class LVKeyboardDismissView extends Component {

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