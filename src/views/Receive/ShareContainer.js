
'use strict'

import React,{Component} from 'react';
import {
    StyleSheet,
    Share,
    View,

} from 'react-native';

import LVColor from '../../styles/LVColor';
import LVString from '../../styles/localization';

import MxImage from './MxImage';

const receive_share = require("../../assets/images/receive_share.png");

class ShareContainer extends Component {

    render() {

        return (
            <View style={styles.container}>
            </View>

            <View style={styles.share_container}>
                <MxImage source={this.props.source}
                         onPress = {
                            () => {
                                Share.share({
                                    url:'http://news.sohu.com',
                                    title:'share your code?',
                                },
                                {
                                    dialogTitle:'Share your code',
                                    excludedActivityTypes:[
                                        'com.apple.UIKit.activity.PostToTwitter'
                                    ]
                                })
                            }
                         }
                >
                </MxImage>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'90%',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:LVColor.navigationBar,
        elevation:20,
        shadowOffset:{
            width:0,
            height:0,
        },
        shadowColor:'black',
        shadowOpacity:0.2,
        shadowRadius:3,
        padding:30,

    },

    share_container:{
        flex:1,
        transform:[
            {
                translateY:-30,
            },
        ],
        elevation:21,

    },
    share:{
        height:50,
        width:50,
        flex:1,
    }

})