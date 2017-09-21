# Components

自定义组件
这些组件应该是项目无关的，即在其他项目也可以使用
应该以 `MX` 为组件前缀

TestComponent.js

在 app.js 中直接修改组件为 TestComponent，代码如下：

```
class VenusApp extends Component {
    render() {
        console.log('strings = ' + JSON.stringify(LVStrings));
        return (
            <TestComponent />
        )
    }
}

```

写完一个组件建议放在 TestComponent.js 中写如何使用的代码

**commit 的时候注意改回来**
