//@flow
'use strict'

import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native';
import * as MXUtils from "../../utils/MXUtils";
import PropTypes from 'prop-types';

const SPRING_CONFIG = { friction : 7,  tension  : 100};
const SLIDE_VIEW_WIDTH = 20;

export class SlideIndicatior extends Component {

    state: {
        pan: any
    }
    static propTypes = {
        initOffset: PropTypes.number,
    };

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
            toValue: {x: offset + this.props.initOffset , y: 0}                       
      }).start();
    }

    render() {
        return (
            <View style = {[this.props.style, {marginLeft:0}]}>
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

export default SlideIndicatior;