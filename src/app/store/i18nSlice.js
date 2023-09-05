import { createSelector, createSlice } from '@reduxjs/toolkit';
import i18n from 'src/i18n';
import { setDefaultSettings } from './fuse/settingsSlice';

export const changeLanguage = (languageId) => (dispatch, getState) => {
  const { direction } = getState().fuse.settings.defaults;

  const newLangDirection = i18n.dir(languageId);

  /*
    If necessary, change theme direction
     */
  if (newLangDirection !== direction) {
    dispatch(setDefaultSettings({ direction: newLangDirection }));
  }

  /*
    Change Language
     */
  return i18n.changeLanguage(languageId).then(() => {
    // if(languageId=='in'){

    // }
    dispatch(i18nSlice.actions.languageChanged(languageId));
  });
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState: {
    language: i18n.options.lng,
    languages: [
      { id: 'en', title: 'English', flag: 'US' },
      { id: 'de', title: 'Deutsch', flag: 'DE' },
      { id: 'fr', title: 'Français', flag: 'FR' },
      { id: 'in', title: 'हिन्दी', flag: 'IN' },
      { id: 'mld', title: 'मराठी', flag: 'IN' },
      { id: 'tmr', title: 'தமிழ்', flag: 'IN' },
      { id: 'br', title: 'Português', flag: 'BR' },
      { id: 'tr', title: 'Türkçe', flag: 'TR' },
      { id: 'ph', title: 'Filipino', flag: 'PH' },
      { id: 'jp', title: '日本語', flag: 'JP' },
      { id: 'pl', title: 'Polski', flag: 'PL' },
      { id: 'vn', title: 'Tiếng Việt', flag: 'VN' },
      { id: 'kr', title: '한국어', flag: 'KR' },
      { id: 'id', title: 'Indonesian', flag: 'ID' },
      { id: 'es', title: 'Español', flag: 'ES' },
      { id: 'ru', title: 'Pусский', flag: 'RU' },
      { id: 'fi', title: 'Suomen', flag: 'FI' },
      { id: 'th', title: 'แบบไทย', flag: 'TH' },
      { id: 'ae', title: 'عربي', flag: 'AE' },
      { id: 'my', title: 'Melayu', flag: 'MY' },
      { id: 'bd', title: 'বাংলা', flag: 'BD' },
      { id: 'hk', title: '繁体', flag: 'HK' },
      { id: 'cn', title: '简体', flag: 'CN' },
      { id: 'mm', title: '繁体', flag: 'MM' },
      { id: 'pak', title: '简体', flag: 'Pak' },
    ],
  },

  reducers: {
    languageChanged: (state, action) => {
      window.localStorage.setItem('lang', action.payload);
      state.language = action.payload;

      if (action.payload === "cn" || action.payload === "hk") {
        document.querySelector(":root").style.setProperty("--title-family", 'pfht_z');
        document.querySelector(":root").style.setProperty("--title-family2", 'pfht_z');
        document.querySelector(":root").style.setProperty("--title-family3", 'pfht_z');

      } 
      else if (action.payload === "jp") {
        document.querySelector(":root").style.setProperty("--title-family", 'jpTxt');
        document.querySelector(":root").style.setProperty("--title-family2", 'jpTxt');
        document.querySelector(":root").style.setProperty("--title-family3", 'jpTxt');

      } 
      else if (action.payload === "ae") {
        document.querySelector(":root").style.setProperty("--title-family", 'aeTxt');
        document.querySelector(":root").style.setProperty("--title-family2", 'aeTxt');
        document.querySelector(":root").style.setProperty("--title-family3", 'aeTxt');
      } else if (action.payload === "in") {
        document.querySelector(":root").style.setProperty("--title-family", 'inTxt');
        document.querySelector(":root").style.setProperty("--title-family2", 'inTxt');
        document.querySelector(":root").style.setProperty("--title-family3", 'inTxt');
      } else if (action.payload === "mld") {
        document.querySelector(":root").style.setProperty("--title-family", 'inTxt');
        document.querySelector(":root").style.setProperty("--title-family2", 'inTxt');
        document.querySelector(":root").style.setProperty("--title-family3", 'inTxt');
      } else if (action.payload === "tmr") {
        document.querySelector(":root").style.setProperty("--title-family", 'tmrTxt');
        document.querySelector(":root").style.setProperty("--title-family2", 'tmrTxt');
        document.querySelector(":root").style.setProperty("--title-family3", 'tmrTxt');
      } 
      else {
        document.querySelector(":root").style.setProperty("--title-family", 'Inter var,Roboto,"Helvetica",Arial,sans-serif');
        document.querySelector(":root").style.setProperty("--title-family2", 'Furore');
        document.querySelector(":root").style.setProperty("--title-family3", 'falconpunch');

      }
    },
  },
});

export const selectCurrentLanguageId = ({ i18n: _i18n }) => _i18n.language;

export const selectLanguages = ({ i18n: _i18n }) => _i18n.languages;

export const selectCurrentLanguageDirection = createSelector([selectCurrentLanguageId], (id) => {
  return i18n.dir(id);
});

export const selectCurrentLanguage = createSelector(
  [selectCurrentLanguageId, selectLanguages],
  (id, languages) => {
    return languages.find((lng) => lng.id === id);
  }
);

export default i18nSlice.reducer;
