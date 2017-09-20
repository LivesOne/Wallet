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
    backgroundColor: LVColor.primary,
    justifyContent: 'center',
    phone: {
      height: 50,
      width: 240,
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
    fontSize: 15,
  },
});


const NormalStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
    borderColor: LVColor.primary,
    borderWidth: 1,
  },
  label: {
    color: LVColor.primary,
  },
});

const ActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.primary,
    borderWidth: 0,
  },
  label: {
    color: LVColor.white,
  },
});

const InActiveStyles = StyleSheet.create({
  main: {
    backgroundColor: LVColor.white,
    borderColor: LVColor.border.grey1,
    borderWidth: 1,
  },
  label: {
    color: LVColor.text.grey1,
  },
});

export { Base, ActiveStyles, InActiveStyles, NormalStyles };
