/*
 * Project: Venus
 * File: src/styles/LVFontSize.js
 * @flow
 */
"use strict";

import { PixelRatio } from 'react-native'

// 全局字体大小
const PLFontSize = {
    xxsmall: 10, 
    xsmall: 12,
    small: 14,
    default: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    pixel: 1 / PixelRatio.get(),  // 最细边框
}

export default PLFontSize;