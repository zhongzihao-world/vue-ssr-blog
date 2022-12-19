<template>
  <article class="container article" v-if="article_detail">
    <header class="article_tit">
      <h2>
        <div class="col-md-3 col-xs-4">
          <i class="iconfont icon-toys h3_icon"></i> {{article_detail.created_time | week}}
        </div>
        <div class="col-md-4 col-xs-5">{{article_detail.created_time | getExactTime}}
        </div>
        <div class="col-md-5 col-xs-3">{{article_detail.weather}}
        </div>
      </h2>
    </header>
    <section class="col-md-9" style="padding-left:0;">
      <div class="article_content">
        <router-link v-if="is_me" class="article_edit" :to="{ name: 'edit', params: {aid}}">编辑</router-link>
        <h2 class="article_content_tit">
          {{article_detail.title}}
        </h2>
        <mavon-editor v-if="is_show" v-model="article_detail.mark_content" defaultOpen="preview" :toolbars="{}" :subfield="false" />
        <div v-else v-html="article_detail.content" style="padding: 10px 20px;"></div>
        <div class="article_content_bottom">
          <span title="标签">
            <i class="el-icon-folder-opened"></i>
            {{article_detail.tag_name}}
          </span>
          <span title="阅读">
            <i class="el-icon-reading"></i>
            {{article_detail.pv}}
          </span>
          <template v-if="is_me">
            <router-link :to="{ name: 'edit', params: {aid}}">编辑</router-link>
            <a @click.prevent="changeArticleStatus">
              <template v-if="article_detail.status == false">设为公开</template>
              <template v-if="article_detail.status == true ">设为私密</template>
            </a>
            <a @click.prevent="delArticle">删除</a>
          </template>
        </div>
      </div>
      <footer class="article_comment hide">
        <h3>留言板</h3>
        <div class="article_comment_body">
          <el-input type="textarea" :rows="6" placeholder="我也要留言" v-model="comment_text"></el-input>
          <el-button type="primary" @click="addArticleComment" size="mini">发布</el-button>
        </div>
        <ul>
          <li class="article_comment_item" v-for="(item,index) in comment_list" :key="index">
            <div class="article_comment_item_left">
              <img :src="item.header" width="50" height="50">
            </div>
            <div class="article_comment_item_right">
              <div class="article_comment_item_right_top">
                <span>
                  <router-link :to="{ name: 'userIndex', params: { uid:item.user_id }}" class="link">
                    <strong>{{item.nick_name}}</strong>
                  </router-link>
                </span>
                <span class="article_comment_item_right_top_time">{{item.created_time | getExactTime }}</span>
                <span class="article_comment_item_right_top_del" v-if="is_show_del_btn(item.user_id)">
                  <a href="javascript:void(0)" class="link" @click="delArticleComment(item._id)" title="删除">
                    <i class="el-icon-delete"></i>
                  </a>
                </span>
              </div>
              <div>{{item.content}}</div>
            </div>
          </li>
        </ul>
        <div class="article_comment_bottom">
          <a href="javascript:void(0)" v-if="all_comment_list.length > comment_list.length" @click="comment_list = all_comment_list">
            <strong>查看全部</strong>
          </a>
          <a href="javascript:void(0)" v-else>
            <strong>没有更多评论了~~</strong>
          </a>
        </div>
      </footer>
    </section>
    <aside class="col-md-3" style="padding-left:0;padding-right:0;">
      <div class="article_right">
        <h3>作者</h3>
        <div class="articleList_right_header">
          <router-link :to="{ name: 'userIndex', params: { uid:article_user_detail._id }}">
            <img :src="article_user_detail.header" width="100" height="100">
          </router-link>
          <router-link :to="{ name: 'userIndex', params: { uid:article_user_detail._id }}" style="font-weight:700;">
            {{article_user_detail.nick_name}}
          </router-link>
          <div style="text-align: center;color: #808080;font-size: 14px;">{{article_user_detail.summary}} </div>
        </div>
        <div class="articleList_right_comment hide" :class="{panel_page_border: commentBox}" @click="commentBox=!commentBox">
          <strong :class="{link: commentBox}">{{comment_list.length}}</strong>
          <span>留言</span>
        </div>
        <div class="articleList_right_comment_box hide" v-show="commentBox">
          <textarea class="articleList_right_comment_text" placeholder="非常赞，我是跪着看完的！" v-model="comment_text"></textarea>
          <el-button type="primary" @click="addArticleComment" style="width:100%;" size="small">发布</el-button>
        </div>
      </div>
    </aside>
    <v-scroll-go-top :distance="200" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'mavon-editor/dist/css/index.css';

import api from '../../api/api.config';

@Component({
  filters: {
    week(value: string) {
      const date = new Date(value);
      const week = date.getDay();
      const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
      return `星期${weekStr[week]}`;
    },
  },
})
export default class ArticleDetail extends Vue {
  comment_list = []; // 评论

  all_comment_list = []; // 总评论

  commentBox = false;

  comment_text = ''; // 评论内容

  show_comment_num = 10;

  is_show = false;


  get aid() {
    return this.$route.params.aid;
  }

  get is_me() {
    return this.article_detail.user_id === this.getUser._id;
  }

  get getUser() {
    return this.$store.state.user_info;
  }

  get article_detail() {
    return this.$store.state.article_detail;
  }

  get article_user_detail() {
    return this.$store.state.article_user_detail;
  }

  // eslint-disable-next-line class-methods-use-this
  get IS_NODE_ENV() {
    return process.env.IS_NODE_ENV;
  }

  // 预取数据有bug，以后再修复
  created() {
    this.$createFetcher(() => this.$store.dispatch('getArticleDetail', {
      article_id: this.aid,
      is_pv_add: !process.env.IS_NODE_ENV,
    }))();
  }

