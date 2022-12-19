/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import mavonEditor from 'mavon-editor';


import App from './App.vue';
import { createRouter } from './router.index';
import { createStore } from './store.index';

import './plugins/plugins.index';

Vue.use(mavonEditor);

Vue.use(VueLazyload, {
  preLoad: 1.5,
  // eslint-disable-next-line global-require
  error: require('./assets/img/404.jpg'),
  // eslint-disable-next-line global-require
  loading: require('./assets/img/imgload.gif'),
  attempt: 1,
});

Vue.config.productionTip = false;

export function createApp(): any {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  return { app, router, store };
}
