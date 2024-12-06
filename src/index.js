// Internet Explorer 11 requires polyfills and partially supported by this project.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import './i18n';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import React from 'react';
import {api, apiGet} from "./app/api";
import store from "./app/store";
import { loadCss } from './app/util/tools/utils';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

// 挂载全局方法
React.$api = api;
React.$apiGet = apiGet;
React.$store = store;
// 加载字体css
loadCss("https://scource-static.funibet.com/funibet/css/font.css");
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
