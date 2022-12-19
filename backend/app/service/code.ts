
import { Service } from 'egg';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

import Code from '../interface/cpde';

const mail_config: any = {
  service: 'qq', // 网易163邮箱 smtp.163.com
  port: 465, // 网易邮箱端口 25
  auth: {
    user: 'xxx@qq.com', // 邮箱账号
    pass: 'xxx', // 邮箱的授权码
  },
};

// 验证码有效期
const expired_minure = 10;
const expired_time: number = expired_minure * 60 * 1000;

export default class CodeService extends Service {


  /** 发送邮箱验证码
   *
   * @param email 验证码
   */
  async sendCode(email: string) {

    // 是否注册过
    const data_user = await this.ctx.model.User.findOne({ email });
    if (data_user) throw ('您已注册过~');

    // 生成随机数
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    // 防止重复发送
    const data_code: Code = await this.ctx.model.Code.findOne({
      email,
    });
    if (!data_code) {
      // 入库
      const code_: Code = {
        email,
        code,
        created_time: new Date(),
        expired_time,
      };
      await this.ctx.model.Code.create(code_);
      // 邮件配置项
      const mail_options = {
        from: 'xxx@qq.com',
        to: email,
        subject: `欢迎注册,您的验证码为:${code},有效期为${expired_minure}分钟.`,
        text: `${code}`,
      };
      // 创建一个SMTP客户端对象 发送邮件
      const transporter = nodemailer.createTransport(mail_config);
      await transporter.sendMail(mail_options);
    } else {
      // 检查验证码是否过期
      const old = new Date(data_code.created_time).getTime();
      const now = new Date().getTime();
      const flag = !((old + data_code.expired_time) - now > 0);
      if (flag) {
        await this.ctx.model.Code.deleteOne({ email });
        throw '验证码已过期，请重新发送~';
      } else {
        throw '请勿重复发送验证码';
      }
    }
  }


  /** 检查验证码是否正确
   *
   * @param code_num  验证码
   * @param email 邮箱
   */
  async checkCode(code_num: string, email: string): Promise<void> {
    const data_code: Code = await this.service.model.findOne('Code', {
      email,
    });
    if (!data_code) throw new Error('请发送验证码~');
    if (data_code.code !== code_num) throw new Error('验证码错误');
  }
}
