/*
 * Project: Venus
 * File: src/views/Common/LVWebViewScreen.js
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, WebView, View, Text } from 'react-native';
import LVSize from '../../styles/LVFontSize';
import LVColor from '../../styles/LVColor';
import MXNavigatorHeader from '../../components/MXNavigatorHeader';

type Props = {
    navigation: Object
};
type State = {
    url: string,
    title: string,
    loading: boolean,
    canGoBack: boolean,
    canGoForward: boolean,
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
            canGoForward: false,
        };

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    onNavigationStateChange = (navState: Object) => {
        this.setState({
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
        });
    }

    render() {
        const { url, title } = this.state;

        return (
            <View style={styles.container}>
                <MXNavigatorHeader
                    title={title}
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ fontSize: LVSize.large, color: LVColor.text.grey2 }}
                    left={require('../../assets/images/back_grey.png')}
                    onLeftPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <WebView
                    style={styles.webview}
                    source={{ uri: url }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    onLoad={(e) => console.log('onLoad')}
                    onLoadEnd={(e) => console.log('onLoadEnd')}
                    onLoadStart={(e) => console.log('onLoadStart')}
                    renderError={() => {
                        console.log('renderError')
                        return <View><Text>renderError回调了，出现错误</Text></View>
                    }}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LVColor.white
    },
    webview: {
        flex: 1
    }
});
