'use strict'

// @flow

import { StyleSheet, PixelRatio } from 'react-native';

import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'

const Base = LVStyleSheet.create({
  main: {
    phone: {
      flexDirection: 'row',
      height: 50,
      width: MXUtils.getDeviceWidth() - 17 * PixelRatio.get(),
      paddingRight: 15,
      paddingLeft: 15,
      borderWidth: 0.5,
      backgroundColor: LVColor.white,
      borderColor : "transparent",
      borderBottomColor: LVColor.border.editTextBottomBoarder,
    },
    pad: {
      flexDirection: 'row',
      height: 60,
      borderRadius: 3,
      paddingLeft: 18,
      width:  MXUtils.getDeviceWidth() * 3 / 5,
      paddingRight: 15,
    }
  },
  rounded: {
    phone: {
      borderRadius: 25,
    },
    pad: {
      borderRadius: 35,
    }
  },

  label: {
    flex: 1,
    fontSize: 15,
  },

  clearButton: {
    alignSelf: 'center',
  }

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

export { Base, DefaultStyles, LightStyles, WhiteStyles };
