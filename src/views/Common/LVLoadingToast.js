/*
 * Project: Venus
 * File: src/views/Common/LVLoadingToast.js
 * Author: Charles Liu
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Easing,
    Image,
    Animated,
    Platform,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import { isAbsolute } from 'path-browserify';
import LVColor from '../../styles/LVColor';

const RotationCircleImage = require('../../assets/images/loading.png');

export default class LVLoadingToast extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number
    };

    state: {
        rotation: any
    }

    constructor() {
        super();
        this.state = {
            rotation: new Animated.Value(0)
        };
    }

    show() {
        this.refs.dialog.open();
        if (Platform.OS === 'ios') {
            this.startAnimation();
        }
    }

    dismiss() {
        this.refs.dialog.close();
    }

    componentDidMount() {
        //this.startAnimation();
    }

    startAnimation () {
        this.state.rotation.setValue(0);
        Animated.timing(this.state.rotation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.linear)
        }).start(()=> this.startAnimation());
    }

    render() {
        const title = this.props.title;
        
        const modalWidth = { width: this.props.width || '75%' };
        const modalHeight = { height: this.props.height || 175 };
        const isAndroid = Platform.OS === 'android'

        return (
            <Modal
            ref={'dialog'}
            isOpen={false}
            style={[styles.modal, modalWidth, modalHeight]}
            entry={'top'}
            position={'center'}
            coverScreen={true}
            backButtonClose={false}
            backdropOpacity={0.5}
            animationDuration={300}
            backdropPressToClose={false}
            easing={Easing.elastic(0.75)}
        >
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
                {!isAndroid && 
                <Animated.Image source={RotationCircleImage} 
                    style={{
                        transform: [
                            {
                                rotateZ: this.state.rotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"]
                                })
                            }
                        ]
                    }}/>}

                {isAndroid && 
                <ActivityIndicator
                    style={[styles.centering, {transform: [{scale: 1.5}]}]}
                    size={'large'}
                    color={'#f6a81e'}
                />}
                <Text style={styles.title}>{title}</Text>
            </View>
        </Modal>
            
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        marginTop: -44,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        marginTop: 15,
        fontSize: 15,
        color: '#677384'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      },
});