<template>
  <div class="box container">
    <div class="col-md-9 box_content">
      <nav class="nav">
        <span :class="{nav_item: true, active: search_param.order_field === order_field[index].key}" v-for="(item, index) in order_field" :key="index" @click="orderFieldChange(item.key)">
          {{item.label}}
        </span>
      </nav>
      <article class="content_article">
        <div class="article_item box_shadow" v-for="(item, index) in article_list" :key="index">
          <div class="article_item_tit">
            <router-link :to="{ name: 'page', params: { aid: item._id } }">
              <h3>{{ item.title }}</h3>
            </router-link>
          </div>
          <div class="article_item_body">
            <div class="col-sm-10">
              <router-link :to="{ name: 'page', params: { aid: item._id } }">
                <div class="article_item_body_content" v-html="item.content"></div>
              </router-link>
            </div>
            <div v-if="item.image" class="col-sm-2 col-xs-6">
              <img class="article_item_body_img" :src="item.image" />
            </div>
          </div>
          <div class="article_item_foot">
            <span title="日期">
              <i class="el-icon-date"></i> {{ item.created_time | getExactTime }}
            </span>
            <span>
              <i class="el-icon-s-custom"></i>
              <router-link v-if="item.user_id" :to="{ name: 'userIndex', params: { uid: item.user_id } }" class="link">{{ item.nick_name }}</router-link>
            </span>
            <span class="hide_mobile" title="标签">
              <i class="el-icon-folder-opened"></i> {{ item.tag_name }}
            </span>
            <span class="hide_mobile" title="阅读">
              <i class="el-icon-reading"></i> {{ item.pv ? item.pv : 0 }}
            </span>
          </div>
        </div>
      </article>
      <v-bottom-line v-if="is_get_all" style="width:90%;" />
    </div>
    <aside class="col-md-3 hide_mobile">
      <div class="box_nav box_shadow">
        <div class="box_nav_user" v-if="getUser._id">
          <div class="box_nav_header">
            <router-link :to="{ name: 'userIndex', params: { uid: getUser._id } }">
              <img :src="getUser.header" width="100" height="100" />
            </router-link>
          </div>
          <div class="box_nav_info">
            <router-link :to="{ name: 'userIndex', params: { uid: getUser._id } }">
              <strong>{{ getUser.nick_name }}</strong>
            </router-link>
          </div>
        </div>
        <div class="box_nav_tag">
          <h2>标签</h2>
          <div class="box_nav_tag_body">
            <ul>
              <li v-for="(item, index) in tag_list" :key="index">
                <a href="javascript:void(0)" :class="{ link: search_param.current_tag_id == tag_list[index]._id }" @click="tagChange(item._id)">{{ item.tag_name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
    <v-scroll-go-top :distance="200" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator';

import api from '../../api/api.config';

interface SearchParam {
  current_page: number;
  page_size: number;
  key_word?: string;
  order_field?: string;
  current_tag_id?: string;
}

@Component({})
export default class Dairy extends Vue {
  order_field = [
    {
      key: 'recommend',
      label: '热门',
    },
    {
      key: 'latest',
      label: '最新',
    },
  ]

  search_param: SearchParam = {
    current_page: 1,
    page_size: 10,
    key_word: '', // 搜索内容
    order_field: 'recommend', // 方式
    current_tag_id: '', // 标签
  };

  is_waiting = false;


  get getUser() {
    return this.$store.state.user_info;
  }

  get getUserOther() {
    return this.$store.state.user_otherinfo;
  }

  get tag_list() {
    return this.$store.state.tag_list;
  }

  get article_list() {
    return this.$store.state.article_list;
  }

  get is_get_all() {
    return this.$store.state.article_status;
  }

  // 文章页暂时不首屏数据预取
  created() {
    // this.search_param.current_page = 1;
    // this.$store.commit('CLEAR_ARTICLE_LIST');
    this.$createFetcher(() => this.$store.dispatch('getTagList'))();
    // this.$createFetcher(() => this.$store.dispatch('getArticleList', this.search_param))();
  }

  mounted() {
    this.initSearch();
    this.getArticleList();
    window.addEventListener('scroll', this.loadMore);
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.loadMore);
    });
  }


  /* ------------方法------------ */
  initSearch() {
    this.search_param.current_page = 0;
    this.$store.commit('CLEAR_ARTICLE_LIST');
  }

  loadMore() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const allHeight = document.body.scrollHeight;
    const pageHeight = document.documentElement.clientHeight;
    if (scrollTop > allHeight - pageHeight - 88 && !this.is_get_all) {
      if (!this.is_waiting) {
        this.getArticleList();
      }
    }
  }

  async getArticleList() {
    try {
      this.is_waiting = true;
      this.$store.commit('LOADING_SHOW');
      this.search_param.current_page++;
      const res = await api.getArticleList(this.search_param);
      this.$store.commit('UPDATE_ARTICLE_LIST', res.data.content);
      this.$store.commit('UPDATE_ARTICLE_STATUS', res.data.content.length < this.search_param.page_size);
    } finally {
      this.is_waiting = false;
      this.$store.commit('LOADING_HIDE');
    }
  }

  keywordChange(key_word: string) {
    this.search_param.key_word = key_word;
    this.initSearch();
    this.getArticleList();
  }

  tagChange(tag_id: string) {
    if (this.search_param.current_tag_id !== tag_id) {
      this.search_param.current_tag_id = tag_id;
    } else {
      this.search_param.current_tag_id = '';
    }
    this.initSearch();
    this.getArticleList();
  }

  orderFieldChange(order_field: string) {
    if (this.search_param.order_field !== order_field) {
      this.search_param.current_tag_id = '';
      this.search_param.order_field = order_field;
      this.initSearch();
      this.getArticleList();
    }
  }
}
</script>

