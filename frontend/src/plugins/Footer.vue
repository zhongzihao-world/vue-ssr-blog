<template>
  <footer></footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
footer {
  width: 100%;
  min-width: 1200px;
  padding: 20px 0;
  background-color: #2b2f32;
  z-index: 9999;
  text-align: center;
  font-size: 12px;
  color: #606970;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    &.beian {
      color: #ffffff;
    }
    .gongan-num {
      margin-left: 5px;
    }
  }
}
</style>
