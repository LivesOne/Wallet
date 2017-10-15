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

export class TransferMinerGapSetter extends Component {

    state: {
        value: number,
    }

    static propTypes = {
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        onGapChanged: PropTypes.func,
    }; 

    constructor(props: any) {
        super(props);
        this.state = {
            value: props.minimumValue,
        }
    }

    calculateValue() {
        return (this.state.value * 1).toFixed(2) + ' ETH';
    }

    onValueChange(value: number) {
        if (this.props.onGapChanged) {
            this.props.onGapChanged(value);
        }
        this.setState({
            value: value,
        });
    }

    
    render() {
        const {maximumValue, minimumValue} = this.props;
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
                        minimumValue={minimumValue}
                        maximumValue={maximumValue}
                        onValueChange={this.onValueChange.bind(this)}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor={LVColor.primary}
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

export default TransferMinerGapSetter