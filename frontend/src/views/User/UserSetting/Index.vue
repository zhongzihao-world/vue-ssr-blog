<template>
  <div class="container userSetting_panel">
    <div class="col-md-3 userSetting_panel_left">
      <h3 class="userSetting_panel_tit">个人设置</h3>
      <router-link to="/set" class="set_a" active-class="active" exact>我的信息</router-link>
      <router-link to="/set/password" class="set_a" active-class="active">修改密码</router-link>
    </div>
    <div class="col-md-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class UserSettingIndex extends Vue { }
</script>

<style lang="scss" scoped>
.userSetting_panel {
  padding-top: 75px;
  .userSetting_panel_left {
    margin-bottom: 15px;
    background: #fff;
    border-radius: 5px;
    border: solid 1px #d1d1d2;
    .userSetting_panel_tit {
      padding: 10px 20px 5px;
      border-bottom: 1px solid #eee;
    }
    a {
      position: relative;
      display: block;
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
      &.active {
        color: #59bfff;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 2px;
          background-color: #59bfff;
        }
      }
    }
  }
}
</style>
