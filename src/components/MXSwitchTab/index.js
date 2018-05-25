//@flow

'use strict'

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ViewPropTypes } from 'react-native';
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'
import PropTypes from 'prop-types';
import { MXSlideView } from './SlideView';


type Props = {
    leftText: string,
    rightText: string,
    onTabSwitched: Function,
    style: ViewPropTypes.style,
    textStyle: ViewPropTypes.style
}

type State = {
    leftPressed: boolean,
    scrollToLeftPos: number,
    scrollToRightPos: number,
}

export class MXSwitchTab extends Component<Props,State> {
    state = {
        leftPressed: true,
        scrollToLeftPos: 0,
        scrollToRightPos:0,
    }
    
    _onLeftPressed = () => {
        this.setState({leftPressed: true});
        this.refs.slide.offset(this.state.scrollToLeftPos);
        this.props.onTabSwitched && this.props.onTabSwitched(true)
    }

    _onRightPressed = () => {
        this.setState({leftPressed: false});
        this.refs.slide.offset(this.state.scrollToRightPos);
        this.props.onTabSwitched && this.props.onTabSwitched(false)
    }

    componentDidMount = () => {
    }
    
    _calculateLeftCenterX = (event) => {
        let layoutParms = event.nativeEvent.layout;
        let scrollToLeftPos = 0;
        let scrollToRightPos = layoutParms.x + layoutParms.width;
        this.setState({
            scrollToLeftPos: Math.trunc(scrollToLeftPos),
            scrollToRightPos: Math.trunc(scrollToRightPos)
        })
    }

    render() {
    return (
        <View style={ styles.out }>
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.tab, {backgroundColor: 'white'}]}
                    onPress={ this._onLeftPressed.bind(this) }
                    onLayout = {this._calculateLeftCenterX}
                    activeOpacity={0.2}
                    >
                    <Text style={[this.state.leftPressed ? styles.pressedText : styles.normalText, this.props.textStyle]}>
                        { this.props.leftText }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, {backgroundColor: 'white'}]}
                    onPress={ this._onRightPressed.bind(this) }
                    activeOpacity={0.2}
                    >
                    <Text style={[this.state.leftPressed ? styles.normalText : styles.pressedText, this.props.textStyle]}>
                    { this.props.rightText }
                    </Text>
                </TouchableOpacity>
            </View>
            <MXSlideView 
                style={{flex: 1, top: -15}}
                ref={ "slide" }/>
        </View>
    )
    }
}

const styles = LVStyleSheet.create({
    out: {
        height: 70, 
        width: '100%',
    },
    container: {
        flex: 1000,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        height: 70,
    },
    tab: {
      flex: 1,
      flexDirection: 'column',
      alignItems: "center",
      justifyContent: "center",
    },
    underLine: {
        backgroundColor: 'black',
        marginTop: 5,
        height: 1.5,
        width: 10,
    },
    normalText: {
        fontSize: 15,
        color: "#bec4d0"
    },

    pressedText: {
        fontSize: 14,
        color: "#FFAE1F"
    }
  });

export default MXSwitchTab