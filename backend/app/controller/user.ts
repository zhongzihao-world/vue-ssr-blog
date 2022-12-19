import { Controller } from "egg";

export default class UserController extends Controller {
  async sendCode() {
    try {
      const { email } = this.ctx.request.body;

      await this.service.code.sendCode(email);
      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async register() {
    try {
      const { code_num, email, password, nick_name, sex } =
        this.ctx.request.body;

      await this.service.code.checkCode(code_num, email);
      await this.service.user.isRegister(email);
      const user = await this.service.user.saveUser(
        email,
        password,
        nick_name,
        sex
      );
      const token = await this.service.user.createToken(user);
      this.ctx.body = {
        ret: 200,
        content: token,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async login() {
    try {
      const { email, password } = this.ctx.request.body;

      const user = await this.service.user.login(email, password);
      if (!user) throw "没有找到该用户，登录失败~";
      const token = await this.service.user.createToken(user);
      this.ctx.body = {
        ret: 200,
        content: token,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async getCurrentUserInfo() {
    try {
      const user = await this.service.user.getCurrentUserInfo(true);
      const result = JSON.parse(JSON.stringify(user));

      this.ctx.body = {
        ret: 200,
        content: result,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 0,
        content: `${e}`,
      };
    }
  }

  async getUserInfo() {
    try {
      const { user_id } = this.ctx.query;

      const user = await this.service.user.getUserInfo(user_id);
      const result = JSON.parse(JSON.stringify(user));

      this.ctx.body = {
        ret: 200,
        content: result,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 0,
        content: `${e}`,
      };
    }
  }

  async updateUserInfo() {
    try {
      const req_param = this.ctx.request.body;

      const user = await this.service.user.updateUserInfo(
        req_param._id,
        req_param
      );
      this.ctx.body = {
        ret: 200,
        content: user,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async updatePassword() {
    try {
      const { email, password } = this.ctx.request.body;

      await this.service.user.updatePassword(email, password);
      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }
}
