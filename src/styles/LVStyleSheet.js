/**
 * @flow
 */

'use strict';

import {StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export function create(styles: Object): {[name: string]: number} {
  const platformStyles = {};
  Object.keys(styles).forEach((name) => {
    let {phone, pad, ...style} = {...styles[name]};
    if (phone && !DeviceInfo.isTablet()) {
      style = {...style, ...phone};
    }
    if (pad && DeviceInfo.isTablet()) {
      style = {...style, ...pad};
    }
    platformStyles[name] = style;
  });
  return StyleSheet.create(platformStyles);
}

