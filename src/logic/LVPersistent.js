/*
 * Project: Venus
 * File: src/logic/LVPersistent.js
 * @flow
 */
'use strict';

import { AsyncStorage } from 'react-native';
import PLUtils from '../utils';

export default class LVPersistent {
    constructor() {}

    static async setString(key: string, value: string) {
        if (PLUtils.isEmptyString(key)) return;
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {}
    }

    static async getString(key: string) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    static async setBoolean(key: string, value: boolean) {
        await LVPersistent.setString(key, value ? '1' : '0');
    }

    static async getBoolean(key: string) {
        const value = await LVPersistent.getString(key);
        return value && value === '1';
    }

    static async setNumber(key: string, value: number) {
        await LVPersistent.setString(key, value.toString());
    }

    static async getNumber(key: string) {
        const value = await LVPersistent.getString(key);
        return value ? Number(value) : 0;
    }

    static async setObject(key: string, value: Object) {
        await LVPersistent.setString(key, JSON.stringify(value));
    }

    static async getObject(key: string) {
        const value = await LVPersistent.getString(key);
        return value ? JSON.parse(value) : null;
    }
}
