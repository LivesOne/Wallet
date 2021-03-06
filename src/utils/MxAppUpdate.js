'use strict';

import {
    NativeModules,
    Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';

const jobId = -1;

class AppUpdate {
  constructor(options) {
    this.options = options;
  }

  GET(url, success, error) {
    fetch(url , {
      headers : {
        'Cache-Control':'no-cache',
      }
    })
      .then((response) => response.json())
      .then((json) => {
        success && success(json);
      })
      .catch((err) => {
        error && error(err);
      });
  }

  getApkVersion() {
    if (jobId !== -1) {
      return;
    }
    if (!this.options.apkVersionUrl) {
      console.log("apkVersionUrl doesn't exist.");
      return;
    }
    this.GET(this.options.apkVersionUrl, this.getApkVersionSuccess.bind(this), this.getVersionError.bind(this));
  }

  getApkVersionSuccess(remote) {
    console.log("getApkVersionSuccess", remote);
    console.log("versionCode:"+remote.result.android.versionCode);
    if (DeviceInfo.getBuildNumber() < remote.result.android.versionCode) {
      if (remote.result.android.forceUpdate) {
        if(this.options.forceUpdateApp) {
          this.options.forceUpdateApp();
        }
        this.downloadApk(remote);
      } else if (this.options.needUpdateApp) {
        this.options.needUpdateApp((isUpdate) => {
          if (isUpdate) {
            this.downloadApk(remote);
          }
        });
      }
    } else if(this.options.notNeedUpdateApp) {
      this.options.notNeedUpdateApp();
    }
  }

  downloadApk(remote) {
    const progress = (data) => {
      const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
      this.options.downloadApkProgress && this.options.downloadApkProgress(percentage);
    };
    const begin = (res) => {
      console.log("downloadApkStart");
      this.options.downloadApkStart && this.options.downloadApkStart();
    };
    const progressDivider = 1;
    const downloadDestPath = `${RNFS.DocumentDirectoryPath}/NewApp.apk`;

    const ret = RNFS.downloadFile({
      fromUrl: remote.result.android.apkUrl,
      toFile: downloadDestPath,
      begin,
      progress,
      background: true,
      progressDivider
    });

    jobId = ret.jobId;

    ret.promise.then((res) => {
      console.log("downloadApkEnd");
      this.options.downloadApkEnd && this.options.downloadApkEnd();
      NativeModules.LVReactExport.installApk(downloadDestPath);

      jobId = -1;
    }).catch((err) => {
      this.downloadApkError(err);

      jobId = -1;
    });
  }

  getAppStoreVersion() {
    if (jobId !== -1) {
      return;
    }
    if (!this.options.apkVersionUrl) {
      console.log("apkVersionUrl doesn't exist.");
      return;
    }
    if (NativeModules.LVReactExport.isEnterprise) {
      this.GET(this.options.apkVersionUrl, this.getAppStoreCheckVersionSuccess.bind(this), this.getVersionError.bind(this));
    }
  }

  getAppStoreCheckVersionSuccess(remote) {
    NativeModules.LVReactExport.updateAppConfig(remote.result.ios);
  }

  getVersionError(err) {
    console.log("getVersionError", err);
  }

  downloadApkError(err) {
    console.log("downloadApkError", err);
    this.options.onError && this.options.onError();
  }

  checkUpdate() {
    if (Platform.OS === 'android') {
      this.getApkVersion();
    } else {
      this.getAppStoreVersion();
    }
  }
}

export default AppUpdate;
