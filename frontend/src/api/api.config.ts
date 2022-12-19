/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export default {

  // 用户登录
  login(data: any) {
    return axios.post('/api/user/login', data);
  },
  // 用户注册
  register(data: any) {
    return axios.post('/api/user/register', data);
  },
  // 发送验证码
  sendCode(data: any) {
    return axios.post('/api/user/sendCode', data);
  },
  // 获取用户信息
  getCurrentUserInfo() {
    return axios.get('/api/user/getCurrentUserInfo');
  },
  // 获取用户信息
  getUserInfo(data: any) {
    return axios.get('/api/user/getUserInfo', {
      params: data,
    });
  },
  // 修改密码
  updatePassword(data: any) {
    return axios.post('/api/user/updatePassword', data);
  },
  // 保存用户信息
  updateUserInfo(data: any) {
    return axios.post('/api/user/updateUserInfo', data);
  },


  // 文章列表
  getArticleList(data: any) {
    return axios.get('/api/article/getArticleList', {
      params: data,
    });
  },
  // 用户文章列表
  getUserArticleList(data: any) {
    return axios.get('/api/article/getUserArticleList', {
      params: data,
    });
  },
  // 获取文章
  getArticle(data: any) {
    return axios.get('/api/article/getArticle', {
      params: data,
    });
  },
  // 文章详情
  getArticleDetail(data: any) {
    return axios.get('/api/article/getArticleDetail', {
      params: data,
    });
  },
  // 新增文章
  createArticle(data: any) {
    return axios.post('/api/article/createArticle', data);
  },
  // 更新文章
  updateArticle(data: any) {
    return axios.post('/api/article/updateArticle', data);
  },
  // 更改文章状态
  changeArticleStatus(data: any) {
    return axios.post('/api/article/changeArticleStatus', data);
  },
  // 删除文章
  delArticle(data: any) {
    return axios.post('/api/article/delArticle', data);
  },
  // 用户文章总数
  getUserArticleCount(data: any) {
    return axios.get('/api/article/userArticleCount', {
      params: data,
    });
  },


  // 文章标签列表
  getTagList() {
    return axios.get('/api/tag/getTagList');
  },


  // 获取文章评论
  getArticleComment(data: any) {
    return axios.get('/api/comment/getArticleComment', {
      params: data,
    });
  },
  // 新增文章评论
  addArticleComment(data: any) {
    return axios.post('/api/comment/addArticleComment', data);
  },
  // 删除文章评论
  delArticleComment(data: any) {
    return axios.post('/api/comment/delArticleComment', data);
  },


  HEADER_PHOTO_URL: '/api/photo/uploadHeaderPhoto', // 头像上传接口
  ARTICLE_PHOTO_URL: '/api/photo/uploadArticlePhoto', // 文章照片上传接口
  PHOTO_WALL_URL: '/api/photo/uploadPhotoWall', // 照片墙上传接口
  // 照片列表
  getPhotoList(data: any) {
    return axios.get('/api/photo/getPhotoList', {
      params: data,
    });
  },
  // 用户照片列表
  getUserPhotoList(data: any) {
    return axios.get('/api/photo/getUserPhotoList', {
      params: data,
    });
  },
  // 编辑照片描述
  editPhotoDescribe(data: any) {
    return axios.post('/api/photo/editDescribe', data);
  },
  // 删除照片
  delPhoto(data: any) {
    return axios.post('/api/photo/delPhoto', data);
  },
  // 照片点赞
  likePhoto(data: any) {
    return axios.post('/api/photo/likePhoto', data);
  },
  // 用户照片总数
  getUserPhotoCount(data: any) {
    return axios.get('/api/photo/userPhotoCount', {
      params: data,
    });
  },
};
