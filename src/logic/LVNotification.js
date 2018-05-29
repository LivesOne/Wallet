/*
 * Project: Venus
 * File: src/logic/LVNotification.js
 * @flow
 */
'use strict';

export default class LVNotification {
    static walletChanged = 'lv_notification_wallet_changed';
    static balanceChanged = 'lv_notification_balance_changed';
    static walletImported = 'lv_notification_import_wallet_imported';
    static walletsNumberChanged = 'lv_notification_wallets_number_changed'
    static transcationCreated = 'lv_notification_transaction_created';
    static networkStatusChanged = 'lv_notification_network_status_changed';
}