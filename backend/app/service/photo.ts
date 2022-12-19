
import { Service } from 'egg';
import * as mongoose from 'mongoose';
import fs = require('fs');
import path = require('path');
import sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getImageSize = require('image-size');

import Photo from '../interface/photo';

export default class PhotoService extends Service {


  /** 图片保存到本地
   * 放到OutPut/souse文件夹下
   *
   * @param folder_name 存放文件夹名
   */
  async saveInLocal(folder_name: string, file_name?: string): Promise<string> {
    const stream = await this.ctx.getFileStream();
    const final_file_name = file_name ? file_name : Date.now() + '' + Math.floor(Math.random() * 100000) + path.extname(stream.filename).toLowerCase();
    const file_path = path.join(path.resolve(__dirname, `../../OutPut/sourse/${folder_name}/`), final_file_name);
    const writeStream = fs.createWriteStream(file_path);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (e) {
      await sendToWormhole(stream);
      throw e;
    }
    return `/sourse/${folder_name}/${final_file_name}`;
  }


  /** 删除本地照片
   *
   * @param local_url 本地地址
   */
  async delLocalPhoto(local_url: string): Promise<void> {
    try {
      await fs.unlinkSync(local_url);
    } catch (e) {
      console.log(e);
      this.ctx.logger.error(new Error(e));
      throw ('删除照片失败！');
    }
  }


  /** 保存照片数据
   *
   * @param user_id 用户id
   * @param local_url 图片本地地址
   * @param remote_url 图片远程地址
   */
  async savePhotoWall(user_id, local_url, remote_url): Promise<Photo> {
    /** img_datail 返回三个参数
     * { height: 126, width: 720, type: 'gif' }
     */
    interface ImgDatail {
      width: number;
      height: number;
      type?: string;
    }
    const img_datail: ImgDatail = getImageSize(local_url);
    // console.log(img_datail);
    const phopt: Photo = {
      user_id: mongoose.Types.ObjectId(user_id),
      url: remote_url,
      width: img_datail.width,
      height: img_datail.height,
      type: img_datail.type,
      created_time: new Date(),
      updated_time: new Date(),
      describe: '',
    };
    return await this.ctx.model.Photo.create(phopt);
  }


  /** 照片列表
   *
   * @param current_page 当前页
   * @param page_size size
   */
  async getPhotoList(current_page, page_size): Promise<Array<Photo>> {
    return await this.ctx.model.Photo.aggregate([
      { $sort: { _id: -1 } },
      { $skip: page_size * (current_page - 1) },
      { $limit: page_size },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' },
      {
        $project: {
          user_id: 1,
          url: 1,
          width: 1,
          height: 1,
          type: 1,
          created_time: 1,
          updated_time: 1,
          describe: 1,
          like_count: 1,
          nick_name: '$user_info.nick_name',
        },
      },
    ]);
  }


  /** 用户照片列表
   *
   * @param user_id 用户id
   * @param current_page 当前页
   * @param page_size size
   */
  async getUserPhotoList(user_id: string, current_page: number, page_size: number): Promise<Array<Photo>> {
    const search = {
      user_id: mongoose.Types.ObjectId(user_id),
    };
    return await this.ctx.model.Photo.aggregate([
      { $match: search },
      { $sort: { _id: -1 } },
      { $skip: page_size * (current_page - 1) },
      { $limit: page_size },
      {
        $project: {
          describe: 1,
          height: 1,
          created_time: 1,
          updated_time: 1,
          url: 1,
          user_id: 1,
          width: 1,
          like_count: 1,
        },
      },
    ]);
  }


  /** 编辑照片描述
   *
   * @param photo_id  照片id
   * @param user_id 用户id
   * @param describe 描述
   */
  async ediPhotoDescribe(photo_id, user_id, describe): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(photo_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    const operation: any = {
      describe,
      updated_time: new Date(),
    };
    // console.log(data);
    await this.ctx.model.Photo.findOneAndUpdate(search, operation);
  }


  /** 删除照片数据
   *
   * @param photo_id 照片id
   * @param user_id 用户id
   */
  async delPhoto(photo_id, user_id): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(photo_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    await this.ctx.model.Photo.deleteOne(search);
  }


  /** 照片pv自增
   *
   * @param photo_id 照片id
   */
  async photoPvAdd(photo_id): Promise<void> {
    const search = {
      _id: mongoose.Types.ObjectId(photo_id),
    };
    const operation: any = {
      $inc: {
        like_count: 1,
      },
    };
    await this.ctx.model.Photo.findOneAndUpdate(search, operation);
  }


  /** 用户照片总数
   *
   * @param user_id 照片id
   */
  async userPhotoCount(user_id): Promise<number> {
    const search = {
      user_id: mongoose.Types.ObjectId(user_id),
    };
    return await this.ctx.model.Photo.find(search).count();
  }


  /* --------------------------------------------------- */


  /** 用户是否已经点赞
   *
   * @param photo_id 照片id
   * @param user_id 用户id
   */
  async isLikePhoto(photo_id, user_id): Promise<boolean> {
    const search = {
      photo_id: mongoose.Types.ObjectId(photo_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    const photoLike = await this.ctx.model.PhotoLike.findOne(search);
    return !!photoLike;
  }


  /** 照片点赞  中间表  添加一个数据
   *
   * @param photo_id 照片id
   * @param user_id 用户id
   */
  async addPhotoLike(photo_id, user_id) {
    const photoLike = {
      photo_id: mongoose.Types.ObjectId(photo_id),
      user_id: mongoose.Types.ObjectId(user_id),
    };
    return await this.ctx.model.PhotoLike.create(photoLike);
  }


  /** 照片点赞  中间表 删除所有
   *
   * @param photo_id 照片id
   */
  async delPhotoLike(photo_id) {
    const search = {
      photo_id: mongoose.Types.ObjectId(photo_id),
    };
    return await this.ctx.model.PhotoLike.remove(search);
  }


}
