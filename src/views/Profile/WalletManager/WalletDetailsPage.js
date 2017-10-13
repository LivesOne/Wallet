//@flow
'use strict'

import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import MXNavigatorHeader from './../../../components/MXNavigatorHeader';
import WalletInfoView from '../../Assets/WalletInfoView';
import LVSize from '../../../styles/LVFontSize';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import MXButton from './../../../components/MXButton';
import LVStrings from '../../../assets/localization';
import { WalletExportModal } from './WalletExportModal';
import LVWalletManager from '../../../logic/LVWalletManager';
import LVNotification from '../../../logic/LVNotification';
import LVNotificationCenter from '../../../logic/LVNotificationCenter';
import {convertAmountToCurrencyString} from '../../../utils/MXStringUtils';
import LVDialog, { LVConfirmDialog } from '../../Common/LVDialog';

const IconWalletModifyName = require('../../../assets/images/wallet_modify_name.png');
const IconWalletModifyPwd = require('../../../assets/images/wallet_modify_pwd.png');
const IconWalletExportPK = require('../../../assets/images/wallet_export_pk.png');
const IconShowDetailArrow = require('../../../assets/images/show_detail_arrow.png');
const IconWallet = require('../../../assets/images/wallet_grey.png');
const IconBack = require('../../../assets/images/back_grey.png');

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
        <View style={{alignItems: 'center', flexDirection: 'row', width: '100%', paddingVertical: 10 }}>
            <Image source={props.source}></Image> 
            <Text
                numberOfLines={1}
                style={{ flex: 1, fontSize: 16, marginLeft: 10, color: '#677384'}}
            >{props.title}</Text>
            <Image source={IconShowDetailArrow}></Image> 
        </View>
        }
        highlightActiveOpacity={0.8}
        highlightUnderlayColor={'grey'}
        onPress={props.onPress}
        contentContainerStyle = {{height: 55}}
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
        walletName: string
    }

    constructor() {
        super();
        this.state = {
            displayTitle: '',
            walletAddress: '0x2A609SF354346FDHFHFGHGFJE6ASD119cB7',
            privateKey: '7badjaxamad89asdfa2eajkfjak08923h8ass0d9g9xx9ad8a78asd90a',
            showExportModal: false,
            walletName: ''
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const wallet = params.wallet;
        this.setState({
            displayTitle: convertAmountToCurrencyString(wallet.lvt,',',0),
            walletAddress: wallet.address,
            walletName: wallet.name
        });
    }

    showExportModal() {
        this.setState({ showExportModal: true })
    }

    onExportModalClosed() {
        this.setState({ showExportModal: false })
    }

    render() {     
        return (
            <View style={ styles.container }>
                <WalletExportModal
                    isOpen= {this.state.showExportModal}
                    privateKey= { this.state.privateKey }
                    onClosed = {this.onExportModalClosed.bind(this)}/>
                <MXNavigatorHeader
                    left={ IconBack }
                    style={{backgroundColor:'#F8F9FB'}}
                    title={ this.state.walletName }
                    titleStyle={{color:'#6d798a'}}
                    onLeftPress={ () => {this.props.navigation.goBack() }}
                    />
                <WalletInfoView 
                    style={styles.walletInfo} title={ this.state.displayTitle } 
                    address={ this.state.walletAddress }
                    titleStyle={styles.walletTitle}
                    addressStyle={styles.walletAddress}
                    walletIcon={ IconWallet }
                    showLVT
                     />
                <TableView>
                    <Section
                        sectionPaddingTop={9} 
                        sectionPaddingBottom={0} 
                        sectionTintColor="#f5f6fa" 
                        separatorTintColor={"transparent"}
                        hideSeparator
                        >
                        <CellVariant title= { LVStrings.profile_wallet_modify_name } source={ IconWalletModifyName } 
                        onPress = {()=>{this.props.navigation.navigate('ModifyWalletName')}}/>
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <CellVariant title= { LVStrings.profile_wallet_modify_password } source={ IconWalletModifyPwd }
                        onPress = {()=>{this.props.navigation.navigate('ModifyWalletPwd')}}/>
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                        <CellVariant title= { LVStrings.profile_wallet_export } source={ IconWalletExportPK }
                        onPress = { this.showExportModal.bind(this) }/>
                        <Separator insetRight={15} tintColor="#eeeff2"/>
                    </Section>
                </TableView>
                <View style={{width: '100%', flex: 1, justifyContent:'flex-end', alignItems:'center', backgroundColor: 'white'}}>
                    <MXButton style={{marginBottom: 15}} 
                            title={ LVStrings.profile_wallet_backup } 
                            rounded/>
                    <MXButton style={{marginBottom: 25}} 
                            title={ LVStrings.profile_wallet_delete_wallet } 
                            rounded
                            onPress={ async ()=> {
                                LVWalletManager.deleteWallet(this.state.walletAddress);
                                await LVWalletManager.saveToDisk();
                                LVNotificationCenter.postNotification(LVNotification.walletsNumberChanged);
                            }}/>
                </View>
                
            </View>
        )
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

export default WalletDetailsPage