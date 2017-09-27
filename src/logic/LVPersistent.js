/*
 * Project: Venus
 * File: src/logic/LVPersistent.js
 * @flow
 */
'use strict';

import { AsyncStorage } from 'react-native';
import PLUtils from '../utils';

export async function setString(key: string, value: string) {
    if (PLUtils.isEmptyString(key)) return;
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
    }
}

export async function getString(key: string) {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

export async function setBoolean(key: string, value: boolean) {
    await setString(key, value ? '1' : '0');
}

export async function getBoolean(key: string) {
    const value = await getString(key);
    return value && value === '1';
}

export async function setNumber(key: string, value: number) {
    await setString(key, value.toString());
}

export async function getNumber(key: string) {
    const value = await getString(key);
    return value ? Number(value) : 0;
}

export async function setObject(key: string, value: Object) {
    await setString(key, JSON.stringify(value));
}

export async function getObject(key: string) {
    const value = await getString(key);
    return value ? JSON.parse(value) : null;
}