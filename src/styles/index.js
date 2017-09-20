/*
 * Project: Venus
 * File: src/styles/index.js
 * @flow
 */
"use strict";

import { PixelRatio, Dimensions } from 'react-native'

// 全局颜色
export const Color = {
    // App主色调
    primary: '#3FA2FF',
    // 白色
    white: '#FFFFFF',
    // Navigation Bar 的背景颜色
    navigationBar: '#f9f9f9',
    // 给文本使用
    text: {                
        grey1: '#494949',
        grey2: '#686868',
        grey3: '#9B9B9B',
        grey4: '#B5B5B5',
    },
    // 背景色
    background: {                 
        grey1: '#ddd',
        grey2: '#eee',
        grey3: '#f7f7f7',
    },
    // 边框颜色
    border: {            
        grey1: '#ddd',
        grey2: '#eee',
        grey3: '#f4f4f4',
    },
};

// 全局字体大小
export const Size = {
    xxsmall: 10, 
    xsmall: 12,
    small: 14,
    default: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    pixel: 1 / PixelRatio.get(),  // 最细边框
}

// 全局Window尺寸
export const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}