//@flow
'use strict'

var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

var WALLET_JSON_SCHEMA = 
{
    "type": "object",
    "additionalProperties": false,
    "required": ["name", "keystore", "address", "balance"] ,
    "properties": {
      "name": {
        "type": "string"
      },
      "keystore": {
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
      },
      "address": {
        "type": "string"
      },
      "balance": {
        "type": "number"
      }
    }
  }


export default class WalletUtils {
    constructor() {}

    static OPEN_IMPORT_FROM_LAUNCH = 'open_import_from_launch';
    static OPEN_IMPORT_FROM_WALLET_MANAGER = 'open_import_from_wallet_manager';
    static OPEN_IMPORT_FROM_MODIFY_PASSWORD = 'open_import_from_modify_password';

    static isValidWalletObj(jsonObj: Object) {
        var validate = ajv.compile(WALLET_JSON_SCHEMA);
        return validate(jsonObj);
    }

    static isValidWalletStr(walletStr: string) {
        try {
            let o = JSON.parse(walletStr);
            return this.isValidWalletObj(o);
        } catch(e) {
            return false;
        }
    }

    static isPasswordValid(password: string) {
        return /(\d|\w){6,12}/i.test(password);
    }

    static isPrivateKeyValid(privateKey: string) {
        return true;
    }
}