//
// Localization - en
//

const localized_strings = {
    app_name: 'Venus',

    // Major
    assets: 'Assets',
    receive: 'Receive',
    profile: 'Profile',
    transfer: 'Transfer',

    // Common
    common_confirm: 'Confirm',
    common_cancel: 'Cancel',
    common_close: 'Close',
    alert_warning: 'Warning',
    alert_hint: 'hint',
    alert_ok: 'Ok',
    common_done: 'Done',
    common_delete: 'Delete',

    //receive
    receive_title:'My payment QR code',
    receive_name:'Wallet address',
    receive_copy:'Copy the address',
    receive_save:'Save the QR code',
    receive_empty:'You haven’t add a wallet yet',

    // Wallet
    wallet_import: 'Import',
    wallet_import_header: 'Import wallet',
    wallet_import_keyStore: 'Import by keystore',
    wallet_import_private_key: 'Import by private key',
    wallet_import_plain_private_key_hint: 'Plain private key',
    wallet_import_keystore_hint: 'Keystore content',
    wallet_import_private_password_hint: 'Enter 6 to 12 alphanumeric groups',
    wallet_import_private_pwd_confirm_hint: 'Confirm password',
    wallet_import_keystore_password_hint: 'Enter keystore password',
    wallet_importing_wallet: 'Importing wallet...',
    wallet_import_private_key_error: 'Private key format error',
    wallet_import_keystore_error: 'Keystore format error',
    wallet_import_keystore_or_pwd_empty: 'Keysotre or password can\'t be empty',
    wallet_import_private_key_required: 'Private key is required',
    wallet_import_success: 'Import success!',
    wallet_import_fail: 'Import failed',

    wallet_create_wallet: 'Create wallet',
    wallet_creating_wallet: 'Creating wallet...',
    wallet_create_name: 'Wallet name',
    wallet_create_password: 'Set the wallet password (6-12 alphanumeric combination)',
    wallet_create_password_verify: 'Repeat the password',
    wallet_create_comment: 'This password is used to encrypt the wallet address, please try to set the complex password to complete the encryption.',
    wallet_create: 'Create',
    wallet_create_name_required: 'Please enter wallet name',
    wallet_create_password_required: 'Please enter password',
    wallet_create_confimpassword_required: 'Please enter confirmation password',
    wallet_create_password_mismatch: 'Password and confirmation password mismatch',
    wallet_create_name_unavailable: 'The name input is unavailable',
    wallet_create_success: 'Create success!',
    wallet_create_success_comment: 'The platform does not store the user\'s password, the password can not be retrieved or reset, it is highly recommended that you make a backup before using your wallet!',
    wallet_backup: 'Backup wallet',
    wallet_backup_title_suffix: 'wallet backup',
    wallet_default_name_prefix: "default wallet ",

    wallet_disclaimer: 'Disclaimer',
    wallet_disclaimer_content: 'Please make sure to keep your wallet backup safe. All losses due to wallet’s lost, stolen, and password forgotten have nothing to do with the platform.',

    //wallet edit
    wallet_edit_save_failed: 'Save failed!',
    wallet_edit_cur_pwd_required : 'current password required',
    wallet_edit_cur_pwd_error : 'current password error',
    wallet_edit_new_pwd_required : 'new password required',
    wallet_edit_new_name_required : 'new name required',
    wallet_edit_equal_to_old : 'new name is equal to the old',
    wallet_editing : 'wallet editing...',
    wallet_exporting : 'wallet exporting...',
    wallet_export_private_key_copied_to_clipboard: 'The private key has been copied to the clipboard',
    wallet_delete_hint: 'Are your sure to delete the wallet?',
    wallet_delete_success: 'Delete success',

    // Assets
    assets_title: 'My assets',
    recent_records: 'Recent records',
    view_all_records: 'All records',

    // Transaction record
    transaction_records: 'Transaction record',
    transaction_records_no_data: 'No transactions',
    transaction_records_time: 'Date',
    transaction_records_to: 'to',
    transaction_waiting: 'Please wait',
    transaction_details: 'Transaction details',
    transaction_payer: 'Paye',
    transaction_receiver: 'Receiver',
    transaction_minner_fee: 'Miner fee',
    transaction_remarks: 'Remarks',
    transaction_na: 'N/A',
    transaction_block_number: 'Blocks',
    transaction_hash: 'Transaction number',
    transaction_time: 'Transaction time',
    transaction_failure_message: 'No one packs the transaction so it was failed. Miner fee will be returned to the original wallet.',
    
    // Transfer 转账
    transfer_eth_insufficient: '您的钱包ETH不足，无法完成转账，请转账ETH至此钱包', 
    transfer_address_required: 'Address required',
    transfer_address_invalid: 'Invalid address',
    transfer_amount_required: 'Transfer amount required',
    
    // Profile
    profile_wallet_manager: 'Wallet manager',
    profile_trading_record: 'Trading record',
    profile_contacts: 'Contacts',
    profile_feedback: 'Feedback',
    profile_setting: 'System info',
    profile_about: 'About',

    //Profile wallet manager
    profile_wallet_management: 'Wallet Management',
    profile_wallet_title: 'Maxthon LivesToken',
    profile_wallet_modify_name: 'Modify wallet name',
    profile_wallet_name: 'Wallet name',
    profile_wallet_new_name: 'New wallet name',
    profile_wallet_modify_password: 'Modify password',
    profile_wallet_cur_password: 'Current password',
    profile_wallet_new_password: 'New password',
    profile_wallet_password_confirm: 'Confirm password',
    profile_wallet_password_hint: 'Forgot password? reset it by importing private key.',
    profile_wallet_import_right_now: 'Import right now',
    profile_wallet_export: 'Export private key',
    profile_wallet_backup: 'Backup keystore',
    profile_wallet_delete_wallet: 'Delete wallet',
    profile_wallet_save: 'Save',
    profile_wallet_my_private_key: 'My private key',
    profile_wallet_export_warnning: 'Warnning, the unencrypted private key can be risky when exported, it is recommended to use keystore to backup',
    prifile_wallet_export_copy_key: 'Copy private key',

    // Date Time
    time_pass_a_moment_ago: 'a moment ago',
    time_pass_minutes_ago: 'minutes ago',
    time_pass_hours_ago: 'hours ago',
    time_pass_days_ago: 'days ago',
    time_pass_months_ago: 'months ago',
    time_pass_years_ago: 'years ago',
    time_pass_yesterday: 'yesterday',

    // Transfer
    transfer_title: 'Maxthon LivesToken-Transfer',
    transfer_purse_balance: 'Balance',
    transfer_payee_address: 'Payee address',
    transfer_amount: 'Transfer amount',
    transfer_remarks: 'Remarks',
    transfer_miner_tips: 'Miner tips',
    transfer_slow: 'Slow',
    transfer_fast: 'Fast',
    transfer_current_eth: 'Current wallet ETH',
    transfer_hint: 'The transaction will be deducted from your current wallet ETH. The transaction is executable，and will deduct the cost of miners after success.',
    transfer_payment_details: 'Payment details',
    transfer_address_in: 'Transfer-in address',
    
    // App Guide Message
    guide_button_title: 'Enter',
    guide_master_1: 'Safe and Reliable',
    guide_detail_1: 'All your passwords are isolated from the Internet',
    guide_master_2: 'Simple Process',
    guide_detail_2: 'You can import other wallet and use it directly',
    guide_master_3: 'Clear Structure',
    guide_detail_3: 'Know your accounting records at a glance',
    guide_button_title: 'Enter',

    // qr scan
    qrScan_title: 'Scan',
    qrScan_hint: 'Place the wallet qrCode into the box to scan',

    //contacts
    contact_list_nav_title: 'Contacts',
    contact_add_nav_title: 'Add Contact',
    contact_edit_nav_title: 'Edit Contact',
    contact_add_place_holder_nickname: 'Nick name',
    contact_add_place_holder_address: 'Address',
    contact_add_place_holder_cellphone: 'Cellphone number',
    contact_add_place_holder_email: 'Email',
    contact_add_place_holder_remarks: 'Remarks',
    contact_alert_name_required: 'Name is required',
    contact_alert_address_required: 'Address is required',
    contact_alert_address_invalid: 'Wrong address format',
    contact_alert_contact_exists: 'Contact already exists',
    contact_confirm_delete_contact: 'Are you sure to delete this contact?'
};

export default localized_strings;
