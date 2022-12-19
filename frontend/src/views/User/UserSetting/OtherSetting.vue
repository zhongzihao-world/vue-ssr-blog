<template>
  <el-row class="otherSetting_panel">
    <h3 class="otherSetting_panel_tit">修改密码</h3>
    <el-form class="otherSetting_panel_body" ref="otherSetting_form" :model="otherSetting_form" :rules="otherSetting_form_rule" label-width="100px" label-position="left" size="small">
      <div class="col-md-8">
        <el-form-item label="新密码" prop="password">
          <el-input type="text" v-model="otherSetting_form.password" :show-password="true" clearable />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_repeat">
          <el-input type="text" v-model="otherSetting_form.password_repeat" :show-password="true" clearable />
        </el-form-item>
      </div>
    </el-form>
    <div class="otherSetting__foot">
      <el-button type="primary" size="small" @click="checkParam">提交</el-button>
    </div>
  </el-row>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { Component, Vue } from 'vue-property-decorator';

import api from '../../../api/api.config';

@Component({})
export default class Header extends Vue {
  otherSetting_form = {
    password: '',
    password_repeat: '',
  }

  otherSetting_form_rule = {
    password: [
      { required: true, message: '请填写密码~', trigger: 'change' },
      { validator: this.checkPassword, trigger: 'change' },
    ],
    password_repeat: [
      { required: true, message: '请确认密码~', trigger: 'change' },
      { validator: this.checkPassword, trigger: 'change' },
      { validator: this.comparePassword, trigger: 'change' },
    ],
  }

  get getUser() {
    return this.$store.state.user_info;
  }


  /* ------------方法------------ */
  checkPassword(rule: any, value: string, callback: any) {
    if (value.length < 6 || value.length > 20) {
      callback(new Error('密码长度需在6~20位'));
    } else {
      callback();
    }
  }

  comparePassword(rule: any, value: any, callback: any) {
    if (this.otherSetting_form.password !== this.otherSetting_form.password_repeat) {
      callback(new Error('两次密码不一致!'));
    } else {
      callback();
    }
  }

  checkParam() {
    // eslint-disable-next-line prefer-destructuring
    const otherSetting_form: any = this.$refs.otherSetting_form;
    otherSetting_form.validate((valid: any) => {
      if (valid) {
        this.updatePassword();
      }
    });
  }

  async updatePassword() {
    this.$store.commit('LOADING_SHOW');
    try {
      const data = {
        email: this.getUser.email,
        password: this.otherSetting_form.password,
      };
      await api.updatePassword(data);
      this.$global_sucess('修改成功~');
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }
}
</script>

<style lang="scss" scoped>
.otherSetting_panel {
  position: relative;
  background: #fff;
  border-radius: 5px;
  border: solid 1px #d1d1d2;
  .otherSetting_panel_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .otherSetting_panel_body {
    padding: 10px 20px;
    overflow: hidden;
  }
  .otherSetting__foot {
    border-top: 1px solid #eee;
    padding: 10px 0;
    margin: 0 20px;
    padding-left: 90px;
  }
}
::v-deep .el-form-item__label {
  font-weight: bold;
}
</style>
