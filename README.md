# use-i18n

Simple hooks for international project.

最简单实现国际化的 hooks。

### How to use? 怎样使用？

1. Install the package:

安装：

```bash
yarn add use-i18n
//or npm i -S use-i18n
//or cnpm i -S use-i18n
```

2. Provider to your application:

在应用上层加 Provider：

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { TransProvider } from 'use-i18n';
import App from './app';
import i18n from './i18n';

ReactDOM.render(
  <TransProvider i18n={i18n}>
    <App />
  </TransProvider>,
  document.getElementById('root'),
);
```

3. Create `i18n.js` file:

创建 `i18n.js` 文件：

```js
const i18n = {
  en: {
    welcome: 'hello',
  },
  'zh-CN': {
    welcome: '你好',
  },
};

export default i18n;
```

4. Use I18n in your components:

在组件中使用：

```js
import React from 'react';
import { useI18n } from 'use-i18n';

const App = () => {
  const t = useI18n();

  return <div>{t.welcome}</div>;
};
```

5. Done, you can check localstorage。

完成了，打开 localstorage 查看如何运作

### Feel free to open PR/Issues
