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
import TransferUtils from './TransferUtils';

export class TransferMinerGapSetter extends Component {

    state: {
        value: number,
    }

    static propTypes = {
        enable: PropTypes.bool,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        onGapChanged: PropTypes.func,
    }; 

    _beginEnable: false;

    constructor(props: any) {
        super(props);
        this.state = {
            value: props.minimumValue,
        }
        TransferUtils.log('default value = ' + props.minimumValue);
    }

    calculateValue() {
        if (this.props.enable) {
            let value = this._beginEnable ? this.props.minimumValue : this.state.value;
            return (value * 1).toFixed(8) + ' ETH';
        } else {
            return '-- ETH'
        }
    }

    getValue() {
        return this.state.value;
    }

    onValueChange(value: number) {
        if (this.props.onGapChanged) {
            this.props.onGapChanged(value);
        }
        this.setState({
            value: value,
        });
    }

    componentWillReceiveProps(nextProps: any) {
        if (this.props.enable !== nextProps.enable) {
            this.setState({
                value: nextProps.enable ? (nextProps.maximumValue - nextProps.minimumValue) / 100 : 0,
            })
            this._beginEnable = nextProps.enable;
        }
    }

    componentDidUpdate(prevProps : any, prevState: any) {
        this._beginEnable = !prevProps.enable;
        //TransferUtils.log('componentDidUpdate _beginEnable = ' + this._beginEnable);
    }

    render() {
        const {maximumValue, minimumValue} = this.props;
        return (
        <View style={[styles.container, this.props.style]} >
            <View style={styles.topContainer}>
                <Text style={styles.title}>{ LVStrings.transfer_miner_tips }</Text>
                <View style={[styles.tipsContainner, {borderColor:this.props.enable ? LVColor.primary: '#DDDDDD'}]}>
                    <Text style={[styles.tipsIndicator, {color: this.props.enable ?LVColor.primary : '#DDDDDD'}]}>{ this.calculateValue() }</Text>
                </View>
            </View>
            <View style={styles.sliderContainer}>
                <Text style={styles.text}>{ LVStrings.transfer_slow }</Text>
                <View  style= {styles.sliderWrapper}>
                    <Slider
                        disabled={!this.props.enable}
                        value={this.state.value}
                        minimumValue={this.props.enable ? minimumValue : 0}
                        maximumValue={this.props.enable ? maximumValue : 100}
                        onValueChange={this.onValueChange.bind(this)}
                        trackStyle={styles.track}
                        thumbStyle={[styles.thumb, {borderColor: this.props.enable ? '#f9903e' : '#DDDDDD',}]}
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
        width: 130,
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
        borderWidth: 9,
      }
  });

export default TransferMinerGapSetter