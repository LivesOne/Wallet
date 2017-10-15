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
import LVGradientPanel from '../../../views/Common/LVGradientPanel';
import { converAddressToDisplayableText } from '../../../utils/MXStringUtils';
import LVFullScreenModalView from '../../Common/LVFullScreenModalView';
import LVWalletCreationNavigator from '../../Wallet/LVWalletCreationNavigator';
import WalletImportPage from '../../Wallet/WalletImportPage';
import LVWalletManager from '../../../logic/LVWalletManager';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import LVNotification from '../../../logic/LVNotification';
const IconBack = require('../../../assets/images/back_grey.png');
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

    constructor() {
        super();

        this.onCreateWalletPressed = this.onCreateWalletPressed.bind(this);
        this.onImportWalletPressed = this.onImportWalletPressed.bind(this);
        this.handleWalletChange = this.handleWalletChange.bind(this);
        this.state = {
            wallets: []
        };
    }
    
    componentDidMount() {
        LVNotificationCenter.addObserver(this, LVNotification.walletChanged, this.handleWalletChange);
        this.setState({
            wallets: LVWalletManager.getWallets()
        });
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

    render() {
        const { wallets } = this.state;
        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                left={ IconBack }
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
                                onPress={()=> this.props.navigation.navigate('WalletDetailsPage', {wallet:item})}>
                                <View style={styles.cellContentStyle}>
                                    <View style={styles.cellLeftContentStyle}>
                                        <Image source={WalletIcon} resizeMode={Image.resizeMode.contain} style={styles.cellLeftImageStyle}/>
                                    </View>
                                    <View style={styles.cellRightContentStyle}>
                                        <View style={styles.cellRightInnnerContainerStyle}>
                                            <View style={styles.cellRightTopPanelStyle}>
                                                <View style={styles.cellRightTopDetailsPanelStyle}>
                                                    <Text style={styles.cellWalletNameTextStyle}>{item.name}</Text>
                                                    <Text style={styles.cellWalletAddressTextStyle}>{converAddressToDisplayableText(item.address,9,9)}</Text>
                                                </View>
                                                <Image source={ShowDetailsIcon} style={styles.cellRightTopShowDetailsIconStyle}/>
                                            </View>
                                            <View style={styles.cellRightSeparatorStyle}/>
                                            <View style={styles.cellRightBottomPanelStyle}>
                                                <View style={styles.cellRightBottomContainerStyle}>
                                                    <Text style={styles.cellRightBottomNumberStyle}>{item.lvt}</Text>
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
                        this.setState({
                            wallets: LVWalletManager.getWallets()
                        });
                    } 
                }}/>
                </LVFullScreenModalView>
                <LVFullScreenModalView ref={'importPage'}>
                    <WalletImportPage dismissCallback={()=> {
                        this.refs.importPage.dismiss();
                        this.setState({
                            wallets: LVWalletManager.getWallets()
                        });
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
        backgroundColor : '#F8F9FB'
    },
    navTitle: {
        color : '#6d798a'
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
        height: 1,
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