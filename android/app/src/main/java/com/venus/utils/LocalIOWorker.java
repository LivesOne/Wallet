package com.venus.utils;

import android.app.Activity;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;

import java.lang.ref.WeakReference;
import java.util.concurrent.ConcurrentHashMap;

import android.util.Log;

public class LocalIOWorker {
    protected static final String LOGTAG = "LocalIOWorker";
    private static LocalIOWorker mInstance;
    private HandlerThread handlerThread;
    private static Handler mHandler;
    private static final int MSG_WHAT_INIT = 1;
    private static final long COST_THRESHOLD = 1600l;

    private ConcurrentHashMap<WeakReference, WeakReference> mWeakRunnableMap;

    private LocalIOWorker() {

    }

    public void start() {
        if(mHandler==null) {
            mWeakRunnableMap = new ConcurrentHashMap<WeakReference, WeakReference>();
            handlerThread = new HandlerThread("LocalIOWorker");
            handlerThread.start();
            Looper looper = handlerThread.getLooper();
            mHandler = new Handler(looper) {

                @Override
                public void handleMessage(Message msg) {
                    if (MSG_WHAT_INIT == msg.what) {
                        android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_LESS_FAVORABLE);
                    }
                    Log.i(LOGTAG, "Handle Message msg =" + msg);
                    super.handleMessage(msg);
                }

            };

            mHandler.sendEmptyMessage(MSG_WHAT_INIT);
        }
    }

    public void stop() {
        mHandler.getLooper().quit();
        mHandler=null;

    }

    private void check(){

        if(mHandler==null) {
            throw new IllegalStateException("please start handler before use it");
        }
    }
    public static LocalIOWorker getInstance() {
        if (null == mInstance) {
            mInstance = new LocalIOWorker();
        }
        return mInstance;
    }



    public final void append(Runnable run) {
        check();
        if (null != run ) {
            Runnable wrapped = wrapRunnable(run);
            boolean result = mHandler.post(wrapped);
            if (!result) {
                Log.i(LOGTAG, "post result = " + result);
            }
        }
    }

    private Throwable mCallerThrowable ;

    private Runnable wrapRunnable(final Runnable runnable) {
        if (AndroidNativeConfig.ENABLE_LOG_FLAG) {
            mCallerThrowable = new Throwable();
        }

        final WeakReference originWeakRef = new WeakReference(runnable);
        Runnable wrapped = new Runnable() {
            @Override
            public void run() {
                long startTime = System.currentTimeMillis();
                runnable.run();
                mWeakRunnableMap.remove(originWeakRef);
                if (AndroidNativeConfig.ENABLE_LOG_FLAG) {
                    long cost = System.currentTimeMillis() - startTime;
                    Log.d(LOGTAG, "wrapRunnable time cost = " + cost + "; HashMapSize=" + mWeakRunnableMap.size());
                    if (cost > COST_THRESHOLD) {
                        mCallerThrowable.printStackTrace();
                        Log.e(LOGTAG, "wrapRunnable cost more than " + COST_THRESHOLD + "; please check if there any network io");
                    }
                }
            }
        };
        WeakReference wrappedWeakRef = new WeakReference(wrapped);
        mWeakRunnableMap.put(originWeakRef, wrappedWeakRef);

        return wrapped;
    }


    public final void appendAtFrontOfQueue(Runnable run) {
        check();
        if (null != run) {
            Runnable wrapped = wrapRunnable(run);
            boolean result = mHandler.postAtFrontOfQueue(wrapped);
            if (!result) {
                Log.i(LOGTAG, "postAtFrontQueue result=" + result);
            }
        }
    }


    public final void runOnUiThread(Activity currentActivity, Runnable run) {
        check();
        if (null != run) {
            if (null != currentActivity) {
                currentActivity.runOnUiThread(run);
            } else {
                Log.d(LOGTAG, "runOnUiThread error");
            }
        }
    }

    public final void appendDelayed(Runnable run, long delayMillis) {
        check();
        if (null != run) {
            Runnable wrapped = wrapRunnable(run);
            boolean result = mHandler.postDelayed(wrapped, delayMillis);
            if (!result) {
                Log.i(LOGTAG, "postDelayed result = " + result);
            }
        }
    }

    public final void removeRunnable(Runnable run){
        check();
        if (null != run) {
            WeakReference keyWeakRef = null;
            for(WeakReference weakRef : mWeakRunnableMap.keySet()) {
                if (run.equals(weakRef.get())) {
                    keyWeakRef = weakRef;
                }
            }
            Runnable destRunnable = null;
            if (null != keyWeakRef) {
                WeakReference destWeakRef = mWeakRunnableMap.get(keyWeakRef);
                if (null != destWeakRef) {
                    destRunnable = (Runnable)destWeakRef.get();
                }
                mWeakRunnableMap.remove(keyWeakRef);
            }
            if (null != destRunnable) {
                mHandler.removeCallbacks(destRunnable);
                Log.d(LOGTAG, "removeRunnable canceled");
            }
        }
    }

}
