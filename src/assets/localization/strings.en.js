//
// Localization - en
//

const localized_strings = {
    app_name: 'Lives Wallet',

    // Major
    assets: 'Assets',
    receive: 'Receive',
    profile: 'My',
    transfer: 'Transfer',

    // Common
    common_confirm: 'Confirm',
    common_cancel: 'Cancel',
    common_close: 'Close',
    alert_warning: 'Warning',
    alert_hint: 'Hint',
    alert_ok: 'Ok',
    common_done: 'Done',
    common_delete: 'Delete',
    common_camera_not_authorized: 'Camera not authorized',

    //receive
    receive_title:'My wallet QR code',
    receive_name:'Wallet address',
    receive_copy:'Copy the address',
    receive_save:'Save the QR code',
    receive_empty:'You haven’t add a wallet yet',
    receive_save_finish:'Completed',

    // inner error
    inner_common_error: 'Inner error',
    inner_error_password_required: 'Password required',
    inner_error_password_mismatch: 'Password mismatch',
    
    // Wallet
    wallet_import: 'Import',
    wallet_import_header: 'Import wallet',
    wallet_import_keyStore: 'Import Keystore',
    wallet_import_private_key: 'Import private key',
    wallet_import_plain_private_key_hint: 'Private key plaintext',
    wallet_import_keystore_hint: 'Keystore text content',
    wallet_import_private_password_hint: 'Enter 6~12 digit of letters + numbers',
    wallet_import_private_pwd_confirm_hint: 'Confirm password',
    wallet_import_keystore_password_hint: 'Enter Keystore password',
    wallet_importing_wallet: 'Importing wallet...',
    wallet_import_private_key_error: 'Private key format error',
    wallet_import_keystore_error: 'Keystore format error',
    wallet_import_keystore_or_pwd_empty: 'Keystore or password can\'t be empty',
    wallet_import_private_key_required: 'Private key is required',
    wallet_import_success: 'Import succeed!',
    wallet_import_fail: 'Import failed!',
    wallet_password_incorrect: 'Incorrect password',
    wallet_name_hint: 'Enter name (less than 40 digits)',
    wallet_name_invalid: 'Incorrect name format',
    wallet_name_exceeds_limit: 'Wallet name is more than 40 digits',

    wallet_create_wallet: 'Create wallet',
    wallet_creating_wallet: 'Creating wallet...',
    wallet_create_name: 'Wallet name',
    wallet_create_password: 'Password (6~12 letters/numbers)',
    wallet_create_password_verify: 'Confirm password',
    wallet_create_comment: 'The password is used to encrypt the wallet address, please try to make it complex',
    wallet_create: 'Create',
    wallet_create_name_required: 'Please enter wallet name',
    wallet_create_password_required: 'Please enter password',
    wallet_create_confimpassword_required: 'Confirm your password',
    wallet_create_password_mismatch: 'Passwords mismatch',
    wallet_create_name_unavailable: 'The name is unavailable',
    wallet_create_success: 'Successfully created!',
    wallet_create_success_comment: 'The platform does not store any user\'s password, so your password can not be retrieved or reset. It is highly recommended that you make a backup before using your wallet!',
    wallet_backup: 'Back up your wallet',
    wallet_backup_title_suffix: 'Wallet backup',
    wallet_default_name_prefix: "Default wallet ",
    wallet_backup_failed: 'Back up failed, please make sure you entered the correct password',
    wallet_backuping: 'Backing up wallet...',
    wallet_disclaimer: 'Disclaimer',
    wallet_disclaimer_content: 'Please make sure to keep your wallet backup safe. All losses due to wallet’s lost, stolen, and password forgotten have nothing to do with the platform.',

    //wallet edit
    wallet_edit_save_failed: 'Failed to save!',
    wallet_edit_save_success: 'Successfully saved!',
    wallet_edit_cur_pwd_required : 'Password is required',
    wallet_edit_cur_pwd_error : 'Incorrect password',
    wallet_edit_new_pwd_required : 'New password is required',
    wallet_edit_new_name_required : 'Name is required',
    wallet_edit_equal_to_old : 'New name is the same with the old one',
    wallet_editing : 'In editing process...',
    wallet_edit_password_same: 'New passward has to be different',
    wallet_exporting : 'Exporting wallet...',
    wallet_export_private_key_copied_to_clipboard: 'The private key has been copied to the clipboard',
    wallet_delete_hint: 'Are your sure to delete the wallet?',
    wallet_delete_success: 'Successfully deleted',

    //password verify
    password_verify_title: 'Verify password',
    password_verifying: 'Verifying password...',
    password_verify_required: 'Password is required',

    // Assets
    assets_title: 'My assets',
    recent_records: 'Recent transaction records',
    view_all_records: 'All records',

    // total amount
    total_amount: 'Total amount',

    // Transaction record
    transaction_records: 'Transaction records',
    transaction_records_no_data: 'No transactions',
    transaction_records_time: 'Time',
    transaction_records_to: 'to',
    transaction_waiting: 'In process',
    transaction_failed: 'Transaction failed',
    transaction_details: 'Transaction details',
    transaction_payer: 'Payer',
    transaction_receiver: 'Receiver',
    transaction_minner_fee: 'Miner fee',
    transaction_remarks: 'Remarks',
    transaction_na: 'N/A',
    transaction_block_number: 'Blocks',
    transaction_hash: 'Transaction number',
    transaction_time: 'Transaction time',
    transaction_failure_message: 'The transaction failed due to no packers. Miner fee will be returned to the original wallet.',
    
    // Transfer 转账
    transfer_lvt_insufficient:'Your LVT balance is insufficient. Please recharge.',
    transfer_lvt_and_eth_insufficient:'Your LVT and ETH balance are insufficient. Please recharge.',
    transfer_amount_insufficient: 'Your balance is insufficient. Please recharge',
    transfer_eth_insufficient:'Your ETH balance is insufficient. Please recharge.',
    transfer_insufficient: 'The transaction failed due to insufficient balance in your wallet. Please transfer to your wallet first.', 
    transfer_address_required: 'Address required',
    transfer_address_invalid: 'Invalid address',
    transfer_amount_required: 'Transfer amount is required',
    transfer_amount_format_hint: 'Amount should be a positive number',
    transfer_miner_gap_not_access: 'Can\'t obtain exact value of miner fee, please check your network',
    transfer_processing: 'Transfer processing...',
    transfer_success: 'Transfer succeed',
    transfer_fail: 'Transfer failed',
    transfer_to_self_not_allowed: 'transfer to self is not allowed',
    
    // Profile
    profile_wallet_manager: 'Wallet management',
    profile_trading_record: 'Transaction records',
    profile_contacts: 'Contacts',
    profile_feedback: 'Feedback',
    profile_setting: 'System info',
    profile_about: 'About',
    profile_version: 'Version',

    //Profile wallet manager
    profile_wallet_management: 'Wallet management',
    profile_wallet_title: 'Maxthon LivesToken',
    profile_wallet_modify_name: 'Change wallet name',
    profile_wallet_name: 'Wallet name',
    profile_wallet_new_name: 'New wallet name',
    profile_wallet_modify_password: 'Change password',
    profile_wallet_cur_password: 'Current password',
    profile_wallet_new_password: 'New password',
    profile_wallet_password_confirm: 'Confirm password',
    profile_wallet_password_hint: 'Forgot your password? Import your private key to reset it.',
    profile_wallet_import_right_now: 'Import now',
    profile_wallet_export: 'Export private key',
    profile_wallet_backup: 'Back up keystore',
    profile_wallet_delete_wallet: 'Delete wallet',
    profile_wallet_save: 'Save',
    profile_wallet_my_private_key: 'My private key',
    profile_wallet_export_warnning: 'Warning: The private key is not encrypted. We suggest you to back up it using Keystore.',
    prifile_wallet_export_copy_key: 'Copy private key',

    // Date Time
    time_pass_a_moment_ago: 'Just now',
    time_pass_minutes_ago: 'Minutes ago',
    time_pass_hours_ago: 'Hours ago',
    time_pass_days_ago: 'Days ago',
    time_pass_months_ago: 'Months ago',
    time_pass_years_ago: 'Years ago',
    time_pass_yesterday: 'Yesterday',

    // Transfer
    transfer_title: 'Transfer',
    transfer_purse_balance: 'Balance',
    transfer_payee_address: 'Receiver’s wallet address',
    transfer_amount: 'Transfer amount',
    transfer_remarks: 'Remarks',
    transfer_miner_tips: 'Miner fee',
    transfer_slow: 'Slow',
    transfer_fast: 'Fast',
    transfer_current_eth: 'Current wallet\'s ETH',
    transfer_hint: 'Execute transaction will deduct ETH from your current wallet. The miner fee will be deducted after the transaction succeed.',
    transfer_payment_details: 'Payment details',
    transfer_address_in: 'Receiver’s wallet address',
    
    // App Guide Message
    guide_button_title: 'Enter now',
    guide_master_1: 'Safe and reliable',
    guide_detail_1: 'All your passwords are isolated from the Internet',
    guide_master_2: 'Simple process',
    guide_detail_2: 'Import other wallet and use it directly',
    guide_master_3: 'Clear Structure',
    guide_detail_3: 'Know your transaction records at a glance',
    guide_button_title: 'Enter now',

    // qr scan
    qrScan_title: 'Scan QR code',
    qrScan_hint: 'Align the QR code within the frame to scan',

    //contacts
    contact_list_nav_title: 'Contacts',
    contact_add_nav_title: 'Add Contact',
    contact_edit_nav_title: 'Edit Contacts',
    contact_add_place_holder_nickname: 'Contact\'s nickname',
    contact_add_place_holder_address: 'Wallet address',
    contact_add_place_holder_cellphone: 'Mobile phone number',
    contact_add_place_holder_email: 'Email address',
    contact_add_place_holder_remarks: 'Remarks',
    contact_alert_name_required: 'Name is required',
    contact_alert_address_required: 'Wallet address is required',
    contact_alert_address_invalid: 'Incorrect wallet address format',
    contact_alert_contact_exists: 'Contact already exists',
    contact_alert_name_exceeds_limit: 'Contact\'s name is more than 40 digits',
    contact_alert_remarks_exceeds_limit: 'Remark length exceeds limit',
    contact_confirm_delete_contact: 'Are you sure to delete this contact?',
    contact_empty_list_demonstration: 'You haven\'t added any contact yet',

    // Network
    network_error: 'Network request failed, please try again!',
    network_error_network_lost: 'Your network is not connected, please try again!',
    network_timeout: 'Network timeout',

    // exit
    exit_app_prompt: "Exit App?",
    exit: "Exit",

    // total title
    total_lvt: 'Total LVT Amount',
    total_eth: 'Total ETH Amount',
    show_detail_amount: 'Transaction Amount',
    show_LVT_balance: 'LVT Balance',

    // over 18 limit
    over_limit_hint: 'Transfer Amount Only Support 18 Decimal Places',
};

export default localized_strings;
