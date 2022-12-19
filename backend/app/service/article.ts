
import { Service } from 'egg';
import * as mongoose from 'mongoose';

import Article from '../interface/article';

export default class ArticleService extends Service {


  /** 推荐文章列表
   *
   * @param current_page 当前页码
   * @param page_size 页数
   * @param key_word 搜索值
   * @param current_tag_id 当前标签ID
   */
  async getRecommendArticleList(current_page: number, page_size: number, key_word?: string, current_tag_id?: string): Promise<Array<Article>> {
    const search: any = {
      status: true,
    };
    if (key_word) {
      // 标题  模糊查找
      search.title = new RegExp(key_word);
    }
    if (current_tag_id) {
      search.tag_id = mongoose.Types.ObjectId(current_tag_id);
    }
    return await this.ctx.model.ArticleRecommend
      .aggregate([
        { $sort: { _id: -1 } }, // 默认按照创建时间倒序
        {
          $lookup: {
            from: 'articles',
            localField: 'article_id',
            foreignField: '_id',
            as: 'article_info',
          },
        },
        { $unwind: '$article_info' },
        {
          $lookup: {
            from: 'tags',
            localField: 'article_info.tag_id',
            foreignField: '_id',
            as: 'tag_info',
          },
        },
        { $unwind: '$tag_info' },
        {
          $lookup: {
            from: 'users',
            localField: 'article_info.user_id',
            foreignField: '_id',
            as: 'user_info',
          },
        },
        { $unwind: '$user_info' },
        {
          $project: {
            _id: '$article_info._id',
            mark_content: '$article_info.mark_content',
            content: '$article_info.content',
            image: '$article_info.image',
            images: '$article_info.images',
            pv: '$article_info.pv',
            status: '$article_info.status',
            title: '$article_info.title',
            created_time: '$article_info.created_time',
            updated_time: '$article_info.updated_time',
            weather: '$article_info.weather',
            user_id: '$article_info.user_id',
            tag_id: '$article_info.tag_id',
            tag_name: '$tag_info.tag_name',
            nick_name: '$user_info.nick_name',
          },
        },
        { $match: search },
        { $skip: page_size * (current_page - 1) },
        { $limit: page_size },
      ]);
  }


  /** 文章列表
   *
   * @param current_page 当前页码
   * @param page_size 页数
   * @param key_word 搜索值
   * @param current_tag_id 当前标签ID
   */
  async getArticleList(current_page: number, page_size: number, key_word?: string, current_tag_id?: string): Promise<Array<Article>> {
    const search: any = {
      status: true,
    };
    if (key_word) {
      // 标题  模糊查找
      search.title = new RegExp(key_word);
    }
    if (current_tag_id) {
      search.tag_id = mongoose.Types.ObjectId(current_tag_id);
    }
    return await this.ctx.model.Article
      .aggregate([
        { $match: search },
        { $sort: { created_time: -1 } }, // 默认按照创建时间倒序
        { $skip: page_size * (current_page - 1) },
        { $limit: page_size },
        {
          $lookup: {
            from: 'tags',
            localField: 'tag_id',
            foreignField: '_id',
            as: 'tag_info',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_info',
          },
        },
        { $unwind: '$tag_info' },
        { $unwind: '$user_info' },
        {
          $project: {
            mark_content: 1,
            content: 1,
            image: 1,
            images: 1,
            pv: 1,
            status: 1,
            title: 1,
            created_time: 1,
            updated_time: 1,
            weather: 1,
            user_id: 1,
            tag_name: '$tag_info.tag_name',
            nick_name: '$user_info.nick_name',
          },
        },
      ]);
  }


  /** 用户文章列表 做一下验证，判断是否是作者本人，本人能看到私有的文章
  *
  * 本人能看到私有的文章
  *
  * @param user_id 用户id
  * @param current_page 当前页码
  * @param page_size 页数
  */
  async getUserArticleList(user_id: string, current_page: number, page_size: number): Promise<Array<Article>> {
    const is_user_himself: boolean = await this.service.user.isAuthorHimself(user_id); // 是否是作者本人
    const search: any = {
      user_id: mongoose.Types.ObjectId(user_id),
      $or: is_user_himself ? [{ status: true }, { status: false }] : [{ status: true }, { status: true }],
    };
    // console.log(search);
    return await this.ctx.model.Article
      .aggregate([
        { $match: search },
        { $sort: { _id: -1 } },
        { $skip: page_size * (current_page - 1) },
        { $limit: page_size },
        {
          $lookup: {
            from: 'tags',
            localField: 'tag_id',
            foreignField: '_id',
            as: 'tag_info',
          },
        },
        { $unwind: '$tag_info' },
        {
          $project: {
            mark_content: 1,
            content: 1,
            image: 1,
            images: 1,
            pv: 1,
            status: 1,
            title: 1,
            created_time: 1,
            updated_time: 1,
            weather: 1,
            user_id: 1,
            tag_name: '$tag_info.tag_name',
          },
        },
        { $sort: { _id: -1 } },
      ]);
  }


