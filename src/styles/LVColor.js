/*
 * Project: Venus
 * File: src/styles/LVColor.js
 * @flow
 */
'use strict';

// 全局颜色
const LVColor = {
    // App主色调
    primary: '#FC9B33',
    // 白色
    white: '#fff',
    // Navigation Bar 的背景颜色
    navigationBar: '#f9f9f9',
    // Tab Bar
    tabBar: {
        background: '#fff',
        tintColor: '#FF892E'
    },
    // 给文本使用
    text: {
        white: '#fff',
        grey1: '#494949',
        grey2: '#686868',
        grey3: '#9B9B9B',
        grey4: '#B5B5B5',
        editTextContent: '#677384',
        placeHolder: '#bfc5d1'
    },
    // 背景色
    background: {
        white: '#fff',
        grey1: '#ddd',
        grey2: '#eee',
        grey3: '#f7f7f7'
    },
    // 边框颜色
    border: {
        grey1: '#ddd',
        grey2: '#eee',
        grey3: '#f4f4f4',
        editTextBottomBoarder: '#bfc5d1',
    },
};

export default {
    ...LVColor
};
