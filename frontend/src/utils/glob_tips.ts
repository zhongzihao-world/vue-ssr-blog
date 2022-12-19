
import Vue from 'vue';

interface TipsInfo {
  msg: string;
}

const glob_tips = {
  $global_sucess(msg: TipsInfo) {
    this.$notify({
      title: msg,
      type: 'success',
      duration: 2000,
    });
  },
  $global_fail(msg: TipsInfo) {
    this.$notify({
      title: msg,
      type: 'warning',
      duration: 2000,
    });
  },
  $global_error(msg: TipsInfo) {
    this.$notify({
      title: msg,
      type: 'error',
      duration: 2000,
    });
  },
};


Vue.prototype.$global_sucess = glob_tips.$global_sucess;
Vue.prototype.$global_fail = glob_tips.$global_fail;
Vue.prototype.$global_error = glob_tips.$global_error;
