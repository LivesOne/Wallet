package com.venus.utils;

import android.content.Context;
import android.hardware.fingerprint.FingerprintManager;
import android.support.v4.hardware.fingerprint.FingerprintManagerCompat;
import android.support.v4.os.CancellationSignal;
import android.util.Log;
import android.widget.Toast;

import com.venus.R;

/**
 * Created by hanli on 2018/7/16.
 */

public class FingerHelper {

    private static FingerHelper mHelper;
    
    private FingerprintManagerCompat mFingerManager;
    
    private CancellationSignal mCancel;
    
    private Context mContext;

    private FingerHelper(){
    }

    public static FingerHelper getInstance(){
        if(mHelper == null){
            mHelper = new FingerHelper();
        }
        return mHelper;
    }
    
    public FingerHelper init(Context context){
        mContext = context;
        mFingerManager = FingerprintManagerCompat.from(context);
        return this;
    }

    /**
     * 是否支持指纹识别
     * @return
     */
    public boolean isSupportFinger(){
        return mFingerManager != null && mFingerManager.isHardwareDetected();
    }

    /**
     * 是否在设置中注册了指纹
     * @return
     */
    public boolean hasEnrolledFingerprints(){
        Log.i("authSupport" , "isSupportFinger:" + isSupportFinger());
        Log.i("authSupport" , "hasEnrolledFingerprints :" + mFingerManager.hasEnrolledFingerprints());
        return isSupportFinger() && mFingerManager.hasEnrolledFingerprints();
    }
    
    public void start(FingerprintManagerCompat.AuthenticationCallback callback){
        if(hasEnrolledFingerprints()){
            Toast.makeText(mContext, mContext.getString(R.string.auth_touchid_start), Toast.LENGTH_SHORT).show();
            mCancel = new CancellationSignal();
            if(callback == null){
                callback = new FingerprintManagerCompat.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errMsgId, CharSequence errString) {
                        Toast.makeText(mContext , errString , Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onAuthenticationHelp(int helpMsgId, CharSequence helpString) {
                        Toast.makeText(mContext , helpString , Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onAuthenticationSucceeded(FingerprintManagerCompat.AuthenticationResult result) {
                        Toast.makeText(mContext , "验证成功" , Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        Toast.makeText(mContext , "验证不匹配" , Toast.LENGTH_SHORT).show();
                    }
                };
            }
            mFingerManager.authenticate(null, 0, mCancel, callback , null);
        }
    }
    
    public void cancel(){
        if(mCancel != null){
            mCancel.cancel();
        }
    }
    
}
