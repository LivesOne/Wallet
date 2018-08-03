//@flow

'use strict'

import React, { Component } from 'react'
import { Text, View , ViewPropTypes } from 'react-native';
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor';
import PropTypes from 'prop-types';
import Switch from 'react-native-switch-pro';

type Props = {
    onSwitched?: Function,
    value? : Boolean,
    Style?:ViewPropTypes.style,
}

type State = {
    currentValue:boolean,
}
export class MXSwitch extends Component<Props,State> {

    static defaultProps = {
        value : false,
    }
    
    constructor(props: any) {
        super(props);
        this.state = {
            currentValue: props.value,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            currentValue : nextProps.value,
        });
    }

    onValueChange = (value:boolean)=>{
        this.setState({
            currentValue: value,
        })
        if (this.props.onSwitched) {
            this.props.onSwitched(value);
        }
    }
    
    value = ()=>{
        return this.state.currentValue;
    }

    render() {
    return (
        <Switch
            width = {44}
            height = {27}
            onSyncPress = {this.onValueChange.bind(this)}
            backgroundActive = {LVColor.text.yellow}
            value = {this.state.currentValue}
            backgroundInactive = {LVColor.text.placeHolder}
        >
        </Switch>
    )
    }
}

export default MXSwitch