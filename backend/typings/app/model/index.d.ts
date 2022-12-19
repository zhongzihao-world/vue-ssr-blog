// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/model/article';
import ExportArticleRecommend from '../../../app/model/article_recommend';
import ExportCode from '../../../app/model/code';
import ExportComment from '../../../app/model/comment';
import ExportPhoto from '../../../app/model/photo';
import ExportPhotoLike from '../../../app/model/photo_like';
import ExportTag from '../../../app/model/tag';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Article: ReturnType<typeof ExportArticle>;
    ArticleRecommend: ReturnType<typeof ExportArticleRecommend>;
    Code: ReturnType<typeof ExportCode>;
    Comment: ReturnType<typeof ExportComment>;
    Photo: ReturnType<typeof ExportPhoto>;
    PhotoLike: ReturnType<typeof ExportPhotoLike>;
    Tag: ReturnType<typeof ExportTag>;
    User: ReturnType<typeof ExportUser>;
  }
}
