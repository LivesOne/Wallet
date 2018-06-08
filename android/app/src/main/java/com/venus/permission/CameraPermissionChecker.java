package com.venus.permission;

import android.content.Context;
import android.hardware.Camera;
import android.os.Build;

/**
 * Created by hanli on 2018/6/8.
 */

public class CameraPermissionChecker {

    public static boolean checkCameraPermission(){
        boolean granted = true;
        //魅族或者6.0以下
        Camera mCamera = null;
        try {
            mCamera = Camera.open();
            // setParameters 是针对魅族MX5 做的。MX5 通过Camera.open() 拿到的Camera
            // 对象不为null
            Camera.Parameters mParameters = mCamera.getParameters();
            mCamera.setParameters(mParameters);
        } catch (Exception e) {
            granted = false;
        }
        if (mCamera != null) {
            mCamera.release();
        }
        return granted;
    }

}
