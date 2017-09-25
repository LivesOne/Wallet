//@flow
'use strict'

import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native';
import * as MXUtils from "../../utils/MXUtils";

const SPRING_CONFIG = {tension: 2, friction: 5};
const SLIDE_VIEW_WIDTH = 20;

export class MXSlideView extends Component {

    state: {
        pan: any
    }
    constructor(props: any) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY()
        };
    }

    getStyle() {
        return [
                styles.square, 
                {
                    transform: this.state.pan.getTranslateTransform()
                }
          ];
    }

    offset(offset: number) {
        Animated.spring(this.state.pan, {
            ...SPRING_CONFIG,
            toValue: {x: offset, y: 0}                       
      }).start();
    }

    render() {
        return (
            <View style = {[this.props.style, {marginLeft: MXUtils.getDeviceWidth() / 4 - SLIDE_VIEW_WIDTH /2}]}>
                <Animated.View style={this.getStyle()} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    square: {
      width: SLIDE_VIEW_WIDTH,
      height: 2,
      backgroundColor: 'grey'
    } 
  });

export default MXSlideView;