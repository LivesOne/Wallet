/*
 * Project: Venus
 * File: src/styles/LVColor.js
 * @flow
 */
'use strict';

// 全局颜色
const LVColor = {
    // App主色调
    primary: '#27347D',
    // 白色
    white: '#fff',
    // Navigation Bar 的背景颜色
    navigationBar: '#f9f9f9',
    //主要的背景色
    primaryBack:'#F8F9FB',
    // Tab Bar
    tabBar: {
        background: '#fff',
        tintColor: '#667283',
        shadowColor:'#6B7A9F',
    },
    // 分隔线
    separateLine: '#D8D8D8',
    // Progress Bar
    progressBar: {
        fill: '#7dcd40',
        unfill: '#eeeff2',
        border: 'transparent',
    },
    // 给文本使用
    text: {
        white: '#fff',
        lightWhite: '#FEFEFE',
        dot3: '#333333',
        grey1: '#667383',
        grey2: '#677384',
        grey3: '#bec4d0',
        grey4: '#c3c8d3',
        red: '#f25656',
        editTextContent: '#27347D',
        placeHolder: '#bfc5d1',
        editTextNomal: '#677384',
        buttonInActiveText: '#E0E3F1',
    },
    button:{
        // button inActive 颜色
        buttonInActive: '#B6BDDD',
        buttonActive: '#1B2768',
        buttoneEmptyActive: '#ECEEF2',
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
    profileNavBack: '#FFFFFF',
    profileNavTitleColor: '#6d798a'
};

export default {
    ...LVColor
};
