<template>
  <div>
    <el-pagination
      :current-page="page"
      :page-size="size"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'MyPagination',
  props: {
    page: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default() {
        return [15, 30, 100, 200]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    backTop() {
      // window.scrollTo(0, 0)
      const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
      let step = 0
      let scrollTo = scrollHeight
      const interVal = setInterval(() => {
        if (scrollTo <= 0) {
          clearInterval(interVal)
        }
        step += 10
        scrollTo = scrollTo - step
        window.scrollTo(0, scrollTo)
      }, 20)
    },
    handleSizeChange(val) {
      this.$emit('update:size', val)
      this.$emit('pagination', { page: this.page, size: val })
      this.backTop()
    },
    handleCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('pagination', { page: val, size: this.size })
      this.backTop()
    }
  }
}
</script>
<style></style>
