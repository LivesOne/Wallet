package com.venus;

import android.app.Application;

import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.eguma.barcodescanner.BarcodeScannerPackage;
import com.peel.react.RNOSModule;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.venus.lvexport.MyReactPackage;
import com.venus.utils.LocalIOWorker;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MyReactPackage(),
            new MainReactPackage(),
            new RNFSPackage(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            new RCTCameraPackage(),
            new BarcodeScannerPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RandomBytesPackage(),
            new RNOSModule(),
            new LinearGradientPackage(),
            new ReactNativeLocalizationPackage(),
            new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
      SoLoader.loadLibrary("scrypt_crypho");
      LocalIOWorker.getInstance().start();
  }

    @Override
    public void onTerminate() {
        super.onTerminate();
        LocalIOWorker.getInstance().stop();
    }
}
