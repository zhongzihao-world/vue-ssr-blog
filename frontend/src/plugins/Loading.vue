<template>
  <div class="loading" v-show="getLoadingStatus" v-loading="getLoadingStatus" :element-loading-text="getLoadingText">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Loading extends Vue {
  get getLoadingStatus() {
    return this.$store.state.loadingStatus;
  }

  get getLoadingText() {
    return this.$store.state.loadingText;
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
}
</style>
