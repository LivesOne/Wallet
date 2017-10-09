## LVDialog

``` javascript
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MXAlert from '../../components/MXAlert';
import LVDialog from '../Common/LVDialog';

class TestScreen extends Component {
    onPressDialogButton = () => {
        this.refs.dialog.show();
    };

    onPressInputDialogButton = () => {
        this.refs.inputDialog.show();
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button onPress={this.onPressDialogButton.bind(this)} title="Dialog" />
                <Button onPress={this.onPressInputDialogButton.bind(this)} title="Input Dialog" />

                <LVDialog ref={'dialog'} title='免责声明' message='请确认已经导出的钱包备份的安全性，任何钱包的丢失、被盗、忘记密码等行为产生的所示均与平台无关。' buttonTitle='确定' />
                <LVDialog ref={'inputDialog'} title='我的私钥' height={320} buttonTitle='复制私钥' >
                    <Text>警告：私钥未经加密，导出存在风险，建议使用Keystore备份</Text>
                    <Text>警告：私钥未经加密，导出存在风险，建议使用Keystore备份</Text>
                    <Text>警告：私钥未经加密，导出存在风险，建议使用Keystore备份</Text>
                    <Text>警告：私钥未经加密，导出存在风险，建议使用Keystore备份</Text>
                </LVDialog>
            </View>
        );
    }
}
```