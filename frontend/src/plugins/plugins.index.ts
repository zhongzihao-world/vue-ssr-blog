/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import Vue from 'vue';

const Header = () => import('./Header.vue');
const Footer = () => import('./Footer.vue');
const Loading = () => import('./Loading.vue');
const PhotoDetail = () => import('./PhotoDetail.vue');
const UploadPhoto = () => import('./UploadPhoto.vue');
const WaterFall = () => import('./WaterFall.vue');
const BottomLine = () => import('./BottomLine.vue');
const ScrollGoTop = () => import('./ScrollGoTop.vue');

const obj: any = {
  Header,
  Footer,
  Loading,
  PhotoDetail,
  UploadPhoto,
  WaterFall,
  BottomLine,
  ScrollGoTop,
};

Object.keys(obj).forEach(key => {
  Vue.component(`v${key}`, obj[key]);
});
