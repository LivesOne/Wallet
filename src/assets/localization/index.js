/*
 * Project: Venus
 * File: src/assets/localization/index.js
 * @flow
 */
"use strict";

import LocalizedStrings from 'react-native-localization';
import en_strings from './strings.en';
import zh_strings from './strings.zh';

const LVLocalizedStrings = new LocalizedStrings({
    en: {...en_strings},
    zh: {...zh_strings}
});

export default LVLocalizedStrings;