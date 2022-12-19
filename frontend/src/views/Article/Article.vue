<template>
  <div class="container">
    <div class="article_panel">
      <div class="panel_tit" style="padding-bottom:0;">
        <div class="col-md-4" style="margin-bottom:10px;">
          <span>标题：</span>
          <el-input style="width:80%;" type="text" v-model="article_form.title" size="small" clearable />
        </div>
        <div class="col-md-4 col-md-offset-4" style="margin-bottom:10px;">
          <span>天气：</span>
          <el-input style="width:80%;" type="text" v-model="article_form.weather" size="small" clearable />
        </div>
      </div>
      <div class="panel_body">
        <div class="set_form">
          <div class="tit">是否公开</div>
          <div class="inp">
            <el-radio v-model="article_form.status" :label="true">设为公开</el-radio>
            <el-radio v-model="article_form.status" :label="false">设为私密</el-radio>
          </div>
        </div>
        <div class="set_form">
          <div class="tit">标签</div>
          <div class="inp">
            <el-select v-model="article_form.tag_id" placeholder="请选择标签" size="small">
              <el-option v-for="(item,index) in tag_list" :value="item._id" :label="item.tag_name" :key="index" />
            </el-select>
          </div>
        </div>
      </div>
      <!-- markdown 渲染器 -->
      <mavon-editor v-if="is_show" v-model="article_form.mark_content" :toolbars="toolbars" />
    </div>
    <div style="text-align:right;margin-top:12px;">
      <el-button type="success" @click="checkParam" size="small">{{is_edit?"我改好啦":"我写完啦"}}</el-button>
      <el-button type="danger" @click="$router.go(-1)" size="small">我不改了</el-button>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, Vue } from 'vue-property-decorator';
import 'mavon-editor/dist/css/index.css';

import api from '../../api/api.config';

const { mavonEditor } = require('mavon-editor');

interface Article {
  _id?: string;
  user_id?: string;
  tag_id: string;
  title: string;
  status?: boolean;
  mark_content?: string;
  content?: string;
  weather?: string;
  image?: string;
  images?: Array<string>;
  pv?: number;
  created_time?: Date;
  updated_time?: Date;
}

interface Tag {
  _id?: string;
  tag_name: string;
}

@Component({
  components: {},
})
export default class ArticlePage extends Vue {
  tag_list: Array<Tag> = []; // 标签列表

  // 文章表单
  article_form: Article = {
    tag_id: '',
    title: '',
    status: true,
    weather: '多云',
  };

  toolbars: any = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: false, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: true, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true, // 预览
  };

  is_show = false;


  get aid(): string {
    return this.$route.params.aid;
  }

  get getUser() {
    return this.$store.state.user_info;
  }

  get is_edit(): boolean {
    return !!this.$route.params.aid;
  }

  // 表单处理
  get final_article_form(): Article {
    const article_form: any = JSON.parse(JSON.stringify(this.article_form));
    article_form.content = mavonEditor.getMarkdownIt().render(article_form.mark_content).slice(0, 150);

    let images: any = Array.from(document.querySelectorAll('.v-show-content img') || []);
    images = images.map((item: any) => item.src);
    [article_form.image] = [...images];
    article_form.images = images;

    // 删除无用参数
    delete article_form.user_info;

    return article_form;
  }

  mounted() {
    this.is_show = true;
    this.getTagList();
    if (this.aid) {
      this.getArticleDetail();
    }
  }


  /* ------------方法------------ */
  async getTagList() {
    const res = await api.getTagList();
    this.tag_list = res.data.content;
  }

  async getArticleDetail() {
    this.$store.commit('LOADING_SHOW');
    try {
      const res = await api.getArticleDetail({ article_id: this.aid });
      this.article_form = {
        ...res.data.content[0],
      };
      // console.log(this.article_form);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  checkParam() {
    if (!this.final_article_form.title) {
      this.$global_fail('请填写标题~');
      return;
    }
    if (!this.final_article_form.tag_id) {
      this.$global_fail('请选择一个标签~');
      return;
    }
    this.saveArticle();
  }

  async saveArticle() {
    // console.log(this.final_article_form);
    if (this.final_article_form._id) {
      await api.updateArticle(this.final_article_form);
    } else {
      await api.createArticle(this.final_article_form);
    }
    this.$global_sucess('保存成功~');
    this.$nextTick(() => {
      this.$router.go(-1);
    });
  }
}
</script>

<style lang="scss" scoped>
.v-note-wrapper {
  height: 600px;
}
.v-note-wrapper.fullscreen {
  z-index: 9999;
  height: 100vh;
}
.article_panel {
  padding: 0;
  position: relative;
  background: #fff;
  border-radius: 5px;
  margin-top: 60px;
  border: solid 1px #d6d6d7;
  .panel_tit {
    overflow: auto;
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .panel_body {
    padding: 10px 20px;
    overflow: hidden;
    .set_form {
      margin-bottom: 15px;
      height: 40px;
      .tit {
        float: left;
        width: 70px;
        height: 34px;
        line-height: 34px;
        text-align: left;
        font-weight: bold;
      }
      .inp {
        float: left;
        margin-left: 20px;
        line-height: 40px;
        color: #333;
      }
      .checkbox {
        float: left;
        margin-left: 20px;
        margin-top: 7px;
        margin-bottom: 7px;
      }
    }
  }
}
</style>
