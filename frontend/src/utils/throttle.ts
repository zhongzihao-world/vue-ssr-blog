/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';

/** 函数节流
 *
 * @param fn 回调函数
 * @param delay 延迟时间
 */
function throttle(fn: Function, delay = 100) {
  let last = 0;
  return function (...args: any) {
    const context: any = this;
    const now = Date.now();
    if (now - last > delay) {
      fn.apply(context, args);
      last = now;
    }
  };
}

Vue.prototype.$throttle = throttle;
