<template>
  <div class="container">
    <div class="col-md-6  center_block">
      <div class="login_panel">
        <h4 class="login_pane_tit">登录</h4>
        <el-form class="login_panel_form" ref="login_form" :model="login_form" :rules="login_form_rule" size="small">
          <el-form-item prop="email">
            <el-input placeholder="邮箱账号" v-model="login_form.email" type="text" clearable>
              <template slot="prepend">
                <i class="el-icon-message"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" v-model="login_form.password" type="password" clearable>
              <template slot="prepend">
                <i class="el-icon-unlock"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="checkParam" style="width:100%;">登 录</el-button>
          </el-form-item>
          <el-form-item>
            <el-row style="text-align:right;">
              <router-link to="/reg">立即注册</router-link>
            </el-row>
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


@Component({})
export default class Login extends Vue {
  login_form = {
    email: '',
    password: '',
  }

  login_form_rule = {
    email: [
      { required: true, message: '请填写邮箱~', trigger: 'change' },
      { validator: this.checkEmail, trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请填写密码~', trigger: 'change' },
      { validator: this.checkPassword, trigger: 'change' },
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

  checkParam() {
    // eslint-disable-next-line prefer-destructuring
    const login_form: any = this.$refs.login_form;
    login_form.validate((valid: any) => {
      if (valid) {
        this.login();
      }
    });
  }

  async login() {
    this.$store.commit('LOADING_SHOW');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.login(this.login_form);
      this.$global_sucess('登陆成功~');
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
.login_panel {
  margin-top: 60px;
  background: #ffffff;
  border: solid 1px #d1d1d2;
  transition: all 0.5s ease;
  .login_pane_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .login_panel_form {
    width: 100%;
    padding: 25px 20px 0 20px;
  }
}
</style>
