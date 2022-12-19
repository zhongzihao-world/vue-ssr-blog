<template>
  <div class="container">
    <div class="banner_user" style="z-index:1;">
      <div class="banner_photo">
        <div class="photo_wrap">
          <img :src="getAuthor.header">
        </div>
      </div>
      <div class="banner_nick">
        <h3>
          {{getAuthor.nick_name}}
          <span v-if="getAuthor.sex == 1" class="sex_nan"><i class="el-icon-user-solid"></i></span>
          <span v-if="getAuthor.sex == 2" class="sex_nv"><i class="el-icon-user"></i></span>
        </h3>
      </div>
    </div>
    <div class="container" style="z-index:1;position:relative;">
      <div class="userTab_panel">
        <template v-if="getAuthor._id">
          <router-link :to="{ name: 'userIndex', params: { uid }}" class="tab_user_a" active-class="active" exact>
            {{is_me?'我的主页':getAuthor.sex == 1?'他的主页':'她的主页'}}
          </router-link>
          <router-link :to="{ name: 'userAlbum', params: { uid }}" class="tab_user_a" active-class="active">
            {{is_me?'我的相册':getAuthor.sex == 1?'他的相册':'她的相册'}}
          </router-link>
        </template>
      </div>
      <div class="col-md-3 userSidebar" style="padding-left:0;padding-right:10px">
        <el-row class="sidebar_panel">
          <router-link v-if="is_me" to="/article" class="sidebar_article_btn">写日记</router-link>
        </el-row>
        <el-row class="sidebar_panel sidebar_other_info">
          <div class="col-xs-6 sidebar_info_box">
            <router-link :to="{ name: 'userIndex', params: { uid }}">
              <strong>{{article_count}}</strong>
              <span>日记</span>
            </router-link>
          </div>
          <div class="col-xs-6 sidebar_info_box">
            <router-link :to="{ name: 'userAlbum', params: { uid }}">
              <strong>{{photo_count}}</strong>
              <span>相册</span>
            </router-link>
          </div>
        </el-row>
        <el-row class="sidebar_panel sidebar_basic_info">
          <h3>个人信息</h3>
          <div class="sidebar_basic_info_body">
            <ul>
              <li>昵称：<span>{{getAuthor.nick_name}}</span></li>
              <li v-if="getAuthor.sex === 1">性别：<span>男</span></li>
              <li v-if="getAuthor.sex === 2">性别：<span>女</span></li>
              <li v-if="getAuthor.showe_mail">邮箱：<span>{{getAuthor.email}}</span></li>
              <li v-if="getAuthor.birthday"><span>生日：{{getAuthor.birthday}}</span></li>
              <li v-if="getAuthor.summary">简介：<span>{{getAuthor.summary}}</span></li>
            </ul>
          </div>
          <div class="sidebar_basic_info_body_foot">
            <router-link :to="{ name: 'userInfo', params: { uid }}"> 查看更多</router-link>
          </div>
        </el-row>
      </div>
      <div class="col-md-9" style="padding-left:10px;padding-right:0;">
        <router-view :uid="uid" style="height:calc(100vh - 320px);overflow-y:auto;background: #fff;" :key="$route.path"></router-view>
      </div>
    </div>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue, Watch } from 'vue-property-decorator';
import api from '../../../api/api.config';

@Component({
  components: {},
})
export default class UserCenter extends Vue {
  get uid() {
    return this.$route.params.uid;
  }

  get getUser() {
    return this.$store.state.user_info;
  }

  get getAuthor() {
    return this.$store.state.author_info;
  }

  get is_me() {
    return this.uid === this.getUser._id;
  }

  article_count = 0;

  photo_count = 0;

  interval: any;


  @Watch('uid')
  refreshInfo() {
    this.getAuthorInfo();
  }

  mounted() {
    if (this.uid) {
      this.getAuthorInfo();
      this.getUserArticleCount();
      this.getUserPhotoCount();
    }
    this.startMove();
    this.$on('hook:beforeDestroy', () => {
      window.clearInterval(this.interval);
    });
  }


