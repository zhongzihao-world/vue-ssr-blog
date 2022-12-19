
<template>
  <el-upload class="album_top" :action="''" :http-request="uploadPhoto">
    <slot></slot>
  </el-upload>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator';

import axios from 'axios';

@Component({})
export default class UploadPhoto extends Vue {
  @Prop({ required: true })
  readonly upload_url!: string; // 上传地址


  @Prop({ required: true })
  readonly file_type_list!: Array<string>; // 图片限制格式 ['jpg', 'jpeg', 'png'];

  @Prop({ required: true })
  readonly file_size!: number; // 图片限制大小 限制大小 MB


  async uploadPhoto(params: any) {
    // console.log(params);
    const file_type: string = params.file.name.match(/[a-zA-Z]+$/g);
    const file_size: number = params.file.size;
    try {
      const is_img_right = this.file_type_list.some(item => file_type.includes(item));
      const is_size_overflow = file_size > this.file_size * 1024 * 1024;
      if (!is_img_right) {
        throw String('不支持的图片格式~');
      }
      if (is_size_overflow) {
        throw String('图片大小超过限制~');
      }
      const form = new FormData();
      form.append('file', params.file);
      await axios.post(this.upload_url, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res: any) => {
          this.$global_sucess('上传成功~');
          this.$emit('upload_sucess', res.data.data);
        })
        .catch(() => {
          throw String('上传失败,请重新上传~');
        });
    } catch (e) {
      console.log(e);
      this.$global_fail(`${e}`);
    } finally {
      this.$store.commit('LOADING_HIDE');
    }
  }
}
</script>

<style lang="scss" scoped>
// 上传
.album_top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  ::v-deep .el-upload-list {
    display: none;
  }
}
</style>
