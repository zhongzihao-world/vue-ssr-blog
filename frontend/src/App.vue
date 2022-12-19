<template>
  <div id="app">
    <v-header />
    <main>
      <router-view ref="router-view"> </router-view>
    </main>
    <v-footer />
    <v-loading />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import api from './api/api.config';

@Component({ components: {} })
export default class App extends Vue {
  @Prop() private msg!: string;

  async mounted() {
    const acess_token: string | null = await this.$getCacheData('acess_token');
    if (acess_token) {
      this.getUserInfo();
    }
  }

  async getUserInfo() {
    try {
      let user_info = await this.$getCacheData('USER_INFO');
      // console.log(user_info);
      // 缓存里找，没有则去请求用户数据
      if (user_info) {
        user_info = JSON.parse(user_info);
      } else {
        const res = await api.getCurrentUserInfo();
        user_info = res.data.content;
        this.$setCacheData('USER_INFO', JSON.stringify(user_info));
      }
      // 存进vuex
      this.$store.commit('UPDATE_USER_INFO', user_info);
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: #f4f5f5;
}
main {
  font-size: 12px;
  font-family: 'Microsoft YaHei';
  word-break: break-word;
  color: #333333;
  overflow: auto;
}

//弹出层样式
.el-dialog {
  margin-top: 8vh !important;
  width: 460px;
}
.el-dialog__header {
  padding: 16px 0 16px 24px !important;
  background: rgba(242, 242, 242, 1);
  text-align: left;
  font-weight: 700;
  .el-dialog__title {
    font-size: 16px;
    background: rgba(242, 242, 242, 1);
  }
  .el-dialog__headerbtn {
    top: 16px !important;
  }
}
.el-dialog__body {
  max-height: 476px !important;
  overflow-y: auto !important;
  padding: 24px !important;
  border-bottom: 1px solid rgba(237, 237, 237, 1);
  //el-form
  .el-form-item {
    // margin-bottom: 0px;
    // 头
    .el-form-item__label {
      font-size: 12px;
      color: rgba(48, 49, 51, 1);
    }
    //input
    .el-input__inner {
      font-size: 12px;
      height: 30px;
      line-height: 30px;
    }
  }
}
.el-dialog__footer {
  padding: 10px 16px 10px !important;
  display: flex;
  justify-content: flex-end;
}
</style>
