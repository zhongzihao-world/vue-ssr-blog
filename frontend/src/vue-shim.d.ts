/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { Store } from 'vuex';

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $store: Store<any>;

    $global_sucess: any;
    $global_fail: any;
    $global_error: any;
    $confirm: any;

    $setCacheData: any;
    $getCacheData: any;
    $clearCache: any;

    $throttle: any;

    $createFetcher: any;
  }
}


declare global {
  interface Window {
    __INITIAL_STATE__: any;
  }
}

// declare let window: any;
declare let document: any;
