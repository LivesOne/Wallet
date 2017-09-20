'use strict'

// @flow

import { StyleSheet, PixelRatio } from 'react-native';

import PLColors from '../../assets/MXColors';
import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');

const Base = LVStyleSheet.create({
  main: {
    phone: {
      flexDirection: 'row',
      height: 50,
      width: MXUtils.getDeviceWidth() - 17 * PixelRatio.get(),
      borderRadius: 3,
      paddingLeft: 18,
      paddingRight: 15,
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
    fontSize: 16,
  },

  clearButton: {
    alignSelf: 'center',
  }

});

const DefaultStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_FILL,
  },
  label: {
    color: '#414853',
  },
});

const WhiteStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_BACKGROUND,
  },
  label: {
    color: PLColors.PL_TEXT_BLACK_DARK,
  },
});

const LightStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_BACKGROUND,
    borderColor: PLColors.PL_BORDER_GRAY,
    borderWidth: 1,
  },
  label: {
    color: '#414853',
  },
});

export { Base, DefaultStyles, LightStyles, WhiteStyles };
