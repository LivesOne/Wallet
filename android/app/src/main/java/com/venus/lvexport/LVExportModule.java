package com.venus.lvexport;


import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.support.v4.content.FileProvider;
import android.support.v4.hardware.fingerprint.FingerprintManagerCompat;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.venus.BuildConfig;
import com.venus.CryptoUtils;
import com.venus.R;
import com.venus.permission.CameraPermissionChecker;
import com.venus.utils.FingerHelper;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
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

    @ReactMethod
    public void installApk(String apkLocation){
        File apkFile = new File(apkLocation);
        Log.i("update" , "安装应用："+apkFile.getAbsolutePath());
        Intent intent = new Intent(Intent.ACTION_VIEW);
        //如果没有设置SDCard写权限，或者没有sdcard,apk文件保存在内存中，需要授予权限才能安装
        try {
            String[] command = {"chmod", "777", apkFile.toString()};
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.start();
        } catch (IOException ignored) {
        }

        Uri uri = FileProvider.getUriForFile(getReactApplicationContext().getApplicationContext() , "com.venus.fileprovider" , apkFile);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

        if(Build.VERSION.SDK_INT >= 24){
            // 7。0及以上
            intent.setDataAndType(uri , "application/vnd.android.package-archive");
        }else{
            intent.setDataAndType(Uri.fromFile(apkFile) , "application/vnd.android.package-archive");
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void isLanguageZh(Promise promise){
        Locale locale = getReactApplicationContext().getResources().getConfiguration().locale;
        String language = locale.getLanguage();
        if (language.endsWith("zh")){
            promise.resolve(true);
        }else{
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void checkCameraPermission(Promise promise){
        boolean granted = CameraPermissionChecker.checkCameraPermission();
        promise.resolve(granted);
    }

    @ReactMethod
    public void getAuthSupport(Promise promise){
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("password" , true);
            jsonObject.put("touchid" , FingerHelper.getInstance().hasEnrolledFingerprints());
            jsonObject.put("faceid" , false);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String result = jsonObject.toString();
        Log.i("authSupport" , result);
        promise.resolve(result);
    }

    @ReactMethod
    public void startAuth(String authType , final Promise promise){
        Log.i("authSupport" , "authType:" + authType);
        if(!TextUtils.isEmpty(authType) && authType.equals("touchid")){
            // 开始指纹验证
            FingerHelper.getInstance().init(getReactApplicationContext()).start(new FingerprintManagerCompat.AuthenticationCallback() {

                int errorMax = 3;

                boolean isActive = true;

                @Override
                public void onAuthenticationError(int errMsgId, CharSequence errString) {
                    String tip = "errMsgId:" + errMsgId + "--"+  errString;
                    Log.i("authSupport" , tip);
                    if(errMsgId != 5){
                        Toast.makeText(getReactApplicationContext() , errString , Toast.LENGTH_SHORT).show();
                        occurError(true);
                    }
                }

                @Override
                public void onAuthenticationHelp(int helpMsgId, CharSequence helpString) {
                    String tip = "helpMsgId:" + helpMsgId + "--"+  helpString;
                    Log.i("authSupport" , tip);
                    if(TextUtils.isEmpty(helpString)){
                        helpString = "error";
                    }
                    Toast.makeText(getReactApplicationContext() ,helpString , Toast.LENGTH_SHORT).show();
                    occurError(false);
                }

                @Override
                public void onAuthenticationSucceeded(FingerprintManagerCompat.AuthenticationResult result) {
                    Toast.makeText(getReactApplicationContext() , getReactApplicationContext().getString(R.string.auth_touchid_match) , Toast.LENGTH_SHORT).show();
                    promise.resolve("success");
                }

                @Override
                public void onAuthenticationFailed() {
                    Toast.makeText(getReactApplicationContext() , getReactApplicationContext().getString(R.string.auth_touchid_not_match) , Toast.LENGTH_SHORT).show();
                    occurError(false);
                }

                private void occurError(boolean shutdown){
                    if(isActive && (errorMax == 0 || shutdown)){
                        isActive = false;
                        Log.i("authSupport" , "FingerHelper occurError");
                        if(errorMax == 0){
                            promise.reject("1" , "switch");
                        } else {
                            promise.reject("2" , "retry");
                        }
                        FingerHelper.getInstance().cancel();
                    }
                    errorMax --;
                }
            });
        }else{
            promise.reject("error");
        }
    }

    @ReactMethod
    public void cancelAuth(){
        FingerHelper.getInstance().cancel();
    }
}
