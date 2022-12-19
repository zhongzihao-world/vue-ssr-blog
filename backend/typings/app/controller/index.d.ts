// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/controller/article';
import ExportComment from '../../../app/controller/comment';
import ExportPhoto from '../../../app/controller/photo';
import ExportTag from '../../../app/controller/tag';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    article: ExportArticle;
    comment: ExportComment;
    photo: ExportPhoto;
    tag: ExportTag;
    user: ExportUser;
  }
}
