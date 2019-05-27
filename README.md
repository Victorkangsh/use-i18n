# use-i18n

Simple react hooks for international project. No other dependencies.

最简单的用 react hooks 实现国际化的 hooks。无任何其他依赖。

## How to use? 怎样使用？

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

export default App;
```

5. Change language:

改变语言：

```js
import React from 'react';
import { useI18n, setLang } from 'use-i18n';

const App = () => {
  const t = useI18n();
  const [lang, setNewLang] = setLang();
  const change = () => {
    setNewLang('en');
  };
  return (
    <div>
      <div>{t.welcome}</div>
      <div>{lang}</div>
      <div onClick={change}>change</div>
    </div>
  );
};

export default App;
```

6. Done, you can check localstorage。

完成了，打开 localstorage 查看如何运作

## How it works? 原理：

- Detects your browser lang
- Try to find locales in locales storages
- If locales are not in locales storages or lang store in local storage is different that the browser lang
  - Load accurate locales, if it doesn't find one matching the browser lang, fallback to `zh-CN`
  - Set downloaded locales and lang in localStorage
- Add locales in context

- 检查浏览器语言
- 检查 localstorage 里有没有缓存
- 如果没有缓存则把语言文件缓存到 localstorage
  - 如果没有检测到浏览器语言，则默认为简体中文
  - 在 localstorage 中设置语言和语言文件
- 添加本地化到 context 中

### Feel free to open PR/Issues