<style lang="scss" scoped>
$theme_color: rgba(174, 219, 250, 1);
$active_color: rgba(87, 190, 255, 1);

.box {
  overflow: hidden;
  margin-top: 20px;
  .box_content {
    background: rgba(255, 255, 255, 1);
    .nav {
      padding: 15px 5px;
      margin-bottom: 15px;
      border-bottom: solid 1px #d9d9da;
      justify-content: flex-start;
      .nav_item {
        position: relative;
        padding: 0 14px;
        cursor: pointer;
        color: #909090;
        font-size: 14px;
        &.active,
        &:hover {
          color: #59bfff;
        }
        &:not(:last-child):after {
          content: '';
          position: absolute;
          right: 0;
          top: 3px;
          background: rgba(0, 0, 0, 0.7);
          width: 1px;
          height: 15px;
        }
      }
    }
    .content_article {
      position: relative;
      padding-right: 36px;
      overflow: auto;
      &:before {
        content: '';
        position: absolute;
        top: -15px;
        bottom: 0;
        display: block;
        right: 35px;
        width: 2px;
        background: $theme_color;
      }
      .article_item {
        position: relative;
        background: #ffffff;
        border-radius: 10px;
        margin-bottom: 22px;
        margin-right: 28px;
        transition: all 0.3s ease-in-out;
        outline: none;
        &:hover {
          box-shadow: 0 0 5px $theme_color;
        }
        &:before {
          content: '';
          position: absolute;
          top: 15px;
          right: -35px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #f1efef;
          background: $theme_color;
        }
        &:after {
          content: '';
          position: absolute;
          top: 15px;
          right: -35px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }
        .article_item_tit {
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
        .article_item_body {
          padding: 10px 20px;
          overflow: hidden;
          .article_item_body_content {
            line-height: 26px;
            max-height: 104px;
            overflow: hidden;
          }
          .article_item_body_img {
            width: 100%;
            border: 1px solid #f2f2f2;
            padding: 5px;
          }
        }
        .article_item_foot {
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
  .box_nav {
    transition: all 0.3s ease-in-out;
    outline: none;
    &:hover {
      box-shadow: 0px 0px 10px $theme_color;
    }
    .box_nav_user {
      position: relative;
      background: #fff;
      height: 150px;
      border-radius: 5px;
      margin-bottom: 15px;
      .box_nav_header {
        position: absolute;
        bottom: 30px;
        left: 50%;
        width: 110px;
        height: 110px;
        padding: 5px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        margin-left: -55px;
      }
      img {
        border-radius: 50%;
      }
      .box_nav_info {
        padding-top: 125px;
        text-align: center;
        a {
          font-size: 16px;
          font-weight: 700;
          &:hover {
            color: #59bfff;
          }
        }
      }
    }
    .box_nav_tag {
      background: #fff;
      border-radius: 5px;
      h2 {
        padding: 10px 20px 5px;
        border-bottom: 1px solid #eee;
      }
      .box_nav_tag_body {
        padding: 10px 0;
        margin: 0 20px;
        ul {
          line-height: 26px;
          border-radius: 0 0 4px 4px;
          overflow: hidden;
          li {
            border-bottom: 1px dashed #eee;
          }
        }
      }
    }
  }
}
</style>
