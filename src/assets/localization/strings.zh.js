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

    //receive
    receive_title:'我的收款码',
    receive_name:'钱包地址',
    receive_copy:'复制地址',
    receive_save:'保存二维码',
    receive_empty:'您还未添加钱包',
    
    // Wallet
    wallet_import: '导入',
    wallet_import_header: '导入钱包',
    wallet_import_keyStore: 'Keystore 导入',
    wallet_import_private_key: '导入私钥',
    wallet_import_plain_private_key_hint: '明文私钥',
    wallet_import_keystore_hint: 'Keystore 文本内容',
    wallet_import_private_password_hint: '输入6~12位字母数字组合',
    wallet_import_private_pwd_confirm_hint: '重复输入你的密码',
    wallet_import_keystore_password_hint: '请输入Keystore密码',
    wallet_importing_wallet: '导入钱包中...',
    wallet_import_private_key_error: '私钥格式错误',
    wallet_import_keystore_error: 'Keystore格式错误',
    wallet_import_keystore_or_pwd_empty: 'Keysotre或者密码不能为空！',
    wallet_import_private_key_required: '私钥不能为空！',
    wallet_import_success: '导入成功！',
    wallet_import_fail: '导入失败！',
    
    wallet_import_success: '',
    wallet_create_wallet: '创建钱包',
    wallet_creating_wallet: '创建钱包中...',
    wallet_create_name: '钱包名称',
    wallet_create_password: '设置钱包密码（6-12位字母数字组合）',
    wallet_create_password_verify: '重复输入密码',
    wallet_create_comment: '该密码用来加密钱包地址，请尽量设置复杂密码完成加密。',
    wallet_create: '创建',
    wallet_create_sucess: '创建成功！',
    wallet_create_name_required: '请输入钱包名称',
    wallet_create_password_required: '请输入密码',
    wallet_create_confimpassword_required: '请输入确认密码',
    wallet_create_password_mismatch: '密码与确认密码不匹配',
    wallet_create_name_unavailable: '钱包名字不可用',
    wallet_create_success_comment: '平台不储存用户的私人密码，密码无法找回或重置，强烈建议您在使用钱包前做好钱包备份！',
    wallet_backup: '备份钱包',

    // Assets
    assets_title: '我的资产',
    recent_records: '最近交易记录',
    view_all_records: '查看全部记录',

    // Transaction record
    transaction_records: '交易记录',
    transaction_records_no_data: '暂无交易',
    transaction_records_time: '时间',
    transaction_records_to: '至',
    transaction_waiting: '等待中',
    transaction_details: '交易详情',
    transaction_payer: '发款方',
    transaction_receiver: '收款方',
    transaction_minner_fee: '矿工费用',
    transaction_remarks: '备注',
    transaction_na: '无',
    transaction_block_number: '区块',
    transaction_hash: '交易号',
    transaction_time: '交易时间',
    transaction_failure_message: '该交易无人打包，已失败。矿工费退回原钱包。',

    // Transfer 转账
    transfer_eth_insufficient: '您的钱包ETH不足，无法完成转账，请转账ETH至此钱包', 

    // Profile
    profile_wallet_manager: '钱包管理',
    profile_trading_record: '交易记录',
    profile_contacts: '联系人',
    profile_feedback: '问题反馈',
    profile_setting: '系统信息',
    profile_about: '关于我们',

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
    transfer_title: '傲游LivesToken-转账',
    transfer_purse_balance: '余额',
    transfer_payee_address: '收款人地址',
    transfer_amount: '转账金额',
    transfer_remarks: '备注',
    transfer_miner_tips: '矿工费用',
    transfer_slow: '慢',
    transfer_fast: '快',
    transfer_current_eth: '当前钱包ETH',
    transfer_hint: '执行交易将扣除您当前钱包中的ETH。该交易可执行，交易成功后，将扣除矿工费用。',
    transfer_payment_details: '支付详情',
    transfer_address_in: '转入地址',
    
    // qr scan
    qrScan_title: '扫一扫',
    qrScan_hint: '将钱包二维码放入方框内扫描',

    //contacts
    contact_list_nav_title: '联系人',
    contact_add_nav_title: '添加联系人',
    contact_edit_nav_title: '编辑联系人',
    contact_add_place_holder_nickname: '联系人昵称',
    contact_add_place_holder_address: '钱包地址',
    contact_add_place_holder_cellphone: '手机号码',
    contact_add_place_holder_email: '邮箱',
    contact_add_place_holder_remarks: '备注',
    contact_alert_name_required: '名字不能为空',
    contact_alert_address_required: '钱包地址不能为空',
    contact_alert_address_invalid: '钱包地址格式错误',
    contact_alert_contact_exists: '联系人已存在'
};

export default localized_strings;