  /* ------------方法------------ */
  // eslint-disable-next-line class-methods-use-this
  startMove() {
    const dots_num = 100; // 粒子总数
    const max_distance = 50;// 每个粒子距离
    const inner_width: number = window.innerWidth;
    const inner_height: number = window.innerHeight;
    // 返回一个min和max之间的一个随机整数
    function randow(min: any, max: any) {
      return Math.round(Math.random() * (max - min) + min);
    }
    // 返回一个min和max之间的一个随机小数
    function random(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }

    const canvas_dom: any = this.$refs.canvas;
    canvas_dom.width = inner_width;
    canvas_dom.height = inner_height;

    const dots_list: any = [];
    // 存储每个粒子属性
    for (let i = 0; i < dots_num; i++) {
      const arcObj = {
        arcX: randow(0, inner_width), // 圆的X坐标
        arcY: randow(0, inner_height), // 圆的Y坐标
        arcR: 1, // 圆的半径
        color: `rgba(${randow(0, 255)},${randow(0, 255)},${randow(0, 255)},${random(0, 1)})`,
        suduX: random(-0.5, 0.5), // 圆X轴速度
        suduY: random(-0.5, 0.5), // 圆Y轴速度
      };
      dots_list.push(arcObj);
    }

    // 获取2D绘图环境
    const context = canvas_dom.getContext('2d');
    function draw() {
      context.clearRect(0, 0, inner_width, inner_height);
      for (let i = 0; i < dots_num; i++) {
        // 让圆动起来
        dots_list[i].arcX += dots_list[i].suduX;
        dots_list[i].arcY += dots_list[i].suduY;
        context.beginPath();
        context.fillStyle = dots_list[i].color;
        context.arc(dots_list[i].arcX, dots_list[i].arcY, dots_list[i].arcR, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        // 边界检测,将速度取反,实现碰撞
        if (dots_list[i].arcX <= 0 || dots_list[i].arcX > inner_width) { dots_list[i].suduX *= -1; }

        if (dots_list[i].arcY <= 0 || dots_list[i].arcY > inner_height) { dots_list[i].suduY *= -1; }

        // 利用勾股定理判断是否连线 a*a+b*b=c*c
        //  Math.sqrt() 平方根
        //  Math.pow(a,b)  a的b次方
        for (let j = i + 1; j < dots_num; j++) {
          // eslint-disable-next-line no-restricted-properties
          if (Math.sqrt(Math.pow(dots_list[i].arcX - dots_list[j].arcX, 2) + Math.pow(dots_list[i].arcY - dots_list[j].arcY, 2)) < max_distance) {
            context.beginPath();
            context.strokeStyle = dots_list[i].color;
            context.moveTo(dots_list[i].arcX, dots_list[i].arcY);
            context.lineTo(dots_list[j].arcX, dots_list[j].arcY);
            context.closePath();
            context.stroke();
          }
        }
      }
    }
    this.interval = setInterval(draw, 20);

    /* ---------------------- */
    canvas_dom.onmousemove = (e: any) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      for (let i = 0; i < dots_num; i++) {
        // eslint-disable-next-line no-restricted-properties
        if (Math.sqrt(Math.pow(dots_list[i].arcX - mouseX, 2) + Math.pow(dots_list[i].arcY - mouseY, 2)) < 100) {
          context.beginPath();
          context.strokeStyle = dots_list[i].color;
          context.moveTo(mouseX, mouseY);
          context.lineTo(dots_list[i].arcX, dots_list[i].arcY);
          context.closePath();
          context.stroke();
        }
      }
    };
    canvas_dom.onclick = (e: any) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      for (let i = 0; i < dots_num; i++) {
        // eslint-disable-next-line no-restricted-properties
        if (Math.sqrt(Math.pow(dots_list[i].arcX - mouseX, 2) + Math.pow(dots_list[i].arcY - mouseY, 2)) < 100) {
          context.beginPath();
          context.strokeStyle = dots_list[i].color;
          context.moveTo(mouseX, mouseY);
          context.lineTo(dots_list[i].arcX, dots_list[i].arcY);
          context.closePath();
          context.stroke();
        }
      }
    };
    window.onresize = () => {
      canvas_dom.width = inner_width;
      canvas_dom.height = inner_height;
    };
  }

  async getAuthorInfo() {
    const data = {
      user_id: this.uid,
    };
    const res = await api.getUserInfo(data);
    this.$store.commit('UPDATE_AUTHOR_INFO', res.data.content);
  }

  async getUserArticleCount() {
    const data = {
      user_id: this.uid,
    };
    const res = await api.getUserArticleCount(data);
    // console.log(res);
    this.article_count = res.data.content;
  }

  async getUserPhotoCount() {
    const data = {
      user_id: this.uid,
    };
    const res = await api.getUserPhotoCount(data);
    // console.log(res);
    this.photo_count = res.data.content;
  }
}
</script>

<style lang="scss" scoped>
.banner_user {
  position: relative;
  width: 108px;
  margin: 30px auto 12px auto;
  .banner_photo {
    width: 108px;
    margin: 0 auto 12px auto;
    .photo_wrap {
      width: 108px;
      height: 108px;
      padding: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }
  }
  .banner_nick {
    color: #fff;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;
    h3 {
      text-align: center;
      span {
        display: inline-block;
        color: #fff;
        font-size: 12px;
        line-height: 12px;
        height: 18px;
        padding: 3px;
        &.sex_nan {
          background: #59bfff;
          border-radius: 50%;
        }
        &.sex_nv {
          background: #ff5b7e;
          border-radius: 50%;
        }
      }
    }
  }
}
.userTab_panel {
  background: #fff;
  border-radius: 5px;
  margin-bottom: 15px;
  border-right: solid 1px #dededf;
  border-bottom: solid 1px #d9d9da;
  height: 45px;
  display: flex;
  justify-content: space-evenly;
  a {
    position: relative;
    width: 150px;
    padding: 0 7px;
    line-height: 45px;
    text-align: center;
    &.active {
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #59bfff;
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
      }
    }
  }
}
.userSidebar {
  .sidebar_panel {
    background: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
    .sidebar_article_btn {
      display: block;
      width: 100%;
      color: #fff;
      background-color: #59bfff;
      border-color: #46b8da;
      text-align: center;
      padding: 6px 12px;
      font-size: 14px;
      border-radius: 4px;
      &:hover {
        color: #fff;
        background-color: #50ace5;
        border-color: #269abc;
      }
    }
  }
  .sidebar_other_info {
    padding: 10px 0;
    .sidebar_info_box {
      text-align: center;
      a {
        display: block;
        strong {
          display: block;
          margin-bottom: 5px;
          font-family: Tahoma;
          font-weight: 400;
          font-size: 18px;
          line-height: 18px;
        }
        span {
          color: #808080;
          font-size: 12px;
        }
      }
    }
  }
  .sidebar_basic_info {
    h3 {
      position: relative;
      border-radius: 5px 5px 0 0;
      background: #edf8fe;
      padding: 10px 20px;
      color: #2c3e50;
    }
    .sidebar_basic_info_body {
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
    .sidebar_basic_info_body_foot {
      border-top: 1px solid #eee;
      text-align: center;
      a {
        padding: 10px 0;
        display: block;
        font-weight: 700;
      }
    }
  }
}
.canvas {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.98);
}
</style>
