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

export class TransferMinerTipsSetter extends Component {

    state: {
        value: number,
    }

    constructor() {
        super();
        this.state = {
            value: 0,
        }
    }

    onValueChange(value: number) {
        this.setState({
            value: value,
        });
    }

    calculateValue() {
        return (this.state.value * 1).toFixed(2) + ' ETH';
    }

    
    render() {
        return (
        <View style={[styles.container, this.props.style]} >
            <View style={styles.topContainer}>
                <Text style={styles.title}>{ LVStrings.transfer_miner_tips }</Text>
                <View style={styles.tipsContainner}>
                    <Text style={styles.tipsIndicator}>{ this.calculateValue() }</Text>
                </View>
            </View>
            <View style={styles.sliderContainer}>
                <Text style={styles.text}>{ LVStrings.transfer_slow }</Text>
                <View  style= {styles.sliderWrapper}>
                    <Slider
                        value={this.state.value}
                        //minimumValue={0.2}
                        //maximumValue={1}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor={LVColor.primary}
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
    topContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom:5,
    },
    title: {
        fontSize: 16,
        color: LVColor.text.editTextContent,
        marginBottom:5,
    },
    tipsContainner: {
        height: 35,
        width: 110,
        borderColor:LVColor.primary, 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1, 
        borderRadius: 2, 
    },
    tipsIndicator: {
        color: LVColor.primary,
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
        color: LVColor.text.grey3,
    },
    track: {
        height: 4,
        borderRadius: 2,
        backgroundColor: LVColor.separateLine,
      },
      thumb: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'white',
        borderColor: '#f9903e',
        borderWidth: 9,
      }
  });

export default TransferMinerTipsSetter