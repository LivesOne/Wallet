/*
 * Project: Venus
 * File: src/views/Common/LVWebViewScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, WebView, View, Text, Image } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import LVUtils from '../../utils';
import LVStrings from '../../assets/localization';
import MXButton from '../../components/MXButton';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';

type Props = {
    navigation: Object
};
type State = {
    url: string,
    title: string,
    loading: boolean,
    canGoBack: boolean,
    canGoForward: boolean
};

export default class LVWebViewScreen extends Component<Props, State> {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    };

    constructor(props: any) {
        super(props);
        this.state = {
            url: props.navigation.state.params.url,
            title: 'WebView',
            loading: true,
            canGoBack: false,
            canGoForward: false
        };

        this.reloadWebview = this.reloadWebview.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    reloadWebview = () => {
        this.refs.webview.reload();
    }

    onNavigationStateChange = (navState: Object) => {
        this.setState({
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward
        });
    };

    render() {
        const { url, title } = this.state;
        const staticTitle = this.props.navigation.state.params.title;
        const navTitle = LVUtils.isNotEmptyString(staticTitle) ? staticTitle : title;

        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title={navTitle}
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ fontSize: LVSize.large, color: LVColor.text.grey2 }}
                    left={require('../../assets/images/close_modal.png')}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <WebView
                    ref={'webview'}
                    style={styles.webview}
                    source={{ uri: 'https://www.google.com' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    onLoad={e => console.log('onLoad')}
                    onLoadEnd={e => console.log('onLoadEnd')}
                    onLoadStart={e => console.log('onLoadStart')}
                    renderError={() => <WebViewErrorView onRetry={this.reloadWebview} />}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}

const connectionFailedIcon = require('../../assets/images/webview_connection_failed.png');

const WebViewErrorView = ({ onRetry }) => (
    <View style={styles.error}>
        <Image style={styles.errorIcon} source={connectionFailedIcon} />
        <Text style={styles.errorText} >{LVStrings.webview_connection_failed}</Text>
        <MXButton style={styles.retry} title={LVStrings.common_retry} isEmptyButtonType={true} onPress={onRetry} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white
    },
    webview: {
        flex: 1
    },
    error: {
        flex: 1, 
        alignItems: 'center'
    },
    errorIcon: {
        marginTop: 160, 
        marginBottom: 20
    },
    errorText: {
        fontSize: 15, 
        color: LVColor.text.grey2
    },
    retry: {
        marginTop: 25,
        width: 150,
        height: 40
    }
});
