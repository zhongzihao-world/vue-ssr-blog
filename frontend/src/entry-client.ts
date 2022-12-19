/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import Vue from 'vue';
import { createApp } from './main';
import './api/axios.config';
import './utils/index';

// 这两个东西只有js版本
const { clientPlugin } = require('vue-ssr-prefetcher');

Vue.use(clientPlugin);

if (process.env.NODE_ENV !== 'production') {
  require('element-ui/lib/theme-chalk/index.css');
  require('../public/css/reset.css');
  require('../public/css/base.css');
  require('../public/css/common.css');
  const ElementUI = require('element-ui');
  Vue.use(ElementUI);
}

const { app, router } = createApp();


router.onReady(() => {
  const { $$selfStore } = window.__INITIAL_STATE__ || { $$selfStore: {} };
  if ($$selfStore) app.$$selfStore = $$selfStore;

  // Promise.resolve(() => {
  //   app.$mount('#app');
  // });
  // setTimeout(() => {
  //   app.$mount('#app');
  // }, 0);
  clientPlugin.$$resolved = true;
});
app.$mount('#app');
