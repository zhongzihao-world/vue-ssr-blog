/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

axios.defaults.baseURL = process.env.IS_NODE_ENV ? 'http://localhost:7001' : '';

export function createStore() {
  return new Vuex.Store({
    state: {
      user_info: {}, // 用户信息

      author_info: {}, // 个人中心作者信息

      loadingStatus: false,
      loadingText: '拼命加载中......',

      tag_list: [],
      article_list: [],
      article_status: false,

      article_detail: {},
      article_user_detail: {},
    },
    getters: {
    },
    mutations: {
      // 更新用户信息
      UPDATE_USER_INFO(state, user_info) {
        state.user_info = user_info;
      },
      // 退出登录
      USER_LOGOUT(state) {
        state.user_info = {};
      },

      // 作者信息
      UPDATE_AUTHOR_INFO(state, author_info) {
        state.author_info = author_info;
      },

      LOADING_SHOW(state) {
        state.loadingStatus = true;
      },
      LOADING_HIDE(state) {
        state.loadingStatus = false;
      },

      ADD_TAG_LIST(state, list) {
        state.tag_list = list;
      },
      CLEAR_ARTICLE_LIST(state) {
        state.article_list = [];
      },
      UPDATE_ARTICLE_LIST(state, list) {
        state.article_list = state.article_list.concat(list);
      },
      UPDATE_ARTICLE_STATUS(state, status: boolean) {
        state.article_status = status;
      },

      UPDATE_ARTICLE_DETAIL(state, article) {
        state.article_detail = article;
      },
      UPDATE_ARTICLE_USER_DETAIL(state, user) {
        state.article_user_detail = user;
      },
    },
    actions: {
      getTagList({ commit }) {
        return axios.get('/api/tag/getTagList')
          .then((res) => {
            // console.log(res.data);
            commit('ADD_TAG_LIST', res.data.content);
          });
      },
      getArticleList({ commit }, data) {
        return axios.get('/api/article/getArticleList', {
          params: data,
        })
          .then((res) => {
            // console.log(res.data);
            commit('UPDATE_ARTICLE_LIST', res.data.content);
            commit('UPDATE_ARTICLE_STATUS', res.data.content.length < data.page_size);
          });
      },
      getArticleDetail({ commit }, data) {
        return axios.get('/api/article/getArticleDetail', {
          params: data,
        })
          .then((res) => {
            // console.log(res.data);
            commit('UPDATE_ARTICLE_DETAIL', res.data.content[0]);
            commit('UPDATE_ARTICLE_USER_DETAIL', res.data.content[0].user_info);
          });
      },
    },
    modules: {
    },
  });
}
