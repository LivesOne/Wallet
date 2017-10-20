/*
 * Project: Venus
 * File: src/foundation/knownFoundationErrors.js
 * Author: Charles Liu
 * @flow
 */


const knownFoundationErrors = {
    passwordMismatch: 'message authentication code mismatch',
    passwordRequired: 'Must provide password and salt to derive a key'
};

export default knownFoundationErrors;