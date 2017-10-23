/*
 * Project: Venus
 * File: src/views/Profile/WalletManager/index.js
 * Author: Charles Liu
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, Button,TouchableHighlight, FlatList } from 'react-native';
import { Cell } from 'react-native-tableview-simple';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor';
import LVFontSize from '../../../styles/LVFontSize';
import LVGradientPanel from '../../../views/Common/LVGradientPanel';
import { converAddressToDisplayableText,convertAmountToCurrencyString } from '../../../utils/MXStringUtils';
import LVFullScreenModalView from '../../Common/LVFullScreenModalView';
import LVWalletCreationNavigator from '../../Wallet/LVWalletCreationNavigator';
import WalletImportPage from '../../Wallet/WalletImportPage';
import LVWalletManager from '../../../logic/LVWalletManager';
import { greyNavigationBackIcon } from '../../../assets/LVIcons';
import LVWalletImportNavigator from '../../Wallet/LVWalletImportNavigator';
import WalletUtils from '../../Wallet/WalletUtils';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
import LVNetworking from '../../../logic/LVNetworking';
const WalletIcon = require('../../../assets/images/wallet_grey.png');
const ShowDetailsIcon = require('../../../assets/images/show_detail_arrow.png');

export class WalletManagerScreen extends Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    state: {
        wallets: Array<Object>
    }

    onCreateWalletPressed : Function;
    onImportWalletPressed : Function;
    handleWalletChange: Function;

    constructor() {
        super();

        this.onCreateWalletPressed = this.onCreateWalletPressed.bind(this);
        this.onImportWalletPressed = this.onImportWalletPressed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
        this.state = {
            wallets: []
        };
    }

    componentWillMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange.bind(this));
        LVNotificationCenter.addObserver(this, LVNotification.balanceChanged, this.handleBalanceChange.bind(this));
    }


    componentWillUnMount() {
        LVNotificationCenter.removeObserver(this);
    }
    
    componentDidMount() {
        this.handleWalletChange();
    }
    
    onCreateWalletPressed() {
        this.refs.creationPage.show();
    }

    onImportWalletPressed() {
        this.refs.importPage.show();
    }

    handleWalletChange() {
        this.setState({
            wallets: LVWalletManager.getWallets()
        });
    }

    handleBalanceChange(wallet: Object) {
        setTimeout(async ()=> {
            if (wallet) {
                try {
                    WalletUtils.log('balance wallet =  ' + JSON.stringify(wallet));
                    const lvt = await LVNetworking.fetchBalance(wallet.address, 'lvt');
                    const eth = await LVNetworking.fetchBalance(wallet.address, 'eth');
                    wallet.lvt = (lvt ? parseFloat(lvt) : 0);
                    wallet.eth = (eth ? parseFloat(eth) : 0);
                    WalletUtils.log('after fetch balance wallet =  ' + JSON.stringify(wallet));
                    await LVWalletManager.updateWallet(wallet);
                    await LVWalletManager.saveToDisk();
                    this.handleWalletChange();
                } catch (error) {
                    WalletUtils.log(error.message);
                }
            }
        }, 300);
    }

    render() {
        const { wallets } = this.state;
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                left={ greyNavigationBackIcon }
                style={styles.nav}
                title={ LVStrings.profile_wallet_management }
                titleStyle={styles.navTitle}
                onLeftPress={ () => {this.props.navigation.goBack() }}
                />
                <View style={styles.listContainerStyle}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={wallets}
                        extraData={this.state}
                        keyExtractor={(item,index)=> item.address}
                        renderItem={({item, separators}) => 
                             <TouchableHighlight style={styles.cellContentViewContainer}
                                onPressIn={separators.highlight}
                                onPressOut={separators.unhighlight}
                                underlayColor={LVColor.white}
                                onPress={()=> this.props.navigation.navigate('WalletDetailsPage', {wallet:item, callback:()=>this.handleWalletChange()})}>
                                <View style={styles.cellContentStyle}>
                                    <View style={styles.cellLeftContentStyle}>
                                        <Image source={WalletIcon} resizeMode={Image.resizeMode.contain} style={styles.cellLeftImageStyle}/>
                                    </View>
                                    <View style={styles.cellRightContentStyle}>
                                        <View style={styles.cellRightInnnerContainerStyle}>
                                            <View style={styles.cellRightTopPanelStyle}>
                                                <View style={styles.cellRightTopDetailsPanelStyle}>
                                                    <Text style={styles.cellWalletNameTextStyle} 
                                                        ellipsizeMode='tail' 
                                                        numberOfLines={1}>{item.name}</Text>
                                                    <Text style={styles.cellWalletAddressTextStyle}>{converAddressToDisplayableText(item.address,9,9)}</Text>
                                                </View>
                                                <Image source={ShowDetailsIcon} style={styles.cellRightTopShowDetailsIconStyle}/>
                                            </View>
                                            <View style={styles.cellRightSeparatorStyle}/>
                                            <View style={styles.cellRightBottomPanelStyle}>
                                                <View style={styles.cellRightBottomContainerStyle}>
                                                    <Text style={styles.cellRightBottomNumberStyle}>{convertAmountToCurrencyString(item.lvt, ',', 0)}</Text>
                                                    <Text style={styles.cellRightBottomCoinTypeStyle}>LVT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                             </TouchableHighlight>
                                }
                        />
                </View>
                <LVGradientPanel style={styles.bottomPanel}>
                    <View style={styles.bottomContainer}>
                        <TouchableHighlight style={styles.bottomButtonContainer} 
                                            onPress={this.onCreateWalletPressed}
                                            underlayColor={LVColor.primary}>
                            <Text style={styles.bottomButtonText}>{LVStrings.wallet_create_wallet}</Text>
                        </TouchableHighlight>
                        <View style={styles.bottomSeparator}></View>
                        <TouchableHighlight style={styles.bottomButtonContainer} 
                                            onPress={this.onImportWalletPressed}
                                            underlayColor={LVColor.primary}>
                            <Text style={styles.bottomButtonText}>{LVStrings.wallet_import_header}</Text>
                        </TouchableHighlight>
                    </View>
                </LVGradientPanel>
                <LVFullScreenModalView ref={'creationPage'}>
                    <LVWalletCreationNavigator screenProps={{dismiss: ()=> {
                        this.refs.creationPage.dismiss()
                        this.handleWalletChange();
                    } 
                }}/>
                </LVFullScreenModalView>
                <LVFullScreenModalView ref={'importPage'}>
                    <LVWalletImportNavigator screenProps={{dismiss: ()=> {
                        this.refs.importPage.dismiss();
                        this.handleWalletChange();
                    }, from: WalletUtils.OPEN_IMPORT_FROM_WALLET_MANAGER, 
                }}/>
                </LVFullScreenModalView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FB'
    },
    nav: {
        backgroundColor : LVColor.profileNavBack
    },
    navTitle: {
        color : '#6d798a',
        fontSize: LVFontSize.large
    },
    bottomPanel: {
        height: 50
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    bottomButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomSeparator: {
        width: 1,
        height: 20,
        marginTop:15,
        backgroundColor: LVColor.white
    },
    bottomButtonText: {
        color: LVColor.white,
        fontSize: 15
    },
    listContainerStyle: {
        marginTop: 10,
        marginLeft: 12.5,
        marginRight: 12.5,
        flex:1
    },
    cellContentViewContainer: {
        height:110, 
        marginBottom:15,
        backgroundColor: LVColor.white,
        shadowOffset: {width: 0, height: -1},
        shadowColor: '#6B7A9F',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    cellContentStyle: {
        flex:1, 
        flexDirection: 'row'
    },
    cellLeftContentStyle: {
        flex:0.215, 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center'
    },
    cellLeftImageStyle: {
        marginTop: 15, 
        width:50, 
        height:50
    },
    cellRightContentStyle: {
        flex:0.785
    },
    cellRightInnnerContainerStyle: {
        flex: 1,
        flexDirection: 'column'
    },
    cellRightTopPanelStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cellRightTopShowDetailsIconStyle: {
        marginRight: 10
    },
    cellRightTopDetailsPanelStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    cellWalletNameTextStyle: {
        fontSize: 15,
        color: '#677384'
    },
    cellWalletAddressTextStyle: {
        fontSize: 12,
        marginTop:3,
        color: '#BFC5D1'
    },
    cellRightSeparatorStyle: {
        height: StyleSheet.hairlineWidth,
        marginRight: 10,
        backgroundColor: LVColor.separateLine
    },
    cellRightBottomPanelStyle: {
        height: 45
    },
    cellRightBottomContainerStyle: {
        flex:1, flexDirection: 
        'row', 
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cellRightBottomNumberStyle: {
        fontSize: 18,
        color: '#667283'
    },
    cellRightBottomCoinTypeStyle: {
        fontSize: 12,
        marginLeft: 5,
        color: '#667283',
        marginTop: 5
    }
});