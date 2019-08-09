<template>
  <transition name="fade">
    <div
      v-show="show"
      class="lu-backtop"
      :style="{
        'bottom': right + 'px',
        'right': right + 'px'
      }"
      @click="backToTop"
    >
      <slot>
        <i class="el-icon-caret-top" style="font-size: 16px;color: blue;"></i>
      </slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: '',
  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      show: false,
      isMoving: false
    }
  },
  mounted() {
    const _this = this
    const scrollFn = function() {
      _this.show = window.pageYOffset >= _this.visibilityHeight
    }
    const debounce = function(fn, time) {
      let timeout
      return function() {
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(fn, time)
      }
    }
    window.onscroll = debounce(scrollFn, 100)
  },
  beforeDestory() {
    console.log('beforeDestory')
    window.onscroll = null
  },
  methods: {
    backToTop() {
      if (this.isMoving) return
      let scrollTop = window.pageYOffset
      let step = 0
      const interVal = setInterval(() => {
        if (window.pageYOffset <= 0) {
          clearInterval(interVal)
        }
        step += 10
        scrollTop = scrollTop - step
        window.scrollTo(0, scrollTop)
      }, 20)
    }
  }
}
</script>
<style scoped>
  .lu-backtop {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
  }
</style>
