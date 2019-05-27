import React, { createContext, useEffect, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

const Context = createContext();

export const TransProvider = ({ i18n, children }) => {
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

  const getMessages = () => locales.data;

  const setNewLang = newLang => {
    setLang(newLang);
    setLocales({ data: i18n[newLang], lang: newLang, date: Date.now() });
  };

  if (!locales) return <div>loading…</div>;

  return (
    <Context.Provider
      value={{
        lang,
        locales,
        getMessages,
        setNewLang,
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

export const setLang = () => {
  const { lang, setNewLang } = useContext(Context);

  return [lang, setNewLang];
};
