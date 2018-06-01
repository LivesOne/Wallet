//@flow
'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Platform,
    ActionSheetIOS,
    Share,
    ActivityIndicator,
    Keyboard,
    StatusBar
} from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import LVSize from '../../../styles/LVFontSize';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import MXButton from './../../../components/MXButton';
import MXCrossTextInput from '../../../components/MXCrossTextInput';
import LVStrings from '../../../assets/localization';
import { WalletExportModal } from './WalletExportModal';
import LVWalletManager from '../../../logic/LVWalletManager';
import {  adjust } from '../../../utils/MXStringUtils';
import LVLoadingToast from '../../Common/LVLoadingToast';
import Toast from 'react-native-root-toast';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
import LVDialog, { LVConfirmDialog } from '../../Common/LVDialog';
import console from 'console-browserify';
import { LVPasswordDialog } from '../../Common/LVPasswordDialog';
import WalletUtils from '../../Wallet/WalletUtils';
import { backupWallet } from '../../../utils/MXUtils';
import * as MXUtils from "../../../utils/MXUtils";
import LVWalletHeader from '../../Common/LVWalletHeader';
import LVColor from '../../../styles/LVColor';

const IconWalletModifyName = require('../../../assets/images/wallet_modify_name.png');
const IconWalletModifyPwd = require('../../../assets/images/wallet_modify_pwd.png');
const IconWalletExportPK = require('../../../assets/images/wallet_export_pk.png');
const IconShowDetailArrow = require('../../../assets/images/show_detail_arrow.png');
const IconWallet = require('../../../assets/images/wallet_grey.png');
const IconBack = require('../../../assets/images/back_grey.png');

const CellVariant = props => (
    <Cell
        {...props}
        cellContentView={
            <View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', paddingVertical: 10 }}>
                <Image source={props.source} />
                <Text numberOfLines={1} style={{ flex: 1, fontSize: 16, marginLeft: 10, color: '#677384' }}>
                    {props.title}
                </Text>
                <Image source={IconShowDetailArrow} />
            </View>
        }
        highlightActiveOpacity={0.8}
        highlightUnderlayColor={'grey'}
        onPress={props.onPress}
        contentContainerStyle={{ height: 55 }}
    />
);

const SHOW_INPUT_FOR_EXPORT = 'for_export';
const SHOW_INPUT_FOR_DELETE = 'for_delete';
const SHOW_INPUT_FOR_BACKUP = 'for_backup';

type State = {
    displayTitle: string,
    walletAddress: string,
    showExportModal: boolean,
    privateKey: string,
    walletName: string,
    wallet: ?Object,
    walletTitle: string,
    showExportModal: boolean,
    alertMessage: string,
    showInputFor: string
};

type Props = {
    navigation: Object
};

