import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // 用户注册
  router.post('/api/user/register', controller.user.register);
  // 用户登录
  router.post('/api/user/login', controller.user.login);
  // 发送验证码
  router.post('/api/user/sendCode', controller.user.sendCode);
  // 获取当前用户信息
  router.get('/api/user/getCurrentUserInfo', controller.user.getCurrentUserInfo);
  // 获取用户信息
  router.get('/api/user/getUserInfo', controller.user.getUserInfo);
  // 更新用户信息
  router.post('/api/user/updateUserInfo', controller.user.updateUserInfo);
  // 修改密码
  router.post('/api/user/updatePassword', controller.user.updatePassword);


  // 文章列表
  router.get('/api/article/getArticleList', controller.article.getArticleList);
  // 用户文章列表
  router.get('/api/article/getUserArticleList', controller.article.getUserArticleList);
  // 获取指定文章的所有信息
  router.get('/api/article/getArticleDetail', controller.article.getArticleDetail);
  // 新增文章
  router.post('/api/article/createArticle', controller.article.createArticle);
  // 更新文章
  router.post('/api/article/updateArticle', controller.article.updateArticle);
  // 删除文章
  router.post('/api/article/delArticle', controller.article.delArticle);
  // 更改文章状态
  router.post('/api/article/changeArticleStatus', controller.article.changeArticleStatus);
  // 用户文章总数
  router.get('/api/article/userArticleCount', controller.article.userArticleCount);

  // 标签列表
  router.get('/api/tag/getTagList', controller.tag.getTagList);


  // 获取文章评论
  router.get('/api/comment/getArticleComment', controller.comment.getArticleComment);
  // 新增文章评论
  router.post('/api/comment/addArticleComment', controller.comment.addArticleComment);
  // 删除文章评论
  router.post('/api/comment/delArticleComment', controller.comment.delArticleComment);


  // 头像上传接口
  router.post('/api/photo/uploadHeaderPhoto', controller.photo.uploadHeaderPhoto);
  // 上传文章照片
  router.post('/api/photo/uploadArticlePhoto', controller.photo.uploadArticlePhoto);
  // 上传照片墙照片
  router.post('/api/photo/uploadPhotoWall', controller.photo.uploadPhotoWall);
  // 照片列表
  router.get('/api/photo/getPhotoList', controller.photo.getPhotoList);
  // 用户照片列表
  router.get('/api/photo/getUserPhotoList', controller.photo.getUserPhotoList);
  // 编辑照片描述
  router.post('/api/photo/editDescribe', controller.photo.editPhotoDescribe);
  // 删除照片
  router.post('/api/photo/delPhoto', controller.photo.delPhoto);
  // 照片点赞
  router.post('/api/photo/likePhoto', controller.photo.likePhoto);
  // 用户照片总数
  router.get('/api/photo/userPhotoCount', controller.photo.userPhotoCount);
};
