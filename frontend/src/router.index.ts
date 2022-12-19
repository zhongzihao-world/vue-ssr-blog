/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      /** 文章 */
      {
        path: '/',
        component: () => import('./views/Article/ArticleList.vue'),
      },
      {
        path: '/p/:aid',
        name: 'page',
        component: () => import('./views/Article/ArticleDetail.vue'),
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('./views/Article/Article.vue'),
      },
      {
        path: '/p/:aid/edit',
        name: 'edit',
        component: () => import('./views/Article/Article.vue'),
      },
      /** 照片 */
      {
        path: '/photo',
        name: 'photo',
        component: () => import('./views/Photo/PhotoWall.vue'),
      },
      /** 用户中心 */
      {
        path: '/login',
        component: () => import('./views/Login.vue'),
      },
      {
        path: '/reg',
        component: () => import('./views/Register.vue'),
      },
      {
        path: '/set',
        component: () => import('./views/User/UserSetting/Index.vue'),
        children: [{
          path: '',
          name: 'setIndex',
          component: () => import('./views/User/UserSetting/BasicSetting.vue'),
        }, {
          path: 'password',
          name: 'setPassword',
          component: () => import('./views/User/UserSetting/OtherSetting.vue'),
        }],
      },
      {
        path: '/u/:uid',
        component: () => import('./views/User/UserCenter/UserCenter.vue'),
        children: [{
          path: '',
          name: 'userIndex',
          component: () => import('./views/User/UserCenter/Article/UserArticle.vue'),
        }, {
          path: 'album',
          name: 'userAlbum',
          component: () => import('./views/User/UserCenter/Album/UserAlbum.vue'),
        }, {
          path: 'info',
          name: 'userInfo',
          component: () => import('./views/User/UserCenter/Info/UserInfo.vue'),
        }],
      },
    ],
  });
}
