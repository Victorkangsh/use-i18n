import React, { createContext, useEffect, useContext } from 'react';
import useLocalStorage from './useLocalStorage';

const getFromPath = (data, path) => path.split('.').reduce((curr, sub) => curr && curr[sub], data);

const Context = createContext();

export const TransProvider = ({ i18n, children }) => {
  if (i18n) {
    throw new Error('No i18n prvide.');
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
    }

    // load locales
    if (
      !locales ||
      !locales.date ||
      !locales.lang ||
      locales.lang !== currentLang ||
      Date.now() - locales.date > 86400000
    ) {
      setLocales({ data: i18n[currentLang], lang: currentLang, date: Date.now() });
    }
  });

  const getMessages = (path = '') => {
    if (path === '') return locales.data;
    return getFromPath(locales.data, path);
  };

  if (!locales) return <div>loading…</div>;

  return (
    <Context.Provider
      value={{
        lang,
        locales,
        getMessages,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useI18n = path => {
  const { getMessages } = useContext(Context);

  return getMessages(path);
};
