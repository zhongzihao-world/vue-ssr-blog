 <template>
  <div class="container">
    <div class="col-md-6 center_block">
      <div class="reg_panel">
        <h4 class="reg_panel_tit">注册</h4>
        <el-form class="reg_panel_form" ref="register_form" :model="register_form" :rules="register_form_rule" size="small">
          <el-form-item prop="nick_name">
            <el-input placeholder="昵称" v-model="register_form.nick_name" type="text" clearable>
              <template slot="prepend">
                <i class="el-icon-user-solid"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input placeholder="邮箱" v-model="register_form.email" type="text" clearable>
              <template slot="prepend">
                <i class="el-icon-message"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" v-model="register_form.password" type="password" clearable>
              <template slot="prepend">
                <i class="el-icon-goods"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_repeat">
            <el-input placeholder="确认密码" v-model="register_form.password_repeat" type="password" clearable>
              <template slot="prepend">
                <i class="el-icon-s-goods"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code_num">
            <el-input placeholder="输入验证码" v-model="register_form.code_num" type="text" clearable>
              <template slot="prepend">
                <i class="el-icon-chat-dot-round"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="reg_panel_form_sex">
            <p class="sex_nan" :class="{sex_def: register_form.sex!==1}" @click="register_form.sex=1">
              <i class="el-icon-user-solid"></i>
            </p>
            <p class="sex_nv" :class="{sex_def: register_form.sex!==2}" @click="register_form.sex=2">
              <i class="el-icon-user"></i>
            </p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendCode" :disabled="code.is_send" style="width:100%;">{{code.code_msg}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="checkParam" style="width:100%;">注 册</el-button>
          </el-form-item>
          <el-form-item>
            <p style="text-align: right;">
              <router-link to="/login">已有账号登录</router-link>
            </p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { Component, Vue } from 'vue-property-decorator';

import api from '../api/api.config';

interface Code {
  time: number;
  time_interval: any;
  code_msg: string;
  is_send: boolean;
}

@Component({})
export default class Register extends Vue {
  code: Code = {
    time: 60,
    time_interval: null,
    code_msg: '发送验证码',
    is_send: false,
  };

  register_form = {
    nick_name: '',
    email: '',
    password: '',
    password_repeat: '',
    code_num: '',
    sex: 1,
  }

  register_form_rule = {
    nick_name: [
      { required: true, message: '请填写昵称~', trigger: 'change' },
    ],
    email: [
      { required: true, message: '请填写邮箱~', trigger: 'change' },
      { validator: this.checkEmail, trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请填写密码~', trigger: 'change' },
      { validator: this.checkPassword, trigger: 'change' },
    ],
    password_repeat: [
      { required: true, message: '请填写确认密码~', trigger: 'change' },
      { validator: this.checkPassword, trigger: 'change' },
      { validator: this.comparePassword, trigger: 'change' },
    ],
    code_num: [
      { required: true, message: '请填写验证码~', trigger: 'change' },
      { validator: this.checkCode, trigger: 'change' },
    ],
  }


  /* 方法 */
  checkEmail(rule: any, value: any, callback: any) {
    const reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
    const flag = reg.test(value);
    if (flag) {
      callback();
    } else {
      callback(new Error('邮箱格式错误！'));
    }
  }

  checkPassword(rule: any, value: any, callback: any) {
    if (value.length < 6 || value.length > 20) {
      callback(new Error('密码长度需在6~20位'));
    } else {
      callback();
    }
  }

  comparePassword(rule: any, value: any, callback: any) {
    if (this.register_form.password !== this.register_form.password_repeat) {
      callback(new Error('两次密码不一致!'));
    } else {
      callback();
    }
  }

  checkCode(rule: any, value: any, callback: any) {
    if (value.length !== 6) {
      callback(new Error('非法的验证码'));
    } else {
      callback();
    }
  }

  sendCode() {
    // eslint-disable-next-line prefer-destructuring
    const register_form: any = this.$refs.register_form;
    register_form.validateField('email', async (errorMessage: string) => {
      // console.log(errorMessage);
      if (errorMessage.length === 0) {
        this.$store.commit('LOADING_SHOW');
        try {
          await api.sendCode({
            email: this.register_form.email,
          });
          this.$global_sucess('发送验证码成功~');
          this.code.time_interval = setInterval(() => {
            this.sendTimeChange();
          }, 1000);
        } finally {
          this.$store.commit('LOADING_HIDE');
        }
      }
    });
  }

  sendTimeChange() {
    this.code.time--;
    this.code.code_msg = `请${this.code.time}秒后重试`;
    this.code.is_send = true;
    if (this.code.time === 0) {
      this.code.is_send = false;
      this.code.time = 60;
      this.code.code_msg = '发送验证码';
      clearInterval(this.code.time_interval);
    }
  }

  checkParam() {
    // eslint-disable-next-line prefer-destructuring
    const register_form: any = this.$refs.register_form;
    register_form.validate((valid: any) => {
      if (valid) {
        this.register();
      }
    });
  }

  // 注册
  async register() {
    this.$store.commit('LOADING_SHOW');
    try {
      const res = await api.register(this.register_form);
      this.$global_sucess('注册成功~');
      this.$setCacheData('acess_token', res.data.content);
      this.$router.push({ path: '/' });
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }
}
</script>

<style lang="scss" scoped>
.reg_panel {
  margin-top: 60px;
  background: #ffffff;
  border: solid 1px #d6d6d7;
  transition: all 0.5s ease;
  .reg_panel_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .reg_panel_form {
    width: 100%;
    padding: 25px 20px 0 20px;
    .reg_panel_form_sex {
      p {
        cursor: pointer;
        display: inline-block;
        color: #fff;
        font-size: 28px;
        line-height: 28px;
        height: 42px;
        padding: 7px;
        margin: 0 20px;
        border-radius: 50%;
        transition: background 0.5s ease;
        &.sex_nan {
          background: #59bfff;
          &:hover {
            background: #59bfff;
          }
        }

        &.sex_nv {
          background: #ff5b7e;
          &:hover {
            background: #ff5b7e;
          }
        }
        &.sex_def {
          background: #ccc;
        }
      }
    }
  }
}
</style>
