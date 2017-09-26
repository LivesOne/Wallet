package com.venus;

import android.util.Log;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Venus";
    }

//    lvExport.libscrypt("showmethemoney",
//            "8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af"
//            ,262144,8,1);

//        "salt": "salt",
//                "password": "password",
//                "N": 2,
//                "r": 1,
//                "p": 1,
//                "dkLen": 32,
//                "expected": "6d1bb878eee9ce4a7b77d7a44103574d4cbfe3c15ae3940f0ffe75cd5e1e0afa"

//    {
//        "salt": "NaCl", // heh
//            "password": "password",
//            "N": 1024,
//            "r": 8,
//            "p": 16,
//            "dkLen": 64,
//            "expected": "fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640"
//    },

//    {
//        "salt": "SodiumChloride",
//            "password": "pleaseletmein",
//            "N": 16384,
//            "r": 8,
//            "p": 1,
//            "dkLen": 64,
//            "expected": "7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887"
//    },
    @Override
    protected void onResume() {
        super.onResume();
        String res = CryptoUtils.scrypt("pleaseletmein", "SodiumChloride",
                16384, 8, 1, 64);
        if (res != null && "7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887".equals(new String(res))) {
            Log.i("Venus", "crypto ok reuslt = " + new String(res));
        } else {
            Log.i("Venus", "crypto failed, result = " + new String(res));
        }
    }
}
