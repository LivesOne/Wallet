'use strict'

// @flow

import { StyleSheet, PixelRatio, Platform } from 'react-native';

import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'

const Base = LVStyleSheet.create({
  main: {
    height: 80,
    width: MXUtils.getDeviceWidth() - 18 * PixelRatio.get(),
    backgroundColor: LVColor.white,
  },
  content: {
    marginTop: 10,
    flexDirection: 'row',
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
      marginTop: 18,
  },

  textArea: {
    flex: 1,
    justifyContent: 'flex-end', 
    paddingBottom: 6
  },

  label: {
    fontSize: 15,
    fontWeight: '500'
  },

  buttonArea: {
    flexDirection: 'row',
    justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    alignItems: 'center',
    alignSelf: Platform.OS === 'ios' ? 'flex-end' : 'center',
    marginBottom: 6,
  },

  clearButton: {
  },

  rightComponent: {
    marginLeft: 6
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
    color: LVColor.text.editTextPrimary,
  },
});

const WhiteStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
  },
  label: {
    color: LVColor.text.editTextPrimary,
  },
});

const LightStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
  },
  label: {
    color: LVColor.text.editTextPrimary,
  },
});

export { Base, DefaultStyles, LightStyles, WhiteStyles, TextAlignCenterStyles };
