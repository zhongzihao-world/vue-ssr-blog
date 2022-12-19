<template>
  <div ref="userArticle_panel" class="userArticle_panel">
    <div class="userArticle_content">
      <div class="userArticle_item box_shadow" v-for="(item,index) in article_list" :key="index">
        <div class="userArticle_item_tit">
          <router-link :to="{ name: 'page', params: { aid: item._id }}">
            <h3>{{item.title}}</h3>
          </router-link>
        </div>
        <div class="userArticle_item_body">
          <div class="col-sm-10">
            <router-link :to="{ name: 'page', params: { aid: item._id }}">
              <div class="userArticle_item_body_conten" v-html="item.content"></div>
            </router-link>
          </div>
          <div class="col-sm-2 col-xs-6">
            <img class="userArticle_item_body_img" :src="item.image">
          </div>
        </div>
        <div class="userArticle_item_foot">
          <span title="日期"><i class="el-icon-date"></i> {{item.created_time | getExactTime}}</span>
          <span class="hide_mobile" title="标签">
            <i class="el-icon-folder-opened"></i> {{item.tag_name}}</span>
          <span class="hide_mobile" title="阅读">
            <i class="el-icon-reading"></i> {{item.pv}}</span>
          <span title="属性" style="position: absolute;right: 25px;">
            <template v-if="item.status">
              <i class="el-icon-unlock"></i>
              公开
            </template>
            <template v-else>
              <i class="el-icon-lock"></i>
              私密
            </template>
          </span>
        </div>
      </div>
    </div>
    <v-bottom-line v-if="is_get_all" style="width:90%;" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Prop, Vue } from 'vue-property-decorator';

import api from '../../../../api/api.config';

@Component({
  components: {},
})
export default class UserIndex extends Vue {
  @Prop({ required: true })
  readonly uid!: string;

  article_list = [];

  current_page = 0;

  page_size = 5;

  is_get_all = false; // 是否已经加载完全部

  user_article_dom: any;

  is_waiting = false;

  mounted() {
    this.current_page = 0;
    this.getUserArticleList();
    this.user_article_dom = this.$refs.userArticle_panel;
    this.user_article_dom.addEventListener('scroll', this.loadMore);
    this.$on('hook:beforeDestroy', () => {
      this.user_article_dom.removeEventListener('scroll', this.loadMore);
    });
  }


  /* ------------方法------------ */
  async getUserArticleList() {
    try {
      this.is_waiting = true;
      this.$store.commit('LOADING_SHOW');
      this.current_page++;
      const data = {
        user_id: this.uid,
        current_page: this.current_page,
        page_size: this.page_size,
      };
      const res = await api.getUserArticleList(data);
      this.article_list = this.article_list.concat(res.data.content);
      this.is_get_all = res.data.content.length < this.page_size;
    } finally {
      this.is_waiting = false;
      this.$store.commit('LOADING_HIDE');
    }
  }

  loadMore() {
    const scrollTop = this.user_article_dom.scrollTop || this.user_article_dom.scrollTop;
    const allHeight = this.user_article_dom.scrollHeight;
    const pageHeight = this.user_article_dom.clientHeight;
    if (scrollTop > allHeight - pageHeight - 88 && !this.is_get_all) {
      if (!this.is_waiting) {
        this.getUserArticleList();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme_color: rgba(174, 219, 250, 1);

.userArticle_panel {
  .userArticle_content {
    position: relative;
    padding: 20px 36px 0 20px;
    overflow: auto;
    &:before {
      content: '';
      position: absolute;
      top: -15px;
      bottom: 0;
      display: block;
      right: 35px;
      width: 2px;
      background: #aedbfa;
    }
    .userArticle_item {
      position: relative;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 15px;
      border-right: solid 1px #d6d6d7;
      border-bottom: solid 1px #d1d1d2;
      margin-right: 28px;
      transition: all 0.3s ease-in-out;
      &:before {
        content: '';
        position: absolute;
        top: 15px;
        right: -37px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #f1efef;
        background: #aedbfa;
      }
      &:after {
        content: '';
        position: absolute;
        top: 15px;
        right: -37px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      &:hover {
        box-shadow: 0px 0px 10px $theme_color;
      }
      .userArticle_item_tit {
        position: relative;
        border-radius: 5px 5px 0 0;
        background: #edf8fe;
        padding: 10px 20px;
        color: #59bfff;
        a {
          color: #59bfff;
          &:hover {
            h3 {
              padding-left: 30px;
            }
          }
          h3 {
            transition: padding-left 0.5s ease;
          }
        }
      }
      .userArticle_item_body {
        padding: 10px 20px;
        overflow: hidden;
        .userArticle_item_body_conten {
          line-height: 26px;
          max-height: 104px;
          overflow: hidden;
        }
        .userArticle_item_body_img {
          width: 100%;
          border: 1px solid #f2f2f2;
          padding: 5px;
        }
      }
      .userArticle_item_foot {
        border-top: 1px solid #eee;
        padding: 10px 0;
        margin: 0 20px;
        span {
          display: inline-block;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
