<template>
  <div class="container photo_panel">
    <v-water-fall :img_list="photo_list" :img_width="250" :img_margin_bottom="20" class="photo_img_box">
      <template slot-scope="scope">
        <div class="photo_item" @mouseenter="(event)=>imgEventHandle(event,true)" @mouseleave="(event)=>imgEventHandle(event,false)"
          @click="showPhotoDetail(scope.row._id, scope.row.user_id, scope.row.url, scope.row.nick_name, scope.row.created_time, scope.row.describe, scope.row.like_count)">
          <div class="photo_mask">
            <span class="photo_like" @click="likePhoto(scope.row._id)">
              <i class="el-icon-star-off"></i> {{scope.row.like_count}}
            </span>
            <div class="photo_describe">{{scope.row.describe}}</div>
          </div>
          <img v-lazy="scope.row.url">
        </div>
      </template>
    </v-water-fall>
    <v-bottom-line v-if="is_get_all" />
    <v-photo-detail v-if="is_show_photo_detail" @closeModel="is_show_photo_detail = false" @likePhoto="likePhoto(photo_id)" :photo_id="photo_detail.photo_id" :user_id="photo_detail.user_id"
      :url="photo_detail.url" :nick_name="photo_detail.nick_name" :created_time="photo_detail.created_time" :describe="photo_detail.describe" :like_count="photo_detail.like_count" />
  </div>
</template>

<script  lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';

import api from '../../api/api.config';

interface PhotoDetail {
  photo_id?: string;
  user_id?: string;
  url?: string;
  nick_name?: string;
  created_time?: string;
  describe?: string;
  like_count?: number;
}

@Component({})
export default class UploadPhoto extends Vue {
  photo_list = [];

  page_size = 20;

  current_page = 0;

  is_get_all = false; // 是否已经加载完全部

  /* ---------------- */
  is_show_photo_detail = false;

  photo_detail: PhotoDetail = {};

  is_waiting = false;


  mounted() {
    this.getPhotoList();
    window.addEventListener('scroll', this.loadMore);
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.loadMore);
    });
  }


  /* ------------方法------------ */
  loadMore() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const allHeight = document.body.scrollHeight;
    const pageHeight = document.documentElement.clientHeight;
    if (scrollTop > allHeight - pageHeight - 88 && !this.is_get_all) {
      if (!this.is_waiting) {
        this.getPhotoList();
      }
    }
  }

  async getPhotoList() {
    try {
      this.is_waiting = true;
      this.$store.commit('LOADING_SHOW');
      this.current_page += 1;
      const data = {
        current_page: this.current_page,
        page_size: this.page_size,
      };
      const res = await api.getPhotoList(data);
      this.photo_list = this.photo_list.concat(res.data.content);
      this.is_get_all = res.data.content.length < this.page_size;
    } finally {
      this.is_waiting = false;
      this.$store.commit('LOADING_HIDE');
    }
  }

  async likePhoto(photo_id: string) {
    const acess_token = await this.$getCacheData('acess_token');
    if (acess_token) {
      this.$store.commit('LOADING_SHOW');
      try {
        const data = {
          photo_id,
        };
        await api.likePhoto(data);
        this.$global_sucess('点赞成功~');
        this.getPhotoList();
      } finally {
        this.$store.commit('LOADING_HIDE');
      }
    } else {
      this.$global_fail('您还未登录~');
    }
  }

  showPhotoDetail(photo_id: string, user_id: string, url: string, nick_name: string, created_time: string, describe: string, like_count: number) {
    this.photo_detail = {
      photo_id,
      user_id,
      url,
      nick_name,
      created_time,
      describe,
      like_count,
    };
    this.is_show_photo_detail = true;
  }

  // eslint-disable-next-line class-methods-use-this
  imgEventHandle(event: any, is_enter: boolean) {
    // console.log(event);
    let direction_index: number;
    const direction_list: Array<string> = ['top', 'right', 'bottom', 'left'];
    const x: number = event.clientX;
    const y: number = event.clientY;
    // 中点坐标
    const rect_dom: any = event.target.getBoundingClientRect();
    const x0: number = rect_dom.left + rect_dom.width / 2;
    const y0: number = rect_dom.top + rect_dom.height / 2;
    const k0 = (rect_dom.height) / (rect_dom.width);
    // console.log(k0);
    // 当前鼠标点斜率
    const k = (y - y0) / (x - x0);
    if (k <= k0 && k >= -k0) {
      // 左右进出
      direction_index = x >= x0 ? 1 : 3;
    } else {
      // 上下进出
      direction_index = y >= y0 ? 2 : 0;
    }
    direction_list.forEach(item => {
      event.target.childNodes[0].classList.remove(`${is_enter ? 'leave' : 'enter'}_${item}`);
    });
    event.target.childNodes[0].classList.add(`${is_enter ? 'enter' : 'leave'}_${direction_list[direction_index]}`);
  }
}
</script>

<style  lang="scss" scoped>
@import url('../../assets/scss/img_move.scss');
.photo_panel {
  padding-top: 22px;
  .photo_img_box {
    overflow: hidden;
    width: 100%;
    .photo_item {
      position: relative;
      break-inside: avoid;
      margin: 0 auto;
      cursor: zoom-in;
      overflow: hidden;
      box-shadow: 10px 10px 5px #ccc;
      &:hover {
        .photo_mask {
          z-index: 1;
        }
      }
      img {
        width: 100%;
      }
      .photo_mask {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        &.enter_top {
          animation: enter-top 0.3s ease-in;
        }
        &.leave_top {
          animation: leave-top 0.3s ease-out;
        }
        &.enter_right {
          animation: enter-right 0.3s ease-in;
        }
        &.leave_right {
          animation: leave-right 0.3s ease-out;
        }
        &.enter_bottom {
          animation: enter-bottom 0.3s ease-in;
        }
        &.leave_bottom {
          animation: leave-bottom 0.3s ease-out;
        }
        &.enter_left {
          animation: enter-left 0.3s ease-in;
        }
        &.leave_left {
          animation: leave-left 0.3s ease-out;
        }
        .photo_like {
          position: absolute;
          top: 5px;
          right: 7px;
          cursor: pointer;
          color: #ffffff;
          i {
            color: #ff5b7e;
          }
        }
        .photo_describe {
          position: absolute;
          left: 50%;
          bottom: 5px;
          transform: translateX(-50%);
          width: 100%;
          text-align: center;
          color: #fff;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>
