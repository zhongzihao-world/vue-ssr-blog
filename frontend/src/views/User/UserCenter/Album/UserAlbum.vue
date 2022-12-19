<template>
  <div ref="userAlbum_panel" class="userAlbum_panel">
    <h3 class="userAlbum_panel_tit">相册</h3>
    <div class="userAlbum_panel_body">
      <!-- 先屏蔽 -->
      <div class="userAlbum_panel_body_top" v-if="is_me">
        <!-- <v-upload-photo :upload_url="upload_url" :file_type_list="['jpg', 'jpeg', 'png']" :file_size="1" @upload_sucess="initSearch">
          <el-button size="medium" type="primary">点击上传</el-button>
        </v-upload-photo> -->
        <el-button size="medium" type="primary" disabled title="目前暂不支持上传">点击上传</el-button>
        <div style="text-align: center;">只能上传<strong>jpg/png</strong>文件，且不超过<strong>1MB</strong></div>
      </div>
      <div class="userAlbum_panel_body_content">
        <div class="col-md-4" v-for="(item,index) in photo_list" :key="index">
          <div class="userAlbum_panel_body_content_img" @mouseenter="(event)=>imgEventHandle(event,true)" @mouseleave="(event)=>imgEventHandle(event,false)" v-lazy:background-image="item.url">
            <div class="userAlbum_panel_body_content_img_mast">
              <h3 class="userAlbum_panel_body_content_img_mast_tit">
                <span class="album_option_edit" v-if="is_me" @click="edit_dialog_visible = true;current_photo_id =item._id;current_photo_describe =item.describe">
                  <i class="el-icon-edit-outline"></i>
                </span>
                <span class="album_delete_edit" v-if="is_me" @click="delPhoto(item._id,item.url)">
                  <i class="el-icon-delete"></i>
                </span>
                <span class="album_like_edit" v-if="is_me" @click="likePhoto(item._id)">
                  <i class="el-icon-star-off"></i>
                  {{item.like_count}}
                </span>
              </h3>
              <span class="userAlbum_panel_body_content_img_mast_describe">{{item.describe}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-bottom-line v-if="is_get_all" style="width:90%;" />
    <!-- 编辑描述 -->
    <el-dialog title='编辑名字' :visible.sync="edit_dialog_visible" :modal-append-to-body="false" width="320px" center>
      <el-col :span="24">
        <el-input type="text" v-model="current_photo_describe" clearable></el-input>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPhotoDescribe" type="primary" size="mini">确定</el-button>
        <el-button @click="edit_dialog_visible = false" size="mini">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Prop, Vue } from 'vue-property-decorator';

import api from '../../../../api/api.config';

@Component({ components: {} })
export default class UserAlbum extends Vue {
  @Prop({ required: true })
  readonly uid!: string;

  upload_url = api.PHOTO_WALL_URL;

  photo_list = [];

  current_page = 0;

  page_size = 12;

  is_get_all = false; // 是否已经加载完全部

  userAlbum_panel: any;

  edit_dialog_visible = false;

  current_photo_id = '';

  current_photo_describe = '';

  is_waiting = false;

  get getUser() {
    return this.$store.state.user_info;
  }

  get is_me() {
    return this.uid === this.getUser._id;
  }

  mounted() {
    this.getUserPhotoList();
    this.userAlbum_panel = this.$refs.userAlbum_panel;
    this.userAlbum_panel.addEventListener('scroll', this.loadMore);
    this.$on('hook:beforeDestroy', () => {
      this.userAlbum_panel.removeEventListener('scroll', this.loadMore);
    });
  }


  /* ------------方法------------ */
  initSearch() {
    this.current_page = 0;
    this.photo_list = [];
    this.getUserPhotoList();
  }

  loadMore() {
    const scrollTop = this.userAlbum_panel.scrollTop || this.userAlbum_panel.scrollTop;
    const allHeight = this.userAlbum_panel.scrollHeight;
    const pageHeight = this.userAlbum_panel.clientHeight;
    if (scrollTop > allHeight - pageHeight - 88 && !this.is_get_all) {
      if (!this.is_waiting) {
        this.getUserPhotoList();
      }
    }
  }

  async getUserPhotoList() {
    try {
      this.is_waiting = true;
      this.$store.commit('LOADING_SHOW');
      this.current_page += 1;
      const data = {
        user_id: this.$route.params.uid,
        current_page: this.current_page,
        page_size: this.page_size,
      };
      const res = await api.getUserPhotoList(data);
      this.photo_list = this.photo_list.concat(res.data.content);
      this.is_get_all = res.data.content.length < this.page_size;
    } finally {
      this.is_waiting = false;
      this.$store.commit('LOADING_HIDE');
    }
  }

  async editPhotoDescribe() {
    this.$store.commit('LOADING_SHOW');
    if (!this.current_photo_describe) {
      this.$global_fail('请输入描述~');
      return;
    }
    try {
      const data = {
        photo_id: this.current_photo_id,
        photo_describe: this.current_photo_describe,
      };
      await api.editPhotoDescribe(data);
      this.$global_sucess('编辑成功~');
      this.edit_dialog_visible = false;
      this.initSearch();
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async likePhoto(photo_id: string) {
    this.$store.commit('LOADING_SHOW');
    try {
      const data = {
        photo_id,
      };
      await api.likePhoto(data);
      this.$global_sucess('点赞成功~');
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }

  async delPhoto(photo_id: string, url: string) {
    this.$store.commit('LOADING_SHOW');
    try {
      const data = {
        photo_id,
        url,
      };
      await api.delPhoto(data);
      this.$global_sucess('删除成功~');
      this.initSearch();
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
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

<style lang="scss" scoped>
@import url('../../../../assets/scss/img_move.scss');
.userAlbum_panel {
  position: relative;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 15px;
  border-right: solid 1px #d6d6d7;
  border-bottom: solid 1px #d1d1d2;
  .userAlbum_panel_tit {
    position: relative;
    border-radius: 5px 5px 0 0;
    background: #edf8fe;
    padding: 10px 20px;
    color: #59bfff;
  }
  .userAlbum_panel_body {
    padding: 30px 20px;
    overflow: hidden;
    .userAlbum_panel_body_top {
      padding-bottom: 15px;
      text-align: center;
    }
    .userAlbum_panel_body_content {
      padding-top: 15px;
      border-top: 1px solid #eee;
      .userAlbum_panel_body_content_img {
        position: relative;
        height: 200px;
        background-size: cover;
        background-position: center center;
        background-color: #ccc;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 30px;
        &:hover {
          .userAlbum_panel_body_content_img_mast {
            z-index: 1;
          }
        }
        .userAlbum_panel_body_content_img_mast {
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
          .userAlbum_panel_body_content_img_mast_tit {
            position: absolute;
            left: 50%;
            width: 60%;
            max-height: 50px;
            transform: translate(-50%, 0);
            display: flex;
            justify-content: space-evenly;
            font-size: 16px;
            color: #fff;
            span {
              transition: all 0.2s ease;
              margin: 5px 0;
              cursor: pointer;
              opacity: 1;
              &:hover {
                opacity: 0.8;
              }
              &.album_option_edit {
                color: #59bfff;
              }
              &.album_like_edit i {
                color: #ff5b7e;
              }
              &.album_delete_edit i {
                color: #59bfff;
              }
            }
          }
          .userAlbum_panel_body_content_img_mast_describe {
            position: absolute;
            left: 50%;
            bottom: 15px;
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
}
</style>
