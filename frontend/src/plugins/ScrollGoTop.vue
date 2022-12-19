<script lang="ts">
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class ScrollGoTop extends Vue {
  @Prop({
    type: Number,
    default: 300,
  })
  distance!: number;

  is_show_goTop = false;

  // <template>
  //   <div v-show="is_show_goTop" class="gotop" @click="goTop">
  //     <i class="el-icon-caret-top"></i>
  //   </div>
  // </template>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: any, context: any) {
    return h('div',
      {
        class: 'gotop',
        style: {
          display: this.is_show_goTop ? 'block' : 'none',
        },
        on: {
          click: this.goTop,
        },
      },
      [
        h('i', { class: 'el-icon-caret-top' }),
      ]);
  }

  mounted() {
    window.addEventListener('scroll', this.$throttle(this.handleScroll, 200));
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.handleScroll);
    });
  }

  handleScroll() {
    const scrollTop: number = document.documentElement.scrollTop || document.body.scrollTop;
    this.is_show_goTop = scrollTop > this.distance;
  }


  goTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
</script>

<style lang="scss" scoped>
$active_color: rgba(87, 190, 255, 1);
.gotop {
  position: fixed;
  right: 30px;
  bottom: 60px;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-radius: 50%;
  box-shadow: 0 0 2px 0px rgb(0 0 0);
  cursor: pointer;
  &:hover {
    color: $active_color;
  }
}
</style>
