'use strict'

// @flow

import { StyleSheet, PixelRatio } from 'react-native';

import * as MXUtils from "../../utils/MXUtils";
let LVStyleSheet = require('../../styles/LVStyleSheet');
import LVColor from '../../styles/LVColor'

const Base = LVStyleSheet.create({
  main: {
    phone: {
      height: 46,
      width: MXUtils.getDeviceWidth() - 17 * PixelRatio.get(),
      backgroundColor: LVColor.white,
    },
    pad: {
      height: 60,
      borderRadius: 3,
      paddingLeft: 18,
      width:  MXUtils.getDeviceWidth() * 3 / 5,
      paddingRight: 15,
    }
  },
  content: {
    flex: 1,
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

  textArea: {
    flex: 1,
    justifyContent: 'flex-end', 
    paddingBottom: 6
  },

  label: {
    fontSize: 15,
  },

  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 6
  },

  clearButton: {
  },

  rightComponent: {
    marginLeft: 6
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
