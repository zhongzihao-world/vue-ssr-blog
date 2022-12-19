// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportArticle from '../../../app/service/article';
import ExportCode from '../../../app/service/code';
import ExportComment from '../../../app/service/comment';
import ExportPhoto from '../../../app/service/photo';
import ExportQiniu from '../../../app/service/qiniu';
import ExportTag from '../../../app/service/tag';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    article: AutoInstanceType<typeof ExportArticle>;
    code: AutoInstanceType<typeof ExportCode>;
    comment: AutoInstanceType<typeof ExportComment>;
    photo: AutoInstanceType<typeof ExportPhoto>;
    qiniu: AutoInstanceType<typeof ExportQiniu>;
    tag: AutoInstanceType<typeof ExportTag>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
