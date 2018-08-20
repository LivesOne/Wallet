
/**
 * @flow
 */
import {
  getDeviceHeight,
  getDeviceWidth,
  checkValidPassword,
  checkValidEmail,
  checkValidVerificationCode,
  checkEqualPwd,
  isEmptyString,
  isNotEmptyString,
  formatCurrency,
  isIphoneX,
  isNavigating,
  log,
} from './MXUtils';

import * as StringUtils from './MXStringUtils';
import * as DateUtils from './MXDateUtils';

const PLUtils = {
  // Dimensions
  getDeviceHeight,
  getDeviceWidth,
  checkValidPassword,
  checkValidEmail,
  checkValidVerificationCode,
  checkEqualPwd,
  isEmptyString,
  isNotEmptyString,
  isIphoneX,
  isNavigating,
  log,
};

export default PLUtils;

export { StringUtils, DateUtils };
