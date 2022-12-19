/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const TIMEOUT_RIME = 60;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout = TIMEOUT_RIME * 1000;

axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const acess_token = await Vue.prototype.$getCacheData('acess_token');
    // console.log(acess_token);
    if (acess_token) {
      config.headers.acess_token = acess_token;
    }
    return config;
  },
  (err: any) => Promise.reject(err),
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.ret === 200) {
      return response;
    } else if (response.data.ret === 304) {
      Vue.prototype.$global_fail(response.data.content);
      setTimeout(() => {
        Vue.prototype.$clearCache();
        window.location.href = `${window.location.origin + window.location.pathname}#/login`;
      }, 500);
      return Promise.reject(response);
    } else {
      Vue.prototype.$global_fail(response.data.content);
      return Promise.reject(response);
    }
  },
  (err: any) => {
    console.log(err);
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      Vue.prototype.$global_error('请求超时，请联系管理员');
    }
    if (err.response) {
      Vue.prototype.$global_error(decodeURI(err.response.data.msg || err.response.data.message));
    }
    return Promise.reject(err);
  },
);
