import React, { useState, useEffect, createContext, useContext } from 'react';

// source from https://github.com/streamich/react-use
const isClient = typeof window === 'object';
const useLocalStorage = (key, initialValue, raw) => {
  if (!isClient) {
    return [initialValue, () => {}];
  }

  const [state, setState] = useState(() => {
    try {
      const localStorageValue = localStorage.getItem(key);

      if (typeof localStorageValue !== 'string') {
        localStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue));
        return initialValue;
      } else {
        return raw ? localStorageValue : JSON.parse(localStorageValue || 'null');
      }
    } catch (_unused) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      const serializedState = raw ? String(state) : JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    } catch (_unused2) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
    }
  });
  return [state, setState];
};

const Context = createContext();
const TransProvider = _ref => {
  let { i18n, children } = _ref;

  if (!i18n) {
    throw new Error('No i18n provide.');
  }

  const [lang, setLang] = useLocalStorage('lang', undefined);
  const [locales, setLocales] = useLocalStorage('locales', undefined);
  useEffect(() => {
    // load lang
    let currentLang = lang;

    if (!lang) {
      const { navigator } = window;

      if (navigator) {
        const { language, userLanguage, languages } = navigator;
        currentLang =
          language || userLanguage || (languages && languages.length && languages[0]) || 'zh-CN';
      }

      setLang(currentLang);
      return;
    } // load locales

    if (
      !locales ||
      !locales.date ||
      !locales.lang ||
      locales.lang !== currentLang ||
      Date.now() - locales.date > 86400000
    ) {
      setLocales({
        data: i18n[currentLang],
        lang: currentLang,
        date: Date.now(),
      });
    }
  });

  const getMessages = () => locales.data;

  const setNewLang = newLang => {
    setLang(newLang);
    setLocales({
      data: i18n[newLang],
      lang: newLang,
      date: Date.now(),
    });
  };

  if (!locales) return React.createElement('div', null, 'loading\u2026');
  return React.createElement(
    Context.Provider,
    {
      value: {
        lang,
        locales,
        getMessages,
        setNewLang,
      },
    },
    children,
  );
};
const useI18n = path => {
  const { getMessages } = useContext(Context);
  return getMessages(path);
};
const setLang = () => {
  const { lang, setNewLang } = useContext(Context);
  return [lang, setNewLang];
};

export { TransProvider, setLang, useI18n, useLocalStorage };
