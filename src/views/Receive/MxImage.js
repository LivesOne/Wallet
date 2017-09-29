
'use strict'

import React,{Component} from 'react'
import {TouchableOpacity,View,ViewPropTypes,Image,Text,StyleSheet } from 'react-native'
import LVColor from '../../styles/LVColor'
import PropTypes from 'prop-types';


class MxImage extends Component {

    state: {
        pressState: boolean,

    }

    static propTypes = {
        disabled:PropTypes.bool,
        onPress:PropTypes.func,

    }

    constructor(props:any) {
        super(props);
        this.state = {
            pressState: false,
        };
        disabled:false;
    }

    getTheme(disabled:boolean) {
        if(disabled) {
            return InActiveStyles;

        }else {
            return this.state.pressStatus ? ActiveStyles : NormalStyles;

        }
    }

    render() {
        const { onPress,style,disabled,} = this.props;

        const theme = this.getTheme(disabled);

        return (
            <TouchableOpacity
               activeOpacity={1}
               disabled = { disabled}
               underlayColor = { LVColor.primary }
               style={[
                   theme.main,
                   style,
               ]}
               onPressOut={ () => {
                   this.setState(
                       {
                           pressState:false
                       }
                   )
               }}
               onPressIn={
                   () => {
                       this.setState(
                           {
                               pressState:true
                           }
                       )
                   }
               }

               onPress={onPress}
               >
               <Image source={this.props.source}></Image>
               </TouchableOpacity>
        );
    }
};

const NormalStyles = StyleSheet.create({
    main:{
        // backgroundColor:LVColor.white,
        borderColor:LVColor.primary,
        borderWidth:0,
    },
});

const ActiveStyles = StyleSheet.create({
    main:{
        // backgroundColor:LVColor.primary,
        borderWidth:0,
    },
});

const InActiveStyles = StyleSheet.create({
    main:{
        backgroundColor: LVColor.white,
        borderColor:LVColor.border.grey1,
        borderWidth:1,
    },

});
export default MxImage;


