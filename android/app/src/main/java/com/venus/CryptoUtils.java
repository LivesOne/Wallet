package com.venus;

/**
 * Created by tlrkboy on 26/09/2017.
 */

public class CryptoUtils {

    private static final char[] HEX = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};


    static {
        System.loadLibrary("scrypt_crypho");
    }

    public static native byte[] scrypt(byte[] pass, char[] salt, Integer N, Integer r, Integer p, Integer dkLen);

    public static String scrypt(String password, String salt, int N, int r, int p, int dkLen) {
        byte[] pass = password != null ? password.getBytes() : null;
        char[] s = salt != null ? salt.toCharArray() : null;
        if (pass == null || s == null) {
            return null;
        } else {
            try {
                return hexify(scrypt(pass, s, N, r, p, dkLen));
            } catch (Exception e) {
                return null;
            }
        }
    }

    private static String hexify (byte[] input) {
        int len = input.length;
        char[] result = new char[2 * len];
        for ( int j = 0; j < len; j++ ) {
            int v = input[j] & 0xFF;
            result[j * 2] = HEX[v >>> 4];
            result[j * 2 + 1] = HEX[v & 0x0F];
        }
        return new String(result).toLowerCase();
    }
}
