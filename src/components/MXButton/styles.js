/**
 * @flow
 */
'use strict'
 
import { StyleSheet, PixelRatio } from 'react-native'
import PLColors from '../../assets/MXColors';
import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');


const Base = LVStyleSheet.create({
  main: {
    justifyContent: 'center',
    phone: {
      height: 50,
      width: MXUtils.getDeviceWidth() - 17 * PixelRatio.get(),
      borderRadius: 5,
    },
    pad: {
      height: 60,
      width:  MXUtils.getDeviceWidth() * 3 / 5,
      borderRadius: 10,
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
  inner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  icon: {
    height: 30,
    width: 30,
  },
});


const NormalStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_BACKGROUND,
    borderColor: PLColors.PL_BORDER_GRAY,
    borderWidth: 1,
  },
  label: {
    color: PLColors.PL_TEXT_BLACK_DARK,
  },
  icon: {
    tintColor: PLColors.PL_BACKGROUND,
  },
});

const LightStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_BACKGROUND,
    borderColor: PLColors.PL_BORDER_GRAY,
    borderWidth: 1,
  },
  label: {
    color: PLColors.PL_PRIMARY,
  },
  icon: {
    tintColor: PLColors.PL_BACKGROUND,
  },
});

const ActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: '#3FA2FF',
  },
  label: {
    color: PLColors.PL_BACKGROUND,
  },
  icon: {
    tintColor: '#fff',
  },
});

const InActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: PLColors.PL_FILL,
    borderColor: PLColors.PL_BACKGROUND,
    borderWidth: 1,
  },
  label: {
    color: PLColors.PL_TEXT_BLACK_LIGHT,
  },
  icon: {
    tintColor: '#3FA2FF',
  },
});

export { Base, ActiveStyles, LightStyles, InActiveStyles, NormalStyles };
