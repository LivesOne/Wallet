'use strict'

// @flow

import { StyleSheet, PixelRatio, Platform } from 'react-native';

import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'

const Base = LVStyleSheet.create({
  main: {
    height: 60,
    width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get(),
    backgroundColor: LVColor.white,
  },
  content: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  rounded: {
    phone: {
      borderRadius: 25,
    },
    pad: {
      borderRadius: 35,
    }
  },

  titleLabel: {
      fontSize: 12,
      color: LVColor.text.grey2,
  },

  textArea: {
    flex: 1,
    justifyContent: 'flex-end', 
  },

  label: {
    fontSize: 15,
    textAlign:'left',
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
    justifyContent: 'center', 
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
