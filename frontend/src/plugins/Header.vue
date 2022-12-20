<template>
  <header class="header container">
    <div class="logo">
      <router-link to="/"><img src="../assets/img/logo.png" alt="眼镜文章" width="150" height="50"></router-link>
    </div>
    <!-- 暂时隐藏搜索框 -->
    <div class="search_box">
      <el-input type="text" v-model.trim="keyword" placeholder="搜素一下你就......" @keyup.enter.native="keywordChange(keyword)" clearable size="small">
        <template slot="append">
          <el-button icon="el-icon-search" @click="keywordChange(keyword)"></el-button>
        </template>
      </el-input>
    </div>
    <!-- PC -->
    <div class="nav">
      <div class="nav_item">
        <router-link to="/" class="nav_a" active-class="nav_active" exact>主页</router-link>
      </div>
      <div class="nav_item">
        <router-link to="/photo" class="nav_a" active-class="nav_active">照片墙</router-link>
      </div>
      <div class="nav_item" v-if="getUser._id">
        <div href="javascript:void(0)" style="height: 60px;width: 60px;position: relative;">
          <img :src="getUser.header">
        </div>
        <div class="nav_item_expand">
          <router-link :to="{name: 'userIndex', params: { uid: getUser._id }}" active-class="nav_item_expand_artive" exact>我的主页</router-link>
          <router-link :to="{ name: 'userAlbum', params: { uid: getUser._id }}" active-class="nav_item_expand_artive">我的相册</router-link>
          <router-link to="/set/" active-class="nav_item_expand_artive">管理中心</router-link>
          <a href="javascript:void(0)" @click="logout()" style="border-top:2px solid #59bfff;">退出</a>
        </div>
      </div>
      <div class="nav_item" v-else>
        <router-link to="/login" class="nav_a" active-class="nav_active">登录</router-link>
      </div>
    </div>
    <!-- 移动 -->
    <div class="nav_category" @click="toggleNav">
      <i class="el-icon-menu"></i>
    </div>
    <div class="nav_mobile" v-show="is_show_nav" @click="toggleNav">
      <div class="nav_mobile_item">
        <router-link to="/" active-class="active" exact>主页</router-link>
      </div>
      <div class="nav_mobile_item">
        <router-link to="/photo" active-class="active">照片墙</router-link>
      </div>
      <template v-if="getUser._id">
        <div class="nav_mobile_item">
          <router-link :to="{ name: 'userIndex', params: { uid: getUser._id }}" active-class="active">{{`个人中心(${getUser.nick_name})`}}</router-link>
        </div>
        <div class="nav_mobile_item">
          <a @click="logout()">退出</a>
        </div>
      </template>
      <template v-else>
        <div class="nav_mobile_item hide">
          <router-link to="/login">登录</router-link>
        </div>
      </template>
    </div>
  </header>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Header extends Vue {
  is_show_nav = false;

  keyword = '';

  get getUser() {
    return this.$store.state.user_info;
  }

  async logout() {
    this.$store.commit('USER_LOGOUT');
    await this.$clearCache();
    this.$global_sucess('注销成功~');
    this.$router.push('/');
    window.location.reload();
  }

  toggleNav() {
    this.is_show_nav = !this.is_show_nav;
  }

  // 直接调用文章页面方法
  keywordChange(keyword: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articlePage: any = this.$parent.$refs['router-view'];
    // console.log(articlePage);
    articlePage.keywordChange(keyword);
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  position: sticky;
  top: 0;
  padding-right: 50px;
  background: rgba(255, 255, 255, 0.99);
  box-shadow: 0 0 10px #cccccc;
  z-index: 2000;
  &:after {
    content: '\0020';
    height: 0;
    display: block;
    clear: both;
  }
  .logo {
    float: left;
    margin-top: 5px;
  }
  .search_box {
    float: left;
    display: flex;
    align-items: center;
    height: 60px;
    margin-left: 100px;
    .el-input {
      width: 250px;
    }
  }
  .nav {
    float: right;
    margin-left: 20px;
    .nav_item {
      float: left;
      position: relative;
      height: 60px;
      white-space: nowrap;
      a {
        display: block;
        height: 60px;
        padding: 0 20px;
        line-height: 60px;
        &.nav_active {
          color: #fff;
          background: #59bfff;
        }
        &:hover {
          color: #fff;
          background: #59bfff;
          transition: color 0.5s, background 0.2s ease;
        }
      }
      img {
        position: absolute;
        margin-left: -22px;
        margin-top: -22px;
        top: 50%;
        left: 50%;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        cursor: pointer;
      }
      &:hover {
        .nav_item_expand {
          display: block;
        }
      }
      .nav_item_expand {
        display: none;
        position: absolute;
        left: 0;
        font-size: 12px;
        background: #fff;
        color: #333;
        border-radius: 2px;
        transition: all 0.2s;
        text-align: center;
        .nav_item_expand_artive {
          color: #fff;
          background: #59bfff;
        }
      }
    }
  }
  .nav_category {
    display: none;
    float: right;
    margin-top: 5px;
    padding: 0 15px;
    line-height: 50px;
    font-size: 26px;
  }
  .nav_mobile {
    display: none;
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 0;
    z-index: 10;
    .nav_mobile_item {
      a {
        display: block;
        padding: 8px 15px;
        &.active {
          color: #59bfff;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .header {
    .search_box {
      display: none;
    }
    .nav {
      display: none;
    }
    .nav_category {
      display: block;
    }

    .nav_mobile {
      display: block;
    }
  }
}
</style>
