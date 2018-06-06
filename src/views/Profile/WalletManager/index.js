/*
 * Project: Venus
 * File: src/views/Profile/WalletManager/index.js
 * Author: Charles Liu
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, Button,TouchableHighlight, FlatList, StatusBar } from 'react-native';
import { Cell } from 'react-native-tableview-simple';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import LVStrings from '../../../assets/localization';
import LVColor from '../../../styles/LVColor';
import LVFontSize from '../../../styles/LVFontSize';
import LVGradientPanel from '../../../views/Common/LVGradientPanel';
import { converAddressToDisplayableText,adjust } from '../../../utils/MXStringUtils';
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
import LVBig from '../../../logic/LVBig';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { iPhoneX_Bottom_Inset } from '../../../utils/MXUtils';
const WalletIcon = require('../../../assets/images/wallet_grey.png');
const ShowDetailsIcon = require('../../../assets/images/show_detail_arrow.png');
const CreateWalletIcon = require('../../../assets/images/wm_create_wallet.png');
const ImportWalletIcon = require('../../../assets/images/wm_import_wallet.png');

type Props = {
    navigation: Object
};

type State = {
    wallets: Array<Object>
};

export class WalletManagerScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false,
        gesturesEnabled: false
    };

    onCreateWalletPressed : Function;
    onImportWalletPressed : Function;
    handleWalletChange: Function;

    constructor() {
        super();
        this.state = {
            wallets: []
        };
        this.onCreateWalletPressed = this.onCreateWalletPressed.bind(this);
        this.onImportWalletPressed = this.onImportWalletPressed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
    }

    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        LVNotificationCenter.addObserver(this, LVNotification.walletsNumberChanged, this.handleWalletChange);

        this.handleWalletChange();
    }

    componentWillUnmount() {
        LVNotificationCenter.removeObservers(this);
    }
    
    onCreateWalletPressed() {
        this.refs.creationPage.show();
    }

    onImportWalletPressed() {
        this.refs.importPage.show();
    }

    handleWalletChange() {
        this.setState({ wallets: LVWalletManager.getWallets() });
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
                                        </View>
                                    </View>
                                </View>
                             </TouchableHighlight>
                                }
                        />
                </View>
                <View style={styles.bottomPanel}>
                    <View style={styles.bottomContainer}>
                        <TouchableHighlight style={styles.bottomButtonContainer} 
                                            onPress={this.onCreateWalletPressed}
                                            underlayColor={LVColor.primary}>
                            <View style={styles.bottomButtonContainer}>
                                <Image source={CreateWalletIcon} style={styles.bottomIconStyle}/>
                                <Text style={styles.bottomButtonText}>{LVStrings.wallet_create_wallet}</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.bottomSeparator}></View>
                        <TouchableHighlight style={styles.bottomButtonContainer} 
                                            onPress={this.onImportWalletPressed}
                                            underlayColor={LVColor.primary}>
                            <View style={styles.bottomButtonContainer}>
                                <Image source={ImportWalletIcon} style={styles.bottomIconStyle}/>
                                <Text style={styles.bottomButtonText}>{LVStrings.wallet_import_header}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <LVFullScreenModalView ref={'creationPage'}>
                    <LVWalletCreationNavigator screenProps={{dismiss: ()=> {
                        console.log('dissmissing');
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
        ...ifIphoneX({height: 55 + iPhoneX_Bottom_Inset},{height: 55}),
        backgroundColor: '#FFFFFF',
        shadowColor: '#6B7A9F',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        ...ifIphoneX({marginBottom: iPhoneX_Bottom_Inset}, {marginBottom:0})
    },
    bottomButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomIconStyle: {
        marginRight: 5
    },
    bottomSeparator: {
        width: 1,
        height: 20,
        marginTop:15,
        backgroundColor: '#F5F6FA'
    },
    bottomButtonText: {
        color: '#657182',
        fontSize: 15
    },
    listContainerStyle: {
        marginTop: 10,
        marginLeft: 12.5,
        marginRight: 12.5,
        flex:1
    },
    cellContentViewContainer: {
        height:90, 
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
        justifyContent: 'center', 
        alignItems: 'center'
    },
    cellLeftImageStyle: {
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
        fontSize: 16,
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