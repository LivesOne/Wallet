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
    // 分隔线
    separateLine: '#EEEFF2',
    // Progress Bar
    progressBar: {
        fill: '#7dcd40',
        unfill: '#eeeff2',
        border: 'transparent',
    },
    // 给文本使用
    text: {
        white: '#fff',
        dot3: '#333333',
        grey1: '#667383',
        grey2: '#677384',
        grey3: '#bec4d0',
        grey4: '#c3c8d3',
        red: '#f25656',
        editTextContent: '#677384',
        placeHolder: '#bfc5d1'
    },
    // 背景色
    background: {
        white: '#fff',
        datePanel: '#f4f5f9',
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
    //profile nav background color
    profileNavBack: '#F8F9FB',
    profileNavTitleColor: '#6d798a'
};

export default {
    ...LVColor
};
