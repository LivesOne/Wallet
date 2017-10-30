package com.venus.lvexport;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.venus.BuildConfig;
import com.venus.CryptoUtils;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by tlrkboy on 27/09/2017.
 */

public class LVExportModule extends ReactContextBaseJavaModule {

    public LVExportModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LVReactExport";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        constants.put("isRelease", BuildConfig.IS_RELEASE);
        return constants;
    }

    @ReactMethod
    public void test(Promise promise) {
        promise.resolve("ok");
    }

//    @ReactMethod
//    public void libscrypt(final String password, final String saltHexStr,
//                          final int n, final int r, final int p, final int dkLen, final Promise promise) throws Exception {
//        String res = CryptoUtils.scrypt(password, saltHexStr, n, r, p, dkLen);
//        promise.resolve(res);
//    }
    @ReactMethod
    public void libscrypt(String password, String saltHexStr, int n, int r, int p, int dkLen, Callback callback) throws Exception {
        String res = CryptoUtils.scrypt(password, saltHexStr, n, r, p, dkLen);
        callback.invoke(res);
    }
}
