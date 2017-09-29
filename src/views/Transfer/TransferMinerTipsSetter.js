//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import Slider from "react-native-slider";

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import * as MXUtils from '../../utils/MXUtils'
import { SlideIndicatior } from './SliderIndicator';

const IconIndicator = require('../../assets/images/slider_background.png');

export class TransferMinerTipsSetter extends Component {

    state: {
        value: number,
        sliderWidth: number,
        sliderOffset: number,
    }

    constructor() {
        super();
        this.state = {
            value: 0,
            sliderWidth: 0,
        }
    }

    onValueChange(value: number) {
        let newOffset = value < 0.5 ? 20 * value : -20 * value;
        this.setState({
            value: value,
            sliderOffset: newOffset
        });
        this.refs.slide.offset(this.calculatePos());
    }

    calculatePos() {
        return this.state.value * (this.state.sliderWidth - 20);
    }

    onLayout = (event: any) => {
        let layoutParms = event.nativeEvent.layout;
        this.setState({
            sliderWidth: layoutParms.width
        })
    }

    
    render() {
        return (
        <View style={[styles.container, this.props.style]} >
            <Text style={styles.title}>{ LVStrings.transfer_miner_tips }</Text>
            <View style={styles.sliderContainer}>
                <Text style={styles.text}>{ LVStrings.transfer_slow }</Text>
                <View  style= {styles.sliderWrapper} onLayout = {this.onLayout}>
                    <SlideIndicatior ref='slide' initOffset={0}></SlideIndicatior>
                    <Slider
                        value={this.state.value}
                        onValueChange={this.onValueChange.bind(this)}
                    />
                </View>
                
                <Text style={styles.text}>{ LVStrings.transfer_fast }</Text>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontSize: 16,
        color: LVColor.text.editTextContent,
        marginTop: 10,
        marginBottom:5,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    sliderWrapper: {
        width: '75%',
    },
    text: {
        fontSize: 16,
        color: LVColor.text.grey1,
    }
  });

export default TransferMinerTipsSetter