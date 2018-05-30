//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, ViewPropTypes} from 'react-native';
import Slider from "react-native-slider";

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import * as MXUtils from '../../utils/MXUtils'
import TransferUtils from './TransferUtils';
var DeviceInfo = require('react-native-device-info');

type Props = {
    enable: bool,
    minimumValue: number,
    maximumValue: number,
    defaultValue: number,
    onGapChanged: Function,
    style: ViewPropTypes.style
};

type State = {
    value: number
};

export class TransferMinerGapSetter extends Component<Props, State> {
    static propTypes = {
        enable: PropTypes.bool,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        defaultValue: PropTypes.number,
        onGapChanged: PropTypes.func,
    }; 

    _beginEnable: false;

    constructor(props: any) {
        super(props);
        this.state = {
            value: props.defaultValue,
        }
        TransferUtils.log('default value = ' + props.defaultValue);
    }

    calculateValue() {
        if (this.props.enable) {
            return TransferUtils.convertMinnerGap(this.state.value) + ' ETH';
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
                value: nextProps.enable ? nextProps.defaultValue : 0,
            });
        }
        if (nextProps.enable && this.state.value !== nextProps.defaultValue) {
            this.setState({
                value: nextProps.defaultValue,
            });
        }
    }

    componentDidUpdate(prevProps : any, prevState: any) {
        this._beginEnable = !prevProps.enable;
    }

    isBadAndroidDevices() {
        if (Platform.OS === 'android') {
            const al = DeviceInfo.getAPILevel();
            TransferUtils.log('api level = ' + al);
            if (al === 19) {
                return true;
            }
        }
        return false;
    }

    render() {
        const {maximumValue, minimumValue} = this.props;
        return (
        <View style={[styles.container, this.props.style]} >
            <View style={styles.topContainer}>
                <Text style={[styles.title, {color: LVColor.text.grey2, fontWeight:'100',}]}>{ LVStrings.transfer_miner_tips }</Text>
                <View style={[styles.tipsContainner, {borderColor:this.props.enable ? LVColor.primary: '#DDDDDD'}]}>
                    <Text style={[styles.tipsIndicator, {color: true ? LVColor.white : '#DDDDDD'}]}>{ this.calculateValue() }</Text>
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
                        thumbStyle={[styles.thumb, {borderColor: this.props.enable ? '#f9903e' : '#DDDDDD', 
                        backgroundColor: this.isBadAndroidDevices() ? 'transparent' : 'white',}]}
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
    },
    title: {
        fontSize: 15,
        color: LVColor.white,
        marginBottom:5,
        fontWeight:'300',
    },
    tipsContainner: {
        height: 35,
        width: 130,
        backgroundColor: LVColor.text.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0, 
        borderRadius: 5, 
    },
    tipsIndicator: {
        color: LVColor.white,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom:20,
    },
    sliderWrapper: {
        width: '75%',
    },
    text: {
        fontSize: 14,
        color: LVColor.text.grey2,
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
        borderWidth: 9,
      }
  });

export default TransferMinerGapSetter