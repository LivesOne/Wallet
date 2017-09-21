//@flow

'use strict'

import React, { Component, PropTypes } from 'react'
import { Text, View, TouchableOpacity, ViewPropTypes } from 'react-native';
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'

export class MXSwitchTab extends Component {


    state: {
        leftPressed: boolean
    }

    constructor() {
        super();
        this.state = {
            leftPressed: true,
        }
    }

    static propTypes = {
        leftText: PropTypes.string,
        rightText: PropTypes.string,
        onTabSwitched: PropTypes.func,
        style: View.propTypes.style,
        textStyle: View.propTypes.style
    }

    _onLeftPressed = () => {
        this.setState({leftPressed: true});
        this.props.onTabSwitched && this.props.onTabSwitched(true)
    }

    _onRightPressed = () => {
        this.setState({leftPressed: false});
        this.props.onTabSwitched && this.props.onTabSwitched(false)
    }

    render() {
    return (
        <View style={[styles.container, this.props.style]}>
            <TouchableOpacity
                style={[styles.tab, {backgroundColor: this.state.leftPressed ? LVColor.background.grey2 : 'white'}]}
                onPress={ this._onLeftPressed.bind(this) }
                activeOpacity={0.8}
                >
                <Text style={[this.state.leftPressed ? styles.pressedText : styles.normalText, this.props.textStyle]}>
                    { this.props.leftText }
                </Text>
                {this.state.leftPressed && <View style={styles.underLine}/>}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, {backgroundColor: this.state.leftPressed ? 'white' : LVColor.background.grey2}]}
                onPress={ this._onRightPressed.bind(this) }
                activeOpacity={this.state.leftPressed ? 1 : 0.8}
                >
                <Text style={[this.state.leftPressed ? styles.normalText : styles.pressedText, this.props.textStyle]}>
                { this.props.rightText }
                </Text>
                {!this.state.leftPressed && <View style={styles.underLine}/>}
            </TouchableOpacity>
        </View>
    )
    }
}

const styles = LVStyleSheet.create({
    container: {
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
        color: "#667383"
    },

    pressedText: {
        fontSize: 14,
        color: "#bec4d0"
    }
  });

export default MXSwitchTab