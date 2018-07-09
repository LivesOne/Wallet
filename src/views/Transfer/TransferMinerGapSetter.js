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
    style: ViewPropTypes.style
};

type State = {
    value: number,
    userHasChanged: boolean
};

export class TransferMinerGapSetter extends Component<Props, State> {
    static propTypes = {
        enable: PropTypes.bool,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        defaultValue: PropTypes.number,
    }; 

    _beginEnable: false;

    constructor(props: any) {
        super(props);
        this.state = {
            value: this.getInitValue(), 
            userHasChanged: false
        }
        TransferUtils.log('default value = ' + this.getInitValue());
    }

    getInitValue() {
        if (this.props.defaultValue < this.props.minimumValue) {
            return this.props.minimumValue;
        } else if (this.props.defaultValue > this.props.maximumValue) {
            return this.props.maximumValue;
        } else {
            return this.props.defaultValue;
        }
    }

    calculateValue() {
        if (this.props.enable) {
            return TransferUtils.convertMinnerGap(this.getValue()) + ' ETH';
            // return this.getValue() + ' ETH';
        } else {
            return '-- ETH'
        }
    }

    getValue() {
        return this.state.userHasChanged ? this.state.value : this.props.defaultValue;
    }

    getUserHasChanged() {
        return this.state.userHasChanged;
    }

    onValueChange(value: number) {

        this.setState({
            value: value,
            userHasChanged : true
        });
    }

    componentWillReceiveProps(nextProps: any) {
        if (this.props.enable === false && nextProps.enable === true) {
            setTimeout(() => {
                this.setState({
                    value: this.getInitValue(),
                    userHasChanged: false
                });
                TransferUtils.log("激活 min = " + this.props.minimumValue + " max = " + this.props.maximumValue
                + " default = " + this.props.defaultValue 
                + " value = " + this.getValue() + " userHasSet = " + this.getUserHasChanged());
            }, 100);
           
        }

        if (this.props.enable && nextProps.enable) {
            if (this.props.defaultValue != nextProps.defaultValue) {
                setTimeout(() => {
                    this.setState({
                        value: this.getInitValue(),
                        userHasChanged: false
                    });
                    TransferUtils.log("重新赋值 min = " + this.props.minimumValue + " max = " + this.props.maximumValue
                + " default = " + this.props.defaultValue 
                + " value = " + this.getValue()+ " userHasSet = " + this.getUserHasChanged());
                }, 100);
            }
        }

        
        if (this.props.enable && !nextProps) {
            setTimeout(() => {
                this.setState({value : 0, userHasChanged: false})
                TransferUtils.log("禁止 min = " + this.props.minimumValue + " max = " + this.props.maximumValue
            + " default = " + this.props.defaultValue 
            + " value = " + this.getValue()+ " userHasSet = " + this.getUserHasChanged());
            }, 100);
            
        }
    }

    componentDidUpdate(prevProps : any, prevState: any) {
        this._beginEnable = !prevProps.enable;
    }

    isBadAndroidDevices() {
        if (Platform.OS === 'android') {
            const al = DeviceInfo.getAPILevel();
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
        width: 135,
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