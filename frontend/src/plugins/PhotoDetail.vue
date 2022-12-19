<template>
  <div class="photo_dialog" @click="closeModel">
    <div class="photo_box">
      <div class="photo_tit">
        <h4>照片</h4>
      </div>
      <div class="photo_body" @click="closeModel">
        <img v-lazy="url">
      </div>
      <div class="photo_foot" v-if="photo_id" @click="(e)=>e.stopPropagation()">
        <span title="日期">
          <i class="el-icon-date"></i> {{created_time | getExactTime }}</span>
        <span>
          <i class="el-icon-s-custom"></i> {{nick_name}}</span>
        <span class="photo_like" @click="likePhoto()">
          <i class="el-icon-star-off"></i> {{like_count}}</span>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class PhotoDetail extends Vue {
  @Prop({ required: true })
  readonly photo_id!: string;

  @Prop({ required: true })
  readonly user_id!: string;

  @Prop({ required: true })
  readonly url!: string;

  @Prop({ required: true })
  readonly nick_name!: string;

  @Prop({ required: true })
  readonly created_time!: string;

  @Prop({ required: true })
  readonly describe!: string;

  @Prop({ required: true })
  readonly like_count!: number;

  closeModel() {
    this.$emit('closeModel', false);
  }

  async likePhoto() {
    this.$emit('likePhoto', this.photo_id);
  }
}
</script>

<style lang="scss" scoped>
.photo_dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  outline: 0;
  transition: opacity 0.3s ease;
  .photo_box {
    position: absolute;
    left: 50%;
    top: 15%;
    transform: translateX(-50%);
    display: inline-block;
    max-width: 1200px;
    background: #ffffff;
    border-radius: 10px;
    transition: all 0.3s ease;
    .photo_tit {
      position: relative;
      border-radius: 5px 5px 0 0;
      background: #edf8fe;
      padding: 10px 20px;
      color: #59bfff;
    }
    .photo_body {
      padding: 10px 20px;
      overflow: hidden;
      cursor: zoom-out;
      img {
        max-height: 70vh;
        max-width: 80vw;
      }
    }
    .photo_foot {
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
</style>
