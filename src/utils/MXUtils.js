// @flow

import {
  Dimensions,
  ActionSheetIOS,
  Share,
  Platform
} from 'react-native';
// import Orientation from 'react-native-orientation';
import LVWalletManager from '../logic/LVWalletManager';

export const getDeviceHeight = () => Dimensions.get('window').height;
export const getDeviceWidth = () => Dimensions.get('window').width;

export const checkValidEmail = (email: string) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim());
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

export const isEmptyString = (str: string) => {
  return (str === null || str === undefined || str === '');
}

export const isNotEmptyString = (str: string) => {
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
  const isPasswordCorrect = await LVWalletManager.verifyPassword(password, wallet.keystore);

  if(!isPasswordCorrect) {
    throw new Error('passwordIncorrect');
  }
  
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
    await Share.share(options);
  }
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