  /** 获取文章所有信息
   *
   * @param article_id 文章id
   */
  async getArticleDetail(article_id) {
    const search = {
      _id: mongoose.Types.ObjectId(article_id),
    };
    return await this.ctx.model.Article.aggregate([
      { $match: search },
      {
        $lookup: {
          from: 'tags',
          localField: 'tag_id',
          foreignField: '_id',
          as: 'tag_info',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      { $unwind: '$tag_info' },
      { $unwind: '$user_info' },
      {
        $project: {
          mark_content: 1,
          content: 1,
          user_id: 1,
          tag_id: 1,
          image: 1,
          images: 1,
          pv: 1,
          status: 1,
          title: 1,
          created_time: 1,
          updated_time: 1,
          weather: 1,
          tag_name: '$tag_info.tag_name',
          user_info: '$user_info',
        },
      },
    ]);
    // return await this.ctx.model.Article.findOne(search).populate('tags');
  }


  /** 新建文章
   *
   * @param user_id 用户id
   * @param tag_id 标签id
   * @param title 文章标题
   * @param status 状态
   * @param mark_content 内容
   * @param content 内容
   * @param weather 天气
   * @param image 图片
   * @param images 图片列表
   */
  async createArticle(user_id, tag_id, title, status, mark_content, content, weather, image, images): Promise<Article> {
    const article: Article = {
      user_id: mongoose.Types.ObjectId(user_id),
      tag_id: mongoose.Types.ObjectId(tag_id),
      title,
      status,
      mark_content,
      content,
      weather,
      image,
      images,
    };
    return await this.ctx.model.Article.create(article);
  }


  /** 更新文章
   *
   * @param _id 文章id
   * @param user_id 用户id
   * @param tag_id 标签id
   * @param title 标题
   * @param status 状态
   * @param mark_content 内容
   * @param content 内容
   * @param weather 天气
   * @param image 图片
   * @param images 图片列表
   */
  async updateArticle(_id, user_id, tag_id, title, status, mark_content, content, weather, image, images): Promise<Article> {
    const search = {
      _id: mongoose.Types.ObjectId(_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    const set = {
      $set: {
        tag_id,
        title,
        status,
        mark_content,
        content,
        weather,
        image,
        images,
        updated_time: new Date(),
      },
    };
    return await this.ctx.model.Article.findOneAndUpdate(search, set, { new: true });
  }


  /** 更改文章状态
   *
   * @param article_id 文章id
   * @param user_id 用户id
   * @param status 文章状态 true/false 公开/不公开
   */
  async changeArticleStatus(article_id: string, user_id, status: boolean) {
    const search = {
      _id: mongoose.Types.ObjectId(article_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    const operation = {
      $set: {
        status,
      },
    };
    return await this.ctx.model.Article.findOneAndUpdate(search, operation);
  }


  /** 文章pv自增
   *
   * @param article_id 文章id
   */
  async articlePvAdd(article_id): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(article_id),
    };
    const operation: any = {
      $inc: {
        pv: 1,
      },
    };
    await this.ctx.model.Article.findOneAndUpdate(search, operation);
  }


  /** 删除文章
   *
   * @param article_id 文章id
   * @param user_id 用户id
   *
   */
  async delArticle(article_id: string, user_id): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(article_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    await this.ctx.model.Article.deleteOne(search);
    await this.ctx.model.ArticleRecommend.deleteOne({
      article_id: mongoose.Types.ObjectId(article_id),
      user_id: mongoose.Types.ObjectId(user_id),
    });
  }


  /** 用户文章总数  做一下验证，判断是否是作者本人，本人能看到私有的文章
  *
  * @param user_id 照片id
  */
  async userArticleCount(user_id): Promise<number> {
    const is_user_himself: boolean = await this.service.user.isAuthorHimself(user_id); // 是否是作者本人
    const search = {
      user_id: mongoose.Types.ObjectId(user_id),
      $or: is_user_himself ? [{ status: true }, { status: false }] : [{ status: true }, { status: true }],
    };
    return await this.ctx.model.Article.find(search).count();
  }


}
