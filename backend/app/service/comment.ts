import { Service } from 'egg';
import * as mongoose from 'mongoose';

import Comment from '../interface/comment';

export default class CommentService extends Service {


  /** 获取文章评论
   * 
   * @param article_id 文章id
   */
  async getArticleComment(article_id: string): Promise<Array<Comment>> {
    const search = {
      article_id: mongoose.Types.ObjectId(article_id),
    };
    return await this.ctx.model.Comment
      .aggregate([
        { $match: search },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'comment_user_info',
          },
        },
        { $unwind: '$comment_user_info' },
        {
          $project: {
            article_id: 1,
            created_time: 1,
            content: 1,
            user_id: '$comment_user_info._id',
            header: '$comment_user_info.header',
            nick_name: '$comment_user_info.nick_name',
          },
        },
        { $sort: { _id: -1 } },
      ]);
  }


  /** 新增文章评论
   *
   * @param article_id 文章id
   * @param comment_text 评论内容
   * @param user_id 用户id
   *
   */
  async addArticleComment(article_id: string, comment_text: string, user_id): Promise<Array<Comment>> {
    const comment = {
      article_id: mongoose.Types.ObjectId(article_id),
      user_id: mongoose.Types.ObjectId(user_id),
      content: comment_text,
    };
    return await this.ctx.model.Comment.create(comment);
  }


  /** 删除文章评论
   * 
   * @param comment_id 评论id
   */
  async delArticleComment(comment_id: number): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(comment_id),
    };
    await this.ctx.model.Comment.deleteOne(search);
  }


  /** 删除文章的所有评论
   * 
   * @param article_id 文章id
   */
  async delAllArticleComment(article_id: string): Promise<void> {
    const search = {
      article_id: mongoose.Types.ObjectId(article_id),
    };
    await this.ctx.model.Comment.remove(search);
  }


}
