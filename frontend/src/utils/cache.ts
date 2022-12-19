/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import localForage from 'localforage';

Vue.prototype.$setCacheData = async (key: string, data: any): Promise<void> => await localForage.setItem(key, data);
Vue.prototype.$getCacheData = async (key: string): Promise<string | null> => await localForage.getItem(key) || null;
Vue.prototype.$clearCache = () => localForage.clear();
