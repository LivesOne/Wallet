/**
 * @flow
 */
'use strict'
 
import { StyleSheet, PixelRatio } from 'react-native'
import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'


const Base = LVStyleSheet.create({
  main: {
    justifyContent: 'center',
    phone: {
      height: 50,
      width: 240,
      borderRadius: 8,
    },
    pad: {
      height: 60,
      width:  MXUtils.getDeviceWidth() * 3 / 5,
      borderRadius: 10,
    }
  },
  rounded: {
    phone: {
      borderRadius: 8,
    },
    pad: {
      borderRadius: 8,
    }
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
  },
});


const NormalStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.primary,
    borderWidth: 0,
  },
  label: {
    color: LVColor.text.lightWhite,
  },
});

const NormalEmptyStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
    borderColor: LVColor.primary,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    color: LVColor.primary,
  },
});

const ActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.button.buttonActive,
    borderWidth: 0,
  },
  label: {
    color: LVColor.text.lightWhite,
  },
});

const ActiveEmptyStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.button.buttoneEmptyActive,
    borderWidth: 0,
  },
  label: {
    color: LVColor.primary,
  },
});

const InActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.button.buttonInActive,
    borderColor: LVColor.border.grey1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    color: LVColor.text.buttonInActiveText,
  },
});

export { Base, ActiveStyles, InActiveStyles, NormalStyles,ActiveEmptyStyles,NormalEmptyStyles};
