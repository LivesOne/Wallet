//@flow
'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, Share } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import WalletInfoView from '../../Assets/WalletInfoView';
import LVSize from '../../../styles/LVFontSize';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import MXButton from './../../../components/MXButton';
import MXCrossTextInput from '../../../components/MXCrossTextInput';
import LVStrings from '../../../assets/localization';
import { WalletExportModal } from './WalletExportModal';
import LVWalletManager from '../../../logic/LVWalletManager';
import { convertAmountToCurrencyString } from '../../../utils/MXStringUtils';
import LVLoadingToast from '../../Common/LVLoadingToast';
import Toast from 'react-native-simple-toast';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
import LVDialog, { LVConfirmDialog } from '../../Common/LVDialog';

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

export class WalletDetailsPage extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
        displayTitle: string,
        walletAddress: string,
        showExportModal: boolean,
        privateKey: string,
        walletName: string,
        wallet: ?Object,
        walletTitle: string,
        showExportModal: boolean
    };

    constructor() {
        super();
        this.state = {
            displayTitle: '',
            wallet: null,
            walletTitle: '',
            walletAddress: '',
            privateKey: '',
            showExportModal: false,
            walletName: ''
        };
    }

    componentWillMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChanged.bind(this))
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const wallet = params.wallet;
        this.setState({
            wallet: wallet,
            displayTitle: convertAmountToCurrencyString(wallet.lvt, ',', 0),
            walletAddress: wallet.address,
            walletName: wallet.name
        });
    }

    async handleWalletChanged() {
        const wallet = await LVWalletManager.getSelectedWallet();
        if (wallet) {
            console.log('new wallet = ' + JSON.stringify(wallet));
            this.setState({
                wallet: wallet,
                displayTitle: convertAmountToCurrencyString(wallet.lvt, ',', 0),
                walletAddress: wallet.address,
                walletName: wallet.name
            });
        }
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObserver(this);
    }

    showExportModal() {
        this.setState({ showExportModal: true });
    }

    async fetchPrivateKey(callback: Function) {
        const wallet = this.state.wallet;
        console.log('test' + JSON.stringify(wallet));
        if (wallet) {
            let privateKey = await LVWalletManager.exportPrivateKey(wallet.password);
            this.setState({ privateKey: privateKey });
            if (callback) {
                callback();
            }
        }
    }

    async showExportModal() {
        this.refs.toast.show();
        setTimeout(async () => {
            await this.fetchPrivateKey(() => {
                this.refs.toast.dismiss();
                setTimeout(() => {
                    this.setState({ showExportModal: true });
                }, 500);
            });
        }, 1000);
    }

    onExportModalClosed() {
        this.setState({ showExportModal: false });
    }

    onPressWalletDeleteButton() {
        this.refs.walletDeleteConfirm.show();
    }

    async onDeleteWallet() {
        const walletAddress = this.state.walletAddress;
        await LVWalletManager.deleteWallet(walletAddress);
        await LVWalletManager.saveToDisk();
        LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
        this.refs.walletDeleteConfirm.dismiss();
        Toast.show(LVStrings.wallet_delete_success);
        this.props.navigation.goBack();
    }

    onPressWalletBackupButton() {
        const wallet = this.state.wallet;

        if (wallet && wallet.keystore) {
            const title: string = wallet.name + ' ' + LVStrings.wallet_backup_title_suffix;
            const message: string = JSON.stringify(wallet.keystore);
            Share.share({
                message: message,
                url: '',
                title: title
            })
                .then(this._shareResult.bind(this))
                .catch(error => console.log(error));
        }
    }

    _shareResult(result) {
        if (result.action === Share.sharedAction) {
            this.refs.disclaimer.show();
        } else if (result.action === Share.dismissedAction) {
        }
    }

    render() {
        const wallet = this.state.wallet;
        return (
            <View style={styles.container}>
                <WalletExportModal
                    isOpen={this.state.showExportModal}
                    privateKey={this.state.privateKey}
                    onClosed={this.onExportModalClosed.bind(this)}
                />
                <MXNavigatorHeader
                    left={IconBack}
                    style={{ backgroundColor: '#F8F9FB' }}
                    title={this.state.walletName}
                    titleStyle={{ color: '#6d798a' }}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <WalletInfoView
                    style={styles.walletInfo}
                    title={this.state.displayTitle}
                    address={this.state.walletAddress}
                    titleStyle={styles.walletTitle}
                    addressStyle={styles.walletAddress}
                    walletIcon={IconWallet}
                    showLVT
                />
                <TableView>
                    <Section
                        sectionPaddingTop={9}
                        sectionPaddingBottom={0}
                        sectionTintColor="#f5f6fa"
                        separatorTintColor={'transparent'}
                        hideSeparator
                    >
                        <CellVariant
                            title={LVStrings.profile_wallet_modify_name}
                            source={IconWalletModifyName}
                            onPress={() => {
                                this.props.navigation.navigate('ModifyWalletName', { wallet: wallet });
                            }}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2" />
                        <CellVariant
                            title={LVStrings.profile_wallet_modify_password}
                            source={IconWalletModifyPwd}
                            onPress={() => {
                                this.props.navigation.navigate('ModifyWalletPwd', { wallet: wallet });
                            }}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2" />
                        <CellVariant
                            title={LVStrings.profile_wallet_export}
                            source={IconWalletExportPK}
                            onPress={this.showExportModal.bind(this)}
                        />
                        <Separator insetRight={15} tintColor="#eeeff2" />
                    </Section>
                </TableView>
                <View
                    style={{
                        width: '100%',
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'white'
                    }}
                >
                    <MXButton
                        style={{ marginBottom: 15 }}
                        title={LVStrings.profile_wallet_backup}
                        rounded
                        onPress={this.onPressWalletBackupButton.bind(this)}
                    />
                    <MXButton
                        style={{ marginBottom: 25 }}
                        title={LVStrings.profile_wallet_delete_wallet}
                        rounded
                        onPress={this.onPressWalletDeleteButton.bind(this)}
                    />
                </View>
                <LVLoadingToast ref={'toast'} title={LVStrings.wallet_exporting} />
                <LVDialog
                    ref={'disclaimer'}
                    height={230}
                    title={LVStrings.wallet_disclaimer}
                    titleStyle={{color: 'red'}}
                    message={LVStrings.wallet_disclaimer_content}
                    buttonTitle={LVStrings.common_confirm}
                    onPress={() => {this.refs.disclaimer.dismiss();}}
                />
                <LVConfirmDialog
                    ref={'walletDeleteConfirm'}
                    title={LVStrings.alert_hint}
                    message={LVStrings.wallet_delete_hint}
                    onConfirm={this.onDeleteWallet.bind(this)}
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
        alignItems: 'center',
        backgroundColor: '#F8F9FB'
    },
    walletInfo: {
        width: Window.width,
        height: 115,
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
    }
});

export default WalletDetailsPage;
