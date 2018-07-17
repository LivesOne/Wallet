//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, ViewPropTypes,TouchableOpacity,Image} from 'react-native';
import Slider from "react-native-slider";

import PropTypes from 'prop-types';
import LVColor from '../../styles/LVColor'
import LVSize from '../../styles/LVFontSize';
import LVStrings from '../../assets/localization';
import * as MXUtils from '../../utils/MXUtils'
import TransferUtils from './TransferUtils';
import MXSwitch from '../../components/MXSwitch/index'
import MXCrossTextInput from '../../components/MXCrossTextInput';


var DeviceInfo = require('react-native-device-info');

const FeeImage = require('../../assets/images/transfer_fee_tip.png');

type Props = {
    enable: bool,
    minimumValue: number,
    maximumValue: number,
    defaultValue: number,
    curETH: string,
    style: ViewPropTypes.style,
    minerTipsCallBack?:Function,
};

type State = {
    value: number,
    userHasChanged: boolean,
    advancedSwitchedValue:boolean,
    gasValue:string,
    gasPriceValue:string,
    gasDataValue:string,
    isShowFeeFailMessage:bool,
};

export class TransferMinerGapSetter extends Component<Props, State> {
    _beginEnable: false;
    constructor(props: any) {
        super(props);
        this.state = {
            value: this.getInitValue(), 
            userHasChanged: false,
            advancedSwitchedValue: false,
            gasValue:'',
            gasPriceValue:'',
            gasDataValue:'',
            isShowFeeFailMessage:false
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

    gasValue = ()=>{
        return this.state.gasValue;
    }

    gasPriceValue = ()=>{
        return this.state.gasPriceValue;
    }

    gasDataValue = ()=>{
        return this.state.gasDataValue;
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
        return this.state.userHasChanged.toString();
    }

    onValueChange(value: number) {
       var flag = false;
        if (value < this.props.defaultValue) {
            flag = true;
        }

        this.setState({
            value: value,
            userHasChanged : true,
            isShowFeeFailMessage:flag,
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

    clickFeeTip = () => {
        if (this.props.minerTipsCallBack) {
            this.props.minerTipsCallBack();
        }
    }

    onAdvancedSwitched = (value:boolean) =>{
        this.setState({
            advancedSwitchedValue:value
        });
    }

    onGasValueChange = (value:string)=>{
        this.setState({
            gasValue:value
        });
    }

    onGasPriceValueChange = (value:string)=>{
        this.setState({
            gasPriceValue:value
        });
    }

    onGasDataValueChange = (value:string)=>{
        this.setState({
            gasDataValue:value
        });
    }
    render() {
        const {maximumValue, minimumValue} = this.props;
        return (
        <View style={[styles.container, this.props.style]} >
            <View style={styles.topContainer}>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <Text style={[styles.title, {color: LVColor.text.grey2, fontWeight:'100',}]}>
                        { LVStrings.transfer_miner_tips }
                    </Text>
                    <TouchableOpacity style = {{marginLeft: 10}} onPress = {this.clickFeeTip.bind(this)} activeOpacity = {0.8}>
                        <Image source = {FeeImage}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.tipsContainner, {borderColor:this.props.enable ? LVColor.primary: '#DDDDDD'}]}>
                    <Text style={[styles.tipsIndicator, {color: true ? LVColor.white : '#DDDDDD'}]}>{ this.calculateValue() }</Text>
                </View>
            </View>
            <View style={styles.topContainer}>
                <Text style={[styles.title, {color: LVColor.text.grey2, fontWeight:'100',}]}>
                    { LVStrings.transfer_current_eth }
                </Text>
                <Text style={[styles.title,{color: LVColor.text.editTextContent}]}>
                    {this.props.curETH }
                </Text>
            </View>>
            <View style={styles.topContainer}>
                <Text style={[styles.title, {color: LVColor.text.grey2, fontWeight:'100',}]}>
                    { LVStrings.transfer_advanced }
                </Text>
                <MXSwitch onSwitched = {this.onAdvancedSwitched.bind(this)}/>
            </View>
            {this.state.advancedSwitchedValue?
            <View style = {{justifyContent: "center",alignItems: 'center',marginTop:10,marginBottom:13}}>
                <MXCrossTextInput
                    style={{height:50,width:'100%'}}
                    placeholder={LVStrings.transfer_advanced_gas}
                    withUnderLine={true}
                    onTextChanged={(text) => this.setState({gasValue:text})}/>
                <MXCrossTextInput
                    style={{height:50,width:'100%'}}
                    placeholder={LVStrings.transfer_advanced_gas_price}
                    withUnderLine={true}
                    onTextChanged={(text) => this.setState({gasPriceValue:text})}/>
            </View>
            :
            <View style = {{backgroundColor: LVColor.white}}>
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
            {this.state.isShowFeeFailMessage}
              &&
            {<View style = {{marginTop:10,justifyContent: 'center',alignItems: 'center'}}>
                <Text style= {{fontSize:12,color:LVColor.text.red}}>
                 {LVStrings.transfer_minner_fee_fail}
                </Text>
            </View>
            }
            </View>
            }
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