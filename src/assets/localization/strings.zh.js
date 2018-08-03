//
// Localization - zh
//

const localized_strings = {
    app_name: '共生币钱包',

    // Major
    assets: '资产',
    receive: '收款',
    profile: '我的',
    alert_hint: '提示',
    transfer: '转账',

    // Common
    common_confirm: '确定',
    common_cancel: '取消',
    common_close: '关闭',
    alert_warning: '警告',
    alert_ok: '确定',
    common_done: '完成',
    common_delete: '删除',
    common_camera_not_authorized: '相机权限未开启',
    common_next: '下一步',
    common_open_ettings: '设置',
    common_copy: '复制',
    common_retry: '重试',
    common_continue: '继续',

    // Alerts
    alert_has_unfinished_transaction: '您目前尚有未完成交易，继续转账可能造成交易失败，是否继续操作？',

    //receive
    receive_title: '收款',
    receive_name: '钱包地址',
    receive_name_suffix: '的钱包',
    receive_copy: '复制钱包地址',
    receive_copy_success: '复制成功',
    receive_save: '保存二维码',
    receive_empty: '您还未添加钱包',
    receive_save_finish: '已保存到相册',

    // Wallet
    wallet_import: '导入',
    wallet_import_header: '导入钱包',
    wallet_import_keyStore: 'Keystore 导入',
    wallet_import_private_key: '导入私钥',
    wallet_import_plain_private_key_hint: '明文私钥',
    wallet_import_keystore_hint: 'Keystore 文本内容',
    wallet_import_private_password_lable: '设置密码',
    wallet_import_private_password_hint: '最少6位，可输入特殊字符',
    wallet_import_invalid_password_warning:'最少6位，可输入特殊字符',
    wallet_import_private_password_repeat_lable: '重复密码',
    wallet_import_private_pwd_confirm_hint: '重复输入你的密码',
    wallet_import_keystore_password_label: 'Keystore密码',
    wallet_import_keystore_password_hint: '请输入Keystore密码',
    wallet_importing_wallet: '导入钱包中...',
    wallet_import_private_key_error: '私钥格式错误',
    wallet_import_keystore_error: 'Keystore格式错误',
    wallet_import_keystore_or_pwd_empty: 'Keystore不能为空',
    wallet_import_private_key_required: '私钥不能为空！',
    wallet_import_success: '导入成功！',
    wallet_import_fail: '导入失败！',
    wallet_import_tip_keystore_password: 'Keystore密码',

    wallet_create_wallet: '创建钱包',
    wallet_create_hint_message: '请妥善保管您的密码！为了您的资产安全，共生钱包不存储用户密码，所以无法提供找回或重置功能',
    wallet_creating_wallet: '创建钱包中...',
    wallet_create_name: '钱包名称',
    wallet_create_password_label: '钱包密码',
    wallet_create_confirm_password_label: '确认密码',
    wallet_create_explaination: '该密码用来加密钱包地址，请尽量设置复杂密码完成加密',
    wallet_create_password: '最少6位，可输入特殊字符',
    wallet_create_password_verify: '重复输入密码',
    wallet_create_comment: '该密码用来加密钱包地址，请尽量设置复杂密码完成加密。',
    wallet_create: '创建',
    wallet_create_success: '创建成功！',
    wallet_create_name_required: '请输入钱包名称',
    wallet_create_password_required: '请输入密码',
    wallet_create_confimpassword_required: '请输入确认密码',
    wallet_create_password_mismatch: '两次输入的密码不一致',
    wallet_create_name_unavailable: '钱包名字已存在',
    wallet_create_success_comment: '请妥善保管您的密码！共生钱包不存储用户密码，无法提供找回或重置功能',
    wallet_backup: '备份钱包',
    wallet_backuping: '备份钱包中...',
    wallet_backup_failed: '备份钱包失败，请确认输入的密码是否正确',
    wallet_backup_title_suffix: '钱包备份',
    wallet_default_name_prefix: '默认钱包',

    wallet_disclaimer: '免责声明',
    wallet_disclaimer_content:
        '请确认已经导出的钱包备份的安全性，任何钱包的丢失、被盗、忘记密码等行为产生的损失均与平台无关',
    
    wallet_details: '钱包详情',

    // inner error
    inner_common_error: '内部错误',
    inner_error_password_required: '必须提供密码',
    inner_error_password_mismatch: '密码不匹配',

    //wallet edit
    wallet_edit_save_failed: '保存失败',
    wallet_edit_save_success: '保存成功',
    wallet_edit_cur_pwd_required: '当前密码密码不能为空',
    wallet_edit_cur_pwd_error: '当前密码不正确',
    wallet_edit_new_pwd_required: '新密码不能为空',
    wallet_edit_new_name_required: '名称不能为空',
    wallet_edit_password_same: '新旧密码不能相同',
    wallet_edit_equal_to_old: '名称跟原名称相同',
    wallet_editing: '正在修改中...',
    wallet_exporting: '正在导出中...',
    wallet_export_private_key_copied_to_clipboard: '私钥已经复制到剪切板',
    wallet_delete_hint: '确认删除该钱包？',
    wallet_delete_success: '删除钱包成功',
    wallet_password_incorrect: '密码错误',
    wallet_name_hint: '最多输入40位字符或20个汉字',
    wallet_name_invalid: '名称格式错误',
    wallet_name_exceeds_limit: '最多输入40位字符或20个汉字',
    wallet_detail: '详情',
    //password verify
    password_verify_title: '密码验证',
    password_verifying: '密码验证中...',
    password_verify_required: '密码不能为空',

    // total amount
    total_amount: '总金额',

    // Assets
    assets_title: '资产',
    recent_records: '最近交易记录',
    view_all_records: '查看全部记录',

    // Token List
    token_list_title: '添加币种',
    token_list_search_placeholder: '请输入币种名称',
    token_list_search_result_empty: '未找到相关Token',
    token_list_add_token: '进行添加',

    // Transaction record
    transaction_records: '交易记录',
    transaction_records_no_data: '暂无记录',
    transaction_records_time: '时间',
    transaction_records_to: '至',
    transaction_waiting: '等待中',
    transaction_failed: '交易失败',
    transaction_does_not_exist: '交易不存在',
    transaction_details: '交易详情',
    transaction_payer: '发款方',
    transaction_receiver: '收款方',
    transaction_minner_fee: '矿工费用',
    transaction_remarks: '备注',
    transaction_na: '无',
    transaction_block_number: '区块',
    transaction_hash: '交易号',
    transaction_time: '交易时间',
    transaction_failure_message: '转账失败，请合理配置矿工费。',
    transaction_does_not_exist_message: '交易不存在，矿工费退回原钱包。',
    transaction_check_progress: '查询交易进度',
    transaction_check_detail: '查看详情',

    // MinnerFeeDetail
    minnerfeedetail_title: '什么是矿工费',
    minnerfeedetail_content: '  在以太链上，任何人都可以读写数据，数据的读取是免费的，但写入数据需要支付一定的矿工费用，网络上的任何矿工都可以参与挖矿。同时由于挖矿需要消耗一定的算力和电力，因此这也是矿工费的由来。\n  在链上进行多笔转账时，请在前一笔转账完成（状态变为转账成功或转账失败）后再发起转账，否则可能会造成失败。',
    minnerfeedetail_transferFail: '转账失败的几种情况：',
    minnerfeedetail_title1: '1.矿工费用过低：',
    minnerfeedetail_content1: '  无矿工打包，转账失败，手续费退回，此时在交易记录中查询会显示交易不存在。',
    minnerfeedetail_title2: '2.矿工费用不足：',
    minnerfeedetail_content2: '  矿工已开始打包，打包过程中矿工费用已完全消耗（但尚未打包完成），此时交易记录中查询会显示交易失败。 ',
    minnerfeedetail_title3: '3.连续发起多笔转账：',
    minnerfeedetail_content3: '  在第一笔交易未完成时发起第二笔交易，若第一笔交易矿工费高于第二笔，则第二笔转账必定失败，且在交易记录中显示交易不存在；反之，第一笔交易失败。',

    // Transfer 转账
    transfer_lvt_insufficient: '您的LVTC余额不足，请充值！',
    transfer_lvt_and_eth_insufficient: '您的LVTC、ETH均不足，请充值！',
    transfer_eth_insufficient: '您的ETH余额不足，请充值！',
    transfer_amount_insufficient: '您的余额不足，请充值',
    transfer_insufficient: '您的钱包余额不足，无法完成转账，请转账至此钱包',
    transfer_address_required: '收款人地址不能为空',
    transfer_address_invalid: '请输入有效的收款人地址',
    transfer_amount_required: '转账金额不能为空',
    transfer_amount_format_hint: '转账金额必须为大于零的数字',
    transfer_gas_format_hint: 'Gas值必须为大于零的数字',
    transfer_gasprice_format_hint: 'GasPrice值必须为大于零的数字',
    transfer_miner_gap_not_access: '未获取相应矿工费数值，请检查网络',
    transfer_processing: '正在转账中...',
    transfer_success: '转账成功',
    transfer_fail: '转账失败',
    transfer_minner_fee_fail: '您当前的矿工费较低，可能会转账失败',
    transfer_to_self_not_allowed: '不能给自己账户转账',

    // Profile
    profile_wallet_manager: '钱包管理',
    profile_trading_record: '交易记录',
    profile_contacts: '联系人',
    profile_feedback: '问题反馈',
    profile_setting: '系统信息',
    profile_about: '关于我们',
    profile_version: '当前版本',

    //Profile wallet manager
    profile_wallet_management: '钱包管理',
    profile_wallet_title: '傲游LivesToken',
    profile_wallet_modify_name: '修改钱包名称',
    profile_wallet_name: '钱包名称',
    profile_wallet_new_name: '新的名称',
    profile_wallet_modify_password: '修改密码',
    profile_wallet_cur_password: '当前密码',
    profile_wallet_new_password: '新密码',
    profile_wallet_password_confirm: '重复密码',
    profile_wallet_password_hint: '忘记密码? 导入私钥可以重置密码。',
    profile_wallet_import_right_now: '马上导入',
    profile_wallet_export: '导出私钥',
    profile_wallet_backup: '备份Keystore',
    profile_wallet_backup_later: '稍后备份',
    profile_wallet_delete_wallet: '删除钱包',
    profile_wallet_save: '保存',
    profile_wallet_my_private_key: '我的私钥',
    profile_wallet_export_warnning: '警告，私钥未经加密，导出存在风险，建议使用Keystore备份',
    prifile_wallet_export_copy_key: '复制私钥',

    // Date Time
    time_pass_a_moment_ago: '刚刚',
    time_pass_minutes_ago: '分钟前',
    time_pass_hours_ago: '小时前',
    time_pass_days_ago: '天前',
    time_pass_months_ago: '个月前',
    time_pass_years_ago: '年前',
    time_pass_yesterday: '昨天',

    // App Guide Message
    guide_master_1: '安全可靠',
    guide_detail_1: '所 有 密 码 隔 离 网 络',
    guide_master_2: '流程简单',
    guide_detail_2: '钱 包 导 入 直 接 使 用',
    guide_master_3: '结构清晰',
    guide_detail_3: '账 目 记 录 一 目 了 然',
    guide_button_title: '立即体验',

    // Transfer
    transfer_title: '转账',
    transfer_purse_balance: '余额',
    transfer_payee_address: '收款人地址',
    transfer_amount: '转账金额',
    transfer_remarks: '备注',
    transfer_miner_tips: '矿工费用',
    transfer_slow: '慢',
    transfer_fast: '快',
    transfer_advanced: '高级',
    transfer_advanced_gas: '请输入gas',
    transfer_advanced_gas_price: '请输入gas price（单位：gwei）',
    transfer_advanced_gas_price_overLimit: '建议输入100以内的gwei',
    transfer_advanced_gas_data: '请输入data参数（可选）',
    transfer_current_eth: '当前钱包ETH',
    transfer_hint: '执行交易后将扣除您当前钱包中的ETH, 交易打包后, 矿工费用将不予退还.',
    transfer_payment_details: '支付详情',
    transfer_address_in: '转入地址',

    // qr scan
    qrScan_title: '扫一扫',
    qrScan_hint: '将钱包二维码放入方框内扫描',

    //contacts
    contact_list_nav_title: '联系人',
    contact_add_nav_title: '添加联系人',
    contact_edit_nav_title: '编辑联系人',
    contact_add_place_holder_nickname: '请输入联系人昵称',
    contact_add_place_holder_address: '请输入钱包地址',
    contact_add_place_holder_cellphone: '请输入电话',
    contact_add_place_holder_email: '请输入邮箱',
    contact_add_place_holder_remarks: '备注',
    contact_alert_name_required: '名字不能为空',
    contact_alert_address_required: '钱包地址不能为空',
    contact_alert_address_invalid: '钱包地址格式错误',
    contact_alert_contact_exists: '联系人已存在',
    contact_alert_name_exceeds_limit: '联系人名称超过20个字',
    contact_alert_remarks_exceeds_limit: '备注长度超过限制',
    contact_alert_Email_invalid: '邮箱格式错误',
    contact_alert_Phone_invalid: '电话格式错误',
    contact_confirm_delete_contact: '是否要删除',
    contact_empty_list_demonstration: '您还未添加联系人',
    contact_add_nav_right: '添加',
    contact_add_place_nickname: '昵称',
    contact_add_place_address: '钱包地址',
    contact_add_place_cellphone: '电话',
    contact_add_place_email: '邮箱',
    contact_add_remarks: '备注',
    contact_Detail_Button: '账户转账',
    contact_Search_Empty_Button: '未找到此联系人',
    contact_Detail_Title: '的钱包',

    // Network
    network_error: '网络请求失败，请重试!',
    network_error_network_lost: '网络未连接，请重试!',
    network_timeout: '网络超时',

    // WebView
    webview_connection_failed: '连接失败',

    // exit
    exit_app_prompt: '退出钱包？',
    exit: '退出',

    // total title
    total_lvt: 'LVTC 总额',
    total_eth: 'ETH 总额',
    total_amount: '总额',
    show_detail_amount: '交易金额',
    show_LVT_balance: 'LVTC 余额',

    // over 18 limit
    over_limit_hint: '转账金额仅支持小数点后18位',

    //update
    update_title: '更新提醒',
    update_text: '发现新版本,快去体验吧!',
    update_ok: '立即更新',
    update_cancel: '以后再说',
    update_download_tip: '后台下载最新的版本',

    // Permissions
    can_not_access_camera: '无法访问相机',
    please_set_camera_author: '请到系统的⌜隐私设置⌟中，允许 共生钱包 访问⌜相机⌟',


    // Auth
    auth_wake_text : '点击唤醒验证',
    auth_verifing : '正在验证中...',
    auth_use_password : '使用钱包密码登录',
    auth_use_face_id : '面容ID解锁',
    auth_use_finger : '指纹解锁',
    auth_mine_use_password : '密码解锁',
    auth_do_start_auth : "是否开启登录验证",
    auth_dialog_cancel : "稍后开启",
};

export default localized_strings;
