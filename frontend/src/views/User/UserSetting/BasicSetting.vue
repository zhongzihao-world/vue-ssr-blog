<template>
  <el-row class="basicSetting_panel">
    <h3 class="basicSetting_panel_tit">我的信息</h3>
    <el-form class="basicSetting_panel_body" v-if="basicSetting_form._id" ref="basicSetting_form" :model="basicSetting_form" :rules="basicSetting_form_rule" label-width="70px" label-position="right"
      size="small">
      <div class="col-md-8">
        <el-form-item label="昵称" prop="nick_name">
          <el-input type="text" v-model="basicSetting_form.nick_name" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="basicSetting_form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公开邮箱" prop="showe_mail">
          <el-checkbox v-model="basicSetting_form.showe_mail" :label="basicSetting_form.showe_mail?'公开':'不公开'"></el-checkbox>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="basicSetting_form.birthday" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="血型" prop="blood">
          <el-select v-model="basicSetting_form.blood" placeholder="请选择" size="small" clearable>
            <el-option v-for="(item,index) in blood_list" :key="index" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input type="text" placeholder="简介" v-model="basicSetting_form.summary" size="small" clearable />
        </el-form-item>
        <el-form-item label="博客地址" prop="blood">
          <el-input type="text" placeholder="博客地址" v-model="basicSetting_form.blog_url" size="small" clearable />
        </el-form-item>
        <el-form-item label="QQ" prop="blood">
          <el-input type="text" placeholder="QQ" v-model="basicSetting_form.qq_number" size="small" clearable />
        </el-form-item>
      </div>
      <div class="col-md-4">
        <el-form-item label="头像" prop="header">
          <img :src="basicSetting_form.header" style="width: 100%;">
        </el-form-item>
        <v-upload-photo :upload_url="upload_url" :file_type_list="['png']" :file_size="1" @upload_sucess="uploadSucess">
          <el-button size="mini" type="primary">设置头像</el-button>
        </v-upload-photo>
      </div>
    </el-form>
    <div class="basicSetting__foot">
      <el-button type="primary" size="small" @click="checkParam">提交</el-button>
    </div>
  </el-row>
</template>


<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue, Watch } from 'vue-property-decorator';

import api from '../../../api/api.config';

@Component({ components: {} })
export default class Header extends Vue {
  upload_url = api.HEADER_PHOTO_URL;

  basicSetting_form = {
    _id: '',
    nick_name: '',
    sex: '',
    showe_mail: '',
    birthday: '',
    blood: '',
    summary: '',
    blog_url: '',
    qq_number: '',
    header: '',
  }

  basicSetting_form_rule = {
    nick_name: [
      { required: true, message: '请填写昵称~', trigger: 'change' },
    ],
  }

  blood_list = [
    {
      label: 'A',
    },
    {
      label: 'B',
    },
    {
      label: 'AB',
    },
    {
      label: 'O',
    },
  ];

  get getUser() {
    return this.$store.state.user_info;
  }

  mounted() {
    this.initForm();
  }


  /* ------------方法------------ */
  @Watch('getUser')
  initForm() {
    Object.keys(this.basicSetting_form).forEach(key => {
      this.$set(this.basicSetting_form, key, this.getUser[key]);
    });
  }

  checkParam() {
    // eslint-disable-next-line prefer-destructuring
    const basicSetting_form: any = this.$refs.basicSetting_form;
    basicSetting_form.validate((valid: any) => {
      if (valid) {
        this.updateUserInfo();
      }
    });
  }

  uploadSucess(url: Array<string>) {
    // console.log(url);
    this.$set(this.basicSetting_form, 'header', '');
    this.$nextTick(() => {
      this.$set(this.basicSetting_form, 'header', url[0]);
    });
  }

  async updateUserInfo() {
    this.$store.commit('LOADING_SHOW');
    try {
      const res = await api.updateUserInfo(this.basicSetting_form);
      await this.$setCacheData('USER_INFO', JSON.stringify(res.data.content));
      this.$global_sucess('修改成功~');
      this.$store.commit('UPDATE_USER_INFO', res.data.content);
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
.basicSetting_panel {
  position: relative;
  background: #fff;
  border-radius: 5px;
  border: solid 1px #d1d1d2;
  .basicSetting_panel_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .basicSetting_panel_body {
    padding: 10px 20px;
    overflow: hidden;
  }
  .basicSetting__foot {
    border-top: 1px solid #eee;
    padding: 10px 0;
    margin: 0 20px;
    padding-left: 90px;
  }
}
::v-deep .el-form-item__label {
  font-weight: bold;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: auto;
}
.el-upload__input {
  display: none;
}
</style>
