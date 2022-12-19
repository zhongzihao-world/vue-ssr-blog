<template>
  <div class="bottom_line">
    <span class="content">我是有底线的~😄</span>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BottomLine extends Vue {
}
</script>

<style lang="scss" scoped>
.bottom_line {
  width: 100%;
  margin: 20px auto;
  position: relative;
  text-align: center;
  overflow: hidden;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 40%;
    height: 2px;
    background: #aedbfa;
    transform: translateY(-50%);
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    width: 40%;
    height: 2px;
    background: #aedbfa;
    transform: translateY(-50%);
  }
  .content {
    padding: 0 15px;
  }
}
</style>
