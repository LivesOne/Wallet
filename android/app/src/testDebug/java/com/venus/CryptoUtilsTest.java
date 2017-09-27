package com.venus;

import junit.framework.TestCase;

/**
 * Created by tlrkboy on 26/09/2017.
 */
public class CryptoUtilsTest extends TestCase {

    public void testToHex() throws Exception {
        assertEquals(true, equal(null, CryptoUtils.toHex(null)));
        char[] c1 = {0x32, 0x23};
        assertEquals(true, equal(c1, CryptoUtils.toHex("3223")));
        char[] c2 = {0x8e};
        assertEquals(true, equal(c2, CryptoUtils.toHex("8e")));
        char[] c3 = {0x8d,0x0d,0x63,0xde,0x8d,0xc0,0xa0,0xb7,0xe8,0xc6,0xdb,0xa4,0x4c,0x7d,0xd4,0x75,0x0f
                ,0x5d,0xf4,0x9a,0x4d,0x04,0x0d,0x44,0x58,0xf3,0xb2,0x3e,0x57,0x97,0x22,0xaf};
        assertEquals(true, equal(c3, CryptoUtils.toHex("8d0d63de8dc0a0b7e8c6dba44c7dd4750f5df49a4d040d4458f3b23e579722af")));
    }

    private boolean equal(char[] left, char[] right) {
        if (left != null && right != null) {
            if (left.length == right.length) {
                for (int i = 0; i < left.length; i++) {
                    if (left[i] != right[i])
                        return false;
                }
                return true;
            }
            return false;
        } else {
            return (left == null && right == null);
        }
    }

}