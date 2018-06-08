
/*
 * Project: Venus
 * File: src/views/Common/LVKeyboardSpacer.js
 * Author: xcl
 * @flow
 */
import * as React from 'react';
import { StyleSheet, View, Text, Easing, BackHandler, Keyboard, Platform,Modal } from 'react-native';
import LVColor from '../../styles/LVColor';

type Props = {
};
type State = {
    keyboardSpace: number,
}

export default class LVKeyboardSpacer extends React.Component<Props, State> {

    keyboardDidShowListener: Object;
    keyboardDidHideListener: Object;

    constructor() {
        super();
        this.state = {
            keyboardSpace: 0,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Platform.OS === 'ios' ?
        Keyboard.addListener('keyboardWillShow',this.updateKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidShow',this.updateKeyboardSpace.bind(this));
        this.keyboardDidHideListener = Platform.OS === 'ios' ?
        Keyboard.addListener('keyboardWillHide',this.resetKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidHide',this.resetKeyboardSpace.bind(this));
        }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    updateKeyboardSpace (frames:any) {
        if(!frames.endCoordinates){
            return;
         };
         let keyboardSpace = frames.endCoordinates.height;//获取键盘高度
     
         this.setState({
            keyboardSpace: keyboardSpace
         });
      }
    
      resetKeyboardSpace () {
        this.setState({keyboardSpace: 0});
    }
    
    render() {     
        return (
            <View style={[styles.container, { height: this.state.keyboardSpace }]} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        backgroundColor: LVColor.white,
        alignItems: 'center'
    }
});