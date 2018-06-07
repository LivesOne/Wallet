//@flow
import LVPersistent from '../../logic/LVPersistent';
'use strict'

var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});
const eth_local = require('../../foundation/ethlocal.js');

import LVStrings from '../../assets/localization';
import knownFoundationErrors from '../../foundation/knownFoundationErrors';

const WalletDefaultNameIndexKey :string = '@Venus:WalletDefaultNameIndex';

var KEY_STORE_JSON_SCHEMA = 
{
    "type": "object",
    "required": ["address", "id", "version", "crypto"] ,
    "additionalProperties": false,
    "properties": {
      "address": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "version": {
        "type": "number"
      },
      "crypto": {
        "type": "object",
        "properties": {
          "cipher": {
            "type": "string"
          },
          "ciphertext": {
            "type": "string"
          },
          "cipherparams": {
            "type": "object",
            "properties": {
              "iv": {
                "type": "string"
              }
            }
          },
          "mac": {
            "type": "string"
          },
          "kdf": {
            "type": "string"
          },
          "kdfparams": {
            "type": "object",
            "properties": {
              "dklen": {
                "type": "number"
              },
              "n": {
                "type": "number"
              },
              "r": {
                "type": "number"
              },
              "p": {
                "type": "number"
              },
              "salt": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }


export default class WalletUtils {
    constructor() {}

    static OPEN_IMPORT_FROM_LAUNCH = 'open_import_from_launch';
    static OPEN_IMPORT_FROM_WALLET_MANAGER = 'open_import_from_wallet_manager';
    static OPEN_IMPORT_FROM_MODIFY_PASSWORD = 'open_import_from_modify_password';

    static isValidKeyStoreObj(jsonObj: Object) {
        var validate = ajv.compile(KEY_STORE_JSON_SCHEMA);
        return validate(jsonObj);
    }

    static isValidKeyStoreStr(walletStr: string) {
        try {
            let o = JSON.parse(walletStr.trim());
            return this.isValidKeyStoreObj(o);
        } catch(e) {
            return false;
        }
    }

    static isPasswordValid(password: string) {
        return /^[a-zA-Z0-9-\\:;()$&@\"\.,\?!'\[\]{}#%^*+=_|~<>€£¥•]{6,12}$/i.test(password);
    }

    static isNameValid(name: string) {
      return name && this.getLength(name) <= 40;
    }

    static getLength(str: string) {  
      var realLength = 0, len = str.length, charCode = -1;  
      for ( var i = 0; i < len; i++) {  
          charCode = str.charCodeAt(i);  
          if (charCode >= 0 && charCode <= 128)  
              realLength += 1;  
          else  
              realLength += 2;  
      }  
      return realLength;  
    }

    static isPrivateKeyValid(privateKey: string) {
        return privateKey && privateKey.length === 64 && privateKey.match(/^[0-9a-f]+$/i);
    }

    static getInnerError(errorMessage: string, defaultError: string = LVStrings.inner_common_error) {
        switch(errorMessage) {
            case knownFoundationErrors.passwordMismatch:
              return LVStrings.inner_error_password_mismatch;
            case knownFoundationErrors.passwordRequired:
              return LVStrings.inner_error_password_required;
            default: 
              return defaultError;
        }
    }

    static async getDefaultName() {
      let curIndex = await LVPersistent.getNumber(WalletDefaultNameIndexKey);
      curIndex = curIndex === 0 ? curIndex + 1 : curIndex;
      let defaultName = LVStrings.wallet_default_name_prefix + curIndex;
      await LVPersistent.setNumber(WalletDefaultNameIndexKey, curIndex + 1);
      return defaultName;
    }

    static log(msg: string) {
      if (__DEV__) {
          console.log('wallet ---> ' + msg);
      }
  }
}