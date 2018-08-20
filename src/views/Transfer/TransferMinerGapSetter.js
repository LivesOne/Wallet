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
    advancedSwitchedValue:bool,
    gasValue:string,
    gasPriceValue:string,
    isAdvancedValueFail:bool,
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
            isShowFeeFailMessage:false,
            isAdvancedValueFail:true
        }
        TransferUtils.log('default value = ' + this.getInitValue());
        this.showFeeFailMessag = this.showFeeFailMessag.bind(this);
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

    getGasValue = ()=>{
        return this.state.gasValue;
    }

    getGasPriceValue = ()=>{
        return this.state.gasPriceValue;
    }

    getAdvancedSwitchedValue = ()=>{
        return this.state.advancedSwitchedValue;
    }

    getAdvancedFailValue = ()=>{
        return this.state.isAdvancedValueFail;
    }

    calculateValue() {
        if (this.props.enable) {
            let gas = TransferUtils.convertMinnerGap(this.getValue());
            return ((isNaN(gas)?'--':gas) + ' ETH');
            // return this.getValue() + ' ETH';
        } else {
            return '-- ETH'
        }
    }

    getValue() {
        if (this.state.advancedSwitchedValue) {
            let gasValue = parseInt(this.state.gasPriceValue) * parseInt(this.state.gasValue) / Math.pow(10, 9);
            // 保留8位小数
            return  Number(TransferUtils.convertMinnerGap(gasValue));
        }
        return this.state.userHasChanged ? this.state.value : this.getInitValue();
    }

    getUserHasChanged() {
        if (this.state.advancedSwitchedValue) {
            const flag = true;
            return flag.toString();
        }
        return this.state.userHasChanged.toString();
    }

    onValueChange(value: number) {
        this.setState({
            value: value,
            userHasChanged : true,
        });
        setTimeout(() => {
            this.showFeeFailMessag(value);
        }, 100);
    }

    showFeeFailMessag = (value :number) =>{
        if (isNaN(value)) {
            this.setState({
                isShowFeeFailMessage:false,
            });
            return;
        }
        var flag = false;
        if (value < this.props.defaultValue) {
            flag = true;
        }
        this.setState({
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
        if (value) {
            this.setState({
                isShowFeeFailMessage:false,
                gasValue:'',
                gasPriceValue:'',
            });
        } else {
            this.showFeeFailMessag(this.state.value);
        }
        this.setState({
            advancedSwitchedValue:value
        });
    }

    onGasValueChange = (value:string)=>{
        this.setState({
            gasValue:value.trim()
        });
        setTimeout(() => {
            this.showFeeFailMessag(this.getValue());
        }, 100);
    }

    onGasPriceValueChange = (value:string)=>{
        this.setState({
            gasPriceValue:value.trim()
        });
        setTimeout(() => {
            this.showFeeFailMessag(this.getValue());
        }, 100);
    }

    onValidateGasValue = (value:?string)=>{
        if (!TransferUtils.isValidAmountStr(this.state.gasValue)) {
            this.setState({
                isAdvancedValueFail:true
            });    
            return LVStrings.transfer_gas_format_hint;
        }
        this.setState({
            isAdvancedValueFail:false
        });
        setTimeout(() => {
            this.showFeeFailMessag(this.getValue());
        }, 100);
        return null;
    }



    onValidateGasPriceValue = (value:?string)=>{
        if (!TransferUtils.isValidAmountStr(this.state.gasPriceValue)) {
            this.setState({
                isAdvancedValueFail:true
            });    
            return LVStrings.transfer_gasprice_format_hint;
        }
        this.setState({
            isAdvancedValueFail:false
        });
        if (parseInt(this.state.gasPriceValue) > 100) {
            return LVStrings.transfer_advanced_gas_price_overLimit;
        }
        setTimeout(() => {
            this.showFeeFailMessag(this.getValue());
        }, 100);
        return null;
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
            </View>
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
                    keyboardType = {'numeric'}
                    onValidation={this.onValidateGasValue.bind(this)}
                    onTextChanged={this.onGasValueChange.bind(this)}/>
                <MXCrossTextInput
                    style={{height:50,width:'100%'}}
                    placeholder={LVStrings.transfer_advanced_gas_price}
                    withUnderLine={true}
                    keyboardType = {'numeric'}
                    onValidation={this.onValidateGasPriceValue.bind(this)}
                    onTextChanged={this.onGasPriceValueChange.bind(this)}/>
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
            </View>
            }
              {
                this.state.isShowFeeFailMessage
                &&
                <View style = {{marginTop:10,justifyContent: 'center',alignItems: 'center'}}>
                    <Text style= {{fontSize:12,color:LVColor.text.red}}>
                    {LVStrings.transfer_minner_fee_fail}
                    </Text>
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