export class WalletDetailsPage extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    onWalletBackup: Function;

    constructor() {
        super();
        this.state = {
            displayTitle: '',
            wallet: null,
            walletTitle: '',
            walletAddress: '',
            privateKey: '',
            showExportModal: false,
            walletName: '',
            alertMessage: '',
            showInputFor: ''
        };
        this.onWalletBackup = this.onWalletBackup.bind(this);
    }

    componentWillMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChanged.bind(this));
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const wallet = params.wallet;
        this.setState({
            wallet: wallet,
            displayTitle: adjust(wallet.lvt, wallet.eth),
            walletAddress: wallet.address,
            walletName: wallet.name
        });
    }

    async handleWalletChanged() {
        const wallet = await LVWalletManager.findWalletWithAddress(this.state.walletAddress);
        if (wallet) {
            console.log('new wallet = ' + JSON.stringify(wallet));
            this.setState({
                wallet: wallet,
                displayTitle: adjust(wallet.lvt, wallet.eth),
                walletName: wallet.name
            });
        }
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObserver(this);
    }

    showExportModal(password:string) {
        if (Platform.OS === 'android') {
            this.refs.toast.show();
        }
        setTimeout(async () => {
            if (Platform.OS === 'ios') {
                this.refs.toast.show();
            }
            const wallet = this.state.wallet;
            try {
                let privateKey = await LVWalletManager.exportPrivateKey(wallet, password);
                this.refs.toast.dismiss();
                setTimeout(() => {
                    this.setState({ 
                        privateKey: privateKey,
                        showExportModal: true
                    });
                }, 500);
            } catch (error) {
                WalletUtils.log(error);
            }
        }, 500);
    }

    onExportModalClosed() {
        this.setState({ showExportModal: false });
    }

    onPressExportOrDeleteButton(showFor: string) {
        this.setState({ showInputFor: showFor });
        this.refs.passwordConfirm.show();
    }

    async onDeleteWallet() {
        const { walletAddress } = this.state;
        await LVWalletManager.deleteWallet(walletAddress);
        await LVWalletManager.saveToDisk();

        const { callback } = this.props.navigation.state.params;
        if (callback) {
            callback();
        }
        LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
        Toast.show(LVStrings.wallet_delete_success);
        this.props.navigation.goBack();
    }

    onWalletBackup(password: string) {
        const wallet = this.state.wallet;
        if(wallet){
            this.refs.passwordConfirm.dismiss();
            setTimeout(async ()=>{
                try {
                    await backupWallet(wallet, password);
                } catch (error) {
                    this.refs.toast.dismiss();
                    if(error === 'cancelled') {
                        return;
                    }
                    setTimeout(() => {
                        this.setState({
                            alertMessage: LVStrings.wallet_backup_failed
                        });
                        this.refs.alert.show();
                    }, 500);
                }
                
            }, 500)
        }
    }

    async verifyPassword(inputPwd: string) {
        return await LVWalletManager.verifyPassword(inputPwd, this.state.wallet.keystore);
    }

    onVerifyResult(success: boolean, password: string) {
        if (success) {
            const { wallet, showInputFor } = this.state;
            switch (showInputFor) {
                case SHOW_INPUT_FOR_EXPORT:
                    setTimeout(() => {
                        this.showExportModal(password);
                    }, 300);
                    break;
                case SHOW_INPUT_FOR_DELETE:
                    setTimeout(() => {
                        this.onDeleteWallet();
                    }, 300);
                    break;
                case SHOW_INPUT_FOR_BACKUP:
                    setTimeout(() => {
                        this.onWalletBackup(password);
                    }, 300);
                    break;
            }
        } else {
            setTimeout(() => {
                this.setState({
                    alertMessage: !password ? LVStrings.password_verify_required : LVStrings.inner_error_password_mismatch
                });
                this.refs.alert.show();
            }, 500);
        }
    }

    render() {
        const wallet = this.state.wallet;
        return (
            <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
                <WalletExportModal
                    isOpen={this.state.showExportModal}
                    privateKey={this.state.privateKey}
                    onClosed={this.onExportModalClosed.bind(this)}
                />
                <View style={styles.topPanel}>
                    <MXNavigatorHeader
                        left={IconBack}
                        style={{ backgroundColor: LVColor.primary }}
                        title={LVStrings.wallet_detail}
                        titleStyle={{ color: LVColor.white }}
                        onLeftPress={() => {
                            this.props.navigation.goBack();
                    }}/>
                    <LVWalletHeader title={this.state.walletName} 
                                    address={this.state.walletAddress}/>
                </View>
                
                <TableView>
                    <CellVariant
                    title={LVStrings.profile_wallet_modify_name}
                    source={IconWalletModifyName}
                    onPress={() => {
                        this.props.navigation.navigate('ModifyWalletName', { wallet: wallet });
                    }}/>
                    <CellVariant
                        title={LVStrings.profile_wallet_modify_password}
                        source={IconWalletModifyPwd}
                        onPress={() => {
                            this.props.navigation.navigate('ModifyWalletPwd', { wallet: wallet });
                        }}
                    />
                    <CellVariant
                        title={LVStrings.profile_wallet_export}
                        source={IconWalletExportPK}
                        onPress={() => {
                            this.onPressExportOrDeleteButton(SHOW_INPUT_FOR_EXPORT);
                        }}/>
                    <Separator insetRight={15} tintColor="#F5F6FA" />
                </TableView>
                <View style={styles.bottomPanelStyle}>
                    <MXButton
                        style={styles.buttonStyle}
                        title={LVStrings.profile_wallet_backup}
                        isEmptyButtonType={true}
                        rounded
                        onPress={() => {
                            this.refs.disclaimer.show();
                        }}
                    />
                    <MXButton
                        style={styles.buttonStyle}
                        title={LVStrings.profile_wallet_delete_wallet}
                        rounded
                        isEmptyButtonType={true}
                        onPress={() => {
                            this.onPressExportOrDeleteButton(SHOW_INPUT_FOR_DELETE);
                        }}
                    />
                </View>
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_exporting} />
                <LVDialog
                    ref={'disclaimer'}
                    height={230}
                    title={LVStrings.wallet_disclaimer}
                    titleStyle={{ color: LVColor.text.grey2,fontSize: 18,fontWeight: '500' }}
                    message={LVStrings.wallet_disclaimer_content}
                    buttonTitle={LVStrings.common_confirm}
                    onPress={() => {
                        this.refs.disclaimer.dismiss();
                        setTimeout(() => {
                            this.onPressExportOrDeleteButton(SHOW_INPUT_FOR_BACKUP);
                        }, 300);
                    }}
                />
                <LVDialog
                    ref={'alert'}
                    title={LVStrings.alert_hint}
                    message={this.state.alertMessage}
                    buttonTitle={LVStrings.alert_ok}
                />
                <LVPasswordDialog
                    ref={'passwordConfirm'}
                    verify={this.verifyPassword.bind(this)}
                    onVerifyResult={this.onVerifyResult.bind(this)}
                />
            </View>
        );
    }
}

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white
    },
    topPanel: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: MXUtils.isIphoneX() ? 219 : 195,
        backgroundColor:LVColor.primary
    },
    walletInfo: {
        width: Window.width,
        height: Window.width < 500 ? 96 : 115,
        paddingHorizontal: 12.5,
        backgroundColor: 'white'
    },
    walletTitle: {
        marginTop: 2.5,
        marginBottom: 2.5,
        color: '#6d798a',
        backgroundColor: 'transparent',
        fontSize: LVSize.large,
        fontWeight: '500'
    },
    walletAddress: {
        color: '#bec4d0',
        width: 170,
        fontSize: LVSize.xsmall
    },
    bottomPanelStyle: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: LVColor.white,
        marginBottom:15,
        marginLeft:15,
        marginRight:15
    },
    buttonStyle: {
        marginBottom:15,
        width: '100%'
    }
});

export default WalletDetailsPage;
