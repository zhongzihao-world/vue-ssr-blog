
import { Service } from 'egg';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

import User from '../interface/user';

export default class UserService extends Service {

  private secret = '19960208ZZH';
  async createToken(user: User): Promise<string> {
    const payload = {
      _id: user._id,
      nick_name: user.nick_name,
      created_time: user.created_time,
      updated_time: user.updated_time,
    };
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }


  checkToken(token: string): User {
    try {
      return jwt.verify(token, this.secret);
    } catch (e) {
      throw '无效的token';
    }
  }

  /** 保存用户信息
   *
   * @param email 邮箱
   * @param password 密码
   * @param nick_name 昵称
   * @param sex 性别
   */
  async saveUser(email, password, nick_name, sex) {
    const user: User = {
      email,
      password,
      nick_name,
      created_time: new Date(),
      sex,
      header: sex === 1 ? `${this.app.config.URL}/sourse/default/boy.png` : `${this.app.config.URL}/sourse/default/girl.png`,
    };
    return await this.ctx.model.User.create(user);
  }


  /** 登录
   *
   * @param email 邮箱
   * @param password 密码
   */
  async login(email: string, password: string): Promise<User> {
    return await this.ctx.model.User.findOne({
      email,
      password,
    });
  }


  /** 验证邮箱是否注册
   *
   * @param email 邮箱
   */
  async isRegister(email: string) {
    const is_register = await this.service.model.findOne('User', {
      email,
    });
    if (is_register) throw '该邮箱已经注册过~';
  }


  /** 获取请求用户信息
   *
   * @param is_get_all 是否拿到所有数据
   */
  async getCurrentUserInfo(is_get_all = false): Promise<User> {
    const acess_token: any = this.ctx.request.header.acess_token;
    if (is_get_all) {
      const user: any = await this.ctx.service.user.checkToken(acess_token);
      return await this.service.user.getUserInfo(user._id);
    } else {
      return await this.service.user.checkToken(acess_token);
    }
  }


  /** 判断当前请求用户是否是作者本人
 *
 * @param search_user_id 查找的用户id
 */
  async isAuthorHimself(search_user_id: string): Promise<boolean> {
    const user = this.ctx.request.header.acess_token ? await this.service.user.getCurrentUserInfo() : null;
    const current_user_id = user ? String(user._id) : '';
    return current_user_id === search_user_id;
  }


  /** 获取用户信息
   *
   * @param user_id 用户id
   */
  async getUserInfo(user_id: string): Promise<User> {
    return await this.ctx.model.User.findOne({
      _id: mongoose.Types.ObjectId(user_id),
    });
  }


  /** 更新用户信息
   *
   * @param user_id 用户id
   * @param user 用户信息
   */
  async updateUserInfo(user_id: string, user: User): Promise<User> {
    user.birthday = new Date(user.birthday || '');
    const search = {
      _id: mongoose.Types.ObjectId(user_id),
    };
    const operation: any = {
      $set: {
        ...user,
      },
    };
    return await this.ctx.model.User.findOneAndUpdate(search, operation, {
      new: true,
    });
  }


  /** 修改密码
   *
   * @param email 邮箱
   * @param password 密码
   */
  async updatePassword(email: string, password: string): Promise<void> {
    const search = {
      email,
    };
    const operation: any = {
      $set: {
        password,
      },
    };
    await this.ctx.model.User.findOneAndUpdate(search, operation);
  }


}
