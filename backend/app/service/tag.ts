import { Service } from 'egg';
import * as mongoose from 'mongoose';

import Tag from '../interface/tag';

export default class TagService extends Service {


  /** 所有标签
   *
   *
   *
   */
  async getTagList(): Promise<Array<Tag>> {
    return await this.ctx.model.Tag.find();
  }


  /** 查找特定标签
   *
   * @param tag_name 标签名
   */
  async findTag(tag_name: string): Promise<Tag> {
    const tag = {
      tag_name,
    };
    return await this.ctx.model.Tag.findOne(tag);
  }


  /** 统计标签的文章数
   *
   * @param tag_id 标签id
   */
  async findTagArticle(tag_id: string): Promise<number> {
    return await this.ctx.model.Article.findOne({
      tag_id: mongoose.Types.ObjectId(tag_id),
    }).count();
  }


  /** 手动添加标签
   *
   * @param tag_name 标签名
   * @param sort_id 权重
   */
  async addTag(tag_name: string, sort_id: number): Promise<Tag> {
    const tag_detail: Tag = await this.service.tag.findTag(tag_name);
    if (tag_detail !== null) {
      throw '该标签已存在~';
    }
    const tag = {
      tag_name,
      sort_id,
    };
    return await this.ctx.model.Tag.create(tag);
  }


  /** 手动删除标签
   *
   * @param tag_name 标签名
   */
  async delTag(tag_name: string): Promise<void> {
    const tag_detail: Tag = await this.service.tag.findTag(tag_name);
    if (tag_detail === null) {
      throw '不存在的标签~';
    }
    const tag_id = String(tag_detail._id);
    const tag_article_count: number = await this.service.tag.findTagArticle(tag_id);
    if (tag_article_count !== 0) {
      throw '该标签下存在文章，无法删除~';
    }
    const tag = {
      _id: mongoose.Types.ObjectId(tag_id),
    };
    await this.ctx.model.Tag.deleteOne(tag);
  }


}
