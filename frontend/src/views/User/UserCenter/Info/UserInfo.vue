<template>
  <div class="userInfo_panel">
    <h3 class="userInfo_panel_tit">个人信息</h3>
    <div class="userInfo_panel_body">
      <div class="userInfo_item">
        <div class="tit">昵称</div>
        <div class="inp">{{getAuthor.nick_name}}</div>
      </div>
      <div class="userInfo_item">
        <div class="tit">性别</div>
        <div class="inp" v-if="getAuthor.sex === 1">
          {{getAuthor.sex === 1 ? '男': '女'}}
        </div>
      </div>
      <div class="userInfo_item" v-if="getAuthor.showe_mail">
        <div class="tit">邮箱</div>
        <div class="inp">
          {{getAuthor.email}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">生日</div>
        <div class="inp">
          {{getAuthor.birthday | getExactTime}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">血型</div>
        <div class="inp">
          {{getAuthor.blood}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">简介</div>
        <div class="inp">
          {{getAuthor.summary}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">博客地址</div>
        <div class="inp">
          {{getAuthor.blog_url}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">QQ</div>
        <div class="inp">
          {{getAuthor.qq_number}}
        </div>
      </div>
      <div class="userInfo_item">
        <div class="tit">注册日期</div>
        <div class="inp">
          {{getAuthor.created_time | getExactTime}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class UserInfo extends Vue {
  @Prop({ required: true })
  readonly uid!: string;

  get getAuthor() {
    return this.$store.state.author_info;
  }
}
</script>

<style lang="scss" scoped>
.userInfo_panel {
  position: relative;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 15px;
  border-right: solid 1px #d6d6d7;
  border-bottom: solid 1px #d1d1d2;
  .userInfo_panel_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .userInfo_panel_body {
    padding: 10px 20px;
    overflow: hidden;
    .userInfo_item {
      display: flex;
      .tit {
        width: 60px;
        height: 34px;
        line-height: 34px;
        text-align: left;
        font-weight: bold;
      }
      .inp {
        margin-left: 20px;
        line-height: 40px;
        color: #333;
      }
    }
  }
}
</style>
