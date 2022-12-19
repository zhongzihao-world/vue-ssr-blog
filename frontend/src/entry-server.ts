/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import { createApp } from './main';

const { createServerPlugin } = require('vue-ssr-prefetcher');
const ElementUI = require('element-ui');

const serverPlugin = createServerPlugin();

function routerReady(router: any) {
  return new Promise(resolve => {
    router.onReady(resolve);
  });
}
export default async (context: any) => {
  Vue.use(createServerPlugin());
  Vue.use(ElementUI);
  const { app, router, store } = createApp();

  router.push(context.url);
  await routerReady(router);
  context.rendered = serverPlugin.done;
  context.state = {
    $$stroe: store ? store.state : undefined,
    $$selfStore: app.$$selfStore,
  };

  return app;
};
