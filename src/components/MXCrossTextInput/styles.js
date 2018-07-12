'use strict'

// @flow

import { StyleSheet, PixelRatio, Platform } from 'react-native';

import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'
import { MXCrossInputHeight } from '../../styles/LVStyleSheet';

const Base = LVStyleSheet.create({
  main: {
    height: MXCrossInputHeight,
    backgroundColor: LVColor.white
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent:'center',
  },
  titleAndInputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: 'green'
  },
  defaultTextAreaStyle: {
    height: 25,
    marginTop:5
    // backgroundColor: 'red'
  },
  titleLabel: {
    fontSize: 12,
    color: LVColor.text.grey2,
    height: 17,
    // backgroundColor: 'yellow'
  },
  errorLabel: {
    marginTop: 5,
    fontSize: 12,
    color: LVColor.text.red
  },
  bottomStyle: {
    height: 1
  },
  rounded: {
    phone: {
      borderRadius: 25,
    },
    pad: {
      borderRadius: 35,
    }
  },
  textInputView: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  textArea: {
    flex: 1,
  },

  label: {
    fontSize: 15,
    textAlign: 'left',
    paddingLeft: 0,
    fontWeight: '500'
  },

  buttonArea: {
    flexDirection: 'row',
    justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    alignItems: 'center',
    alignSelf: Platform.OS === 'ios' ? 'flex-end' : 'center',
  },

  clearButton: {
  },

  rightComponent: {
    marginLeft: 6,
  }

});

const TextAlignCenterStyles = StyleSheet.create({
  textArea: {
    flex: 1,
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

const DefaultStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
  },
  label: {
    color: LVColor.text.editTextContent,
  },
});

const WhiteStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
  },
  label: {
    color: LVColor.text.editTextContent,
  },
});

const LightStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
  },
  label: {
    color: LVColor.text.editTextContent,
  },
});

export { Base, DefaultStyles, LightStyles, WhiteStyles, TextAlignCenterStyles };