  mounted() {
    this.getArticleComment();
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.is_show = true;
    }, 10);
  }


  /* ------------方法------------ */
  is_show_del_btn(user_id: string) {
    return this.getUser._id === user_id;
  }

  async addArticleComment() {
    if (!this.getUser._id) {
      this.$global_fail('评论失败，您还未登陆~');
      return;
    }
    if (!this.comment_text) {
      this.$global_fail('请填写评论');
      return;
    }
    if (this.comment_text.length >= 100) {
      this.$global_fail('评论过长，超出100字限制');
      return;
    }
    try {
      this.$store.commit('LOADING_SHOW');
      const data = {
        article_id: this.article_detail._id,
        comment_text: this.comment_text,
      };
      await api.addArticleComment(data);
      this.$global_sucess('评论成功~');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async delArticleComment(comment_id: string) {
    try {
      this.$store.commit('LOADING_SHOW');
      const data = {
        comment_id,
      };
      await api.delArticleComment(data);
      this.$global_sucess('删除成功~');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async getArticleComment() {
    try {
      const data = {
        article_id: this.aid,
      };
      this.$store.commit('LOADING_SHOW');
      const res = await api.getArticleComment(data);
      this.all_comment_list = JSON.parse(JSON.stringify(res.data.content));
      this.comment_list = JSON.parse(JSON.stringify(res.data.content.splice(0, this.show_comment_num)));
    } catch (e) {
      console.log(e);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async changeArticleStatus() {
    try {
      await this.$confirm('您确定要更改状态码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const data = {
        article_id: this.aid,
        status: !this.article_detail.status,
      };
      await api.changeArticleStatus(data);
      this.$global_sucess('修改状态成功~');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (e) {
      console.log(e);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async delArticle() {
    try {
      await this.$confirm('您确定要删除该篇文章吗？该操作不可取消！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const data = {
        article_id: this.aid,
      };
      await api.delArticle(data);
      this.$global_sucess('删除成功~');
      setTimeout(() => {
        this.$router.go(-1);
      }, 400);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }
}
</script>

<style lang="scss">
$active_color: rgba(87, 190, 255, 1);

.markdown-body .highlight pre,
.markdown-body pre {
  padding-bottom: 0 !important;
}
.markdown-body pre p {
  margin-bottom: 0;
}
.article {
  padding-top: 40px;
  .article_tit {
    padding: 10px 20px;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
    border-right: solid 1px #dededf;
    border-bottom: solid 1px #d9d9da;
    overflow: auto;
    text-align: center;
  }
  .article_content {
    position: relative;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
    .article_content_tit {
      position: relative;
      border-radius: 5px 5px 0 0;
      background: #edf8fe;
      padding: 10px 20px;
      color: #59bfff;
    }
    .article_edit {
      position: absolute;
      top: 12px;
      right: 20px;
      color: rgba(0, 0, 0, 1);
      z-index: 1;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
    }
    .article_content_content {
      padding: 10px 20px;
      overflow: hidden;
    }
    .article_content_bottom {
      border-top: 1px solid #eee;
      padding: 10px 0;
      margin: 0 20px;
      span,
      a {
        display: inline-block;
        padding-left: 5px;
        padding-right: 5px;
      }
      a {
        cursor: pointer;
        font-weight: 700;
      }
    }
  }
  .article_comment {
    background: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
    border: solid 1px #d6d6d7;
    h3 {
      padding: 10px 20px 5px;
      border: 1px solid #eee;
    }
    .article_comment_body {
      padding: 10px 0;
      margin: 0 20px;
      .el-textarea {
        margin-bottom: 15px;
      }
    }
    ul {
      line-height: 26px;
      border-radius: 0 0 4px 4px;
      overflow: hidden;
      li {
        padding: 10px 20px;
        overflow: hidden;
        border-bottom: 1px dashed #dedada;
        &:last-child {
          border-bottom: 0;
        }
        .article_comment_item_left {
          float: left;
          img {
            border-radius: 50%;
          }
        }
        .article_comment_item_right {
          padding-left: 70px;
          font-size: 14px;
          &:hover {
            .article_comment_item_right_top {
              .article_comment_item_right_top_del {
                display: block;
              }
            }
          }
          .article_comment_item_right_top {
            position: relative;
            margin-bottom: 10px;
            span {
              padding-left: 5px;
              padding-right: 5px;
            }
            .article_comment_item_right_top_time {
              color: #808080;
            }
            .article_comment_item_right_top_del {
              position: absolute;
              right: 0;
              top: 0;
              display: none;
            }
          }
        }
      }
    }
    .article_comment_bottom {
      border-top: 1px solid #eee;
      text-align: center;
      a {
        padding: 10px 0;
        display: block;
      }
    }
  }
  .article_right {
    background: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
    border: solid 1px #d6d6d7;
    h3 {
      padding: 10px 20px 5px;
      border-bottom: 1px solid #eee;
    }
    .articleList_right_header {
      padding: 30px 0 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      a {
        display: block;
        margin-bottom: 8px;
      }
      img {
        border-radius: 50%;
        margin: 0 auto;
      }
    }
    .articleList_right_comment {
      display: flex;
      justify-content: center;
      padding: 10px;
      cursor: pointer;
      &:hover {
        color: #59bfff;
      }
      strong {
        margin-right: 6px;
      }
    }
    .articleList_right_comment_box {
      .articleList_right_comment_text {
        width: 100%;
        height: 90px;
        border: none;
        padding: 10px;
        outline: 0;
      }
    }
  }
}
::v-deep pre {
  padding: 1rem;
  max-height: 35rem;
  line-height: 1.5;
  background-color: #e9ecef;
  overflow: auto;
}
</style>
