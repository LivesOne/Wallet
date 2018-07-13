// @flow

import {
  Dimensions,
  ActionSheetIOS,
  Share,
  Platform
} from 'react-native';
// import Orientation from 'react-native-orientation';
import LVWalletManager from '../logic/LVWalletManager';
import WalletUtils from '../views/Wallet/WalletUtils';

export const getDeviceHeight = () => Dimensions.get('window').height;
export const getDeviceWidth = () => Dimensions.get('window').width;
export const iPhoneX_Bottom_Inset = 34;

export const checkValidEmail = (email: string) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim());
};

export const checkValidPhone = (phone: string) => {
  var re = /^1(3|4|5|7|8)\d{9}$/; // 手机号码
  var re2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/; //固话
  return re.test(phone.trim()) || re2.test(phone.trim());
};

export const checkValidPassword = (password: string) => {
  return password && password !== null && password.trim().length >= 8;
};

export const checkValidVerificationCode = (code: string) => {
  return code && code !== null && code.trim().length === 6;
};

export const checkEqualPwd = (pwd: string, rePwd: string) => {
  return pwd && rePwd && pwd !== null && rePwd !== null && pwd.trim() === rePwd.trim();
};

export const isEmptyString = (str: ?string) => {
  return (str === null || str === undefined || str === '');
}

export const isNotEmptyString = (str: ?string) => {
  return (str !== null && str !== undefined && str !== '');
}

export const log = (msg: string) => {
  if (__DEV__ === true) {
    console.log("Pluto --> " + msg);
  }
};

export function getRandomInt(min : number, max : number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function formatCurrency(n: number) {
  if (n === 0) {
    return '0';
  } else {
    return n.toFixed(0).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }
}

export const isIphoneX = () => {
  let dimen = Dimensions.get('window');
  return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 || dimen.width === 812)
  );
};

export const makeCancelable = (promise : Promise<any>) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};


export async function backupWallet(wallet: Object, password: string) {
  const title: string = wallet.name;
  const message: string = JSON.stringify(wallet.keystore);
  const options = {
      title: title,
      message: message,
      subject: title
  };

  if (Platform.OS === 'ios') {
      const promise = new Promise(function(resolve, reject){
          ActionSheetIOS.showShareActionSheetWithOptions(
          options,
          error => reject(error),
          (success, activityType) => {
              if (success) {
                  console.log('bakcup success');
                  resolve(success);
              } else {
                  reject('cancelled');
              }
          }
      );
      });
      return promise;
  } else {
      let r =  await Share.share(options);
      WalletUtils.log(JSON.stringify(r));
  }
};

var processing_navigate = false;
export function isNavigating() {
  if (processing_navigate) { 
    return true; 
  }
  processing_navigate = true;
  setTimeout(() => { processing_navigate = false; }, 600);
  return false;
}
// const PORTRAIT = 'PORTRAIT';
// const LANDSCAPE = 'LANDSCAPE';
//
// export const lockPortrait = () => Orientation.lockToPortrait();
// export const lockLandscape = () => Orientation.lockToLandscape();
// export const unlockOrientations = () => Orientation.unlockAllOrientations();
//
// export const isLandscape = (orientation) => LANDSCAPE === orientation.toUpperCase();
//
// export const getOrientation = () => {
//   return Orientation.getInitialOrientation((err, orientation) => {
//     if (err) console.log(`Error on Orientation fetching: ${error}`);
//     if (orientation !== LANDSCAPE || orientation !== PORTRAIT) return PORTRAIT;
//     return orientation;
//   });
// };

// export const addOrientationListener = (listenerFn) => {
//   return Orientation.addOrientationListener(listenerFn);
// };
