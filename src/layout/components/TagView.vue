<template>
  <div class="tag-view">
    <el-tag
      v-for="(tag, index) in visitedViews"
      :key="index"
      :closable="!tag.meta.affix"
      :type="isActive(tag) ? 'success' : ''"
      @click="handleClick(tag.path)"
      @close="handleDelete(index)"
    >{{ tag.meta.title }}</el-tag>
  </div>
</template>
<script>
import path from 'path'
export default {
  name: 'TagView',
  data() {
    return {
      visitedViews: []
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    $route(newRoute) {
      this.addVisitedView()
    }
  },
  created() {
    this.initTag()
    this.addVisitedView()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    initTag() {
      this.visitedViews = this.filterAffixTags(this.routes)
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        const tagPath = path.resolve(basePath, route.path)
        if (route.meta && route.meta.affix) {
          console.log('basePath', basePath)
          console.log('tagPath', tagPath)
          tags.push({
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          console.log('route.path', route.path)
          const tempTags = this.filterAffixTags(route.children, tagPath)
          tags = [...tags, ...tempTags]
        }
      })
      return tags
    },
    addVisitedView() {
      if (this.visitedViews.find(v => v.path === this.$route.path)) {
        return
      }
      this.visitedViews.push(this.$route)
    },
    handleClick(path) {
      this.$router.push(path)
    },
    handleDelete(index) {
      this.visitedViews.splice(index, 1)
      if (index === this.visitedViews.length) {
        this.$router.push(this.visitedViews[index - 1])
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tag-view {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  /deep/ .el-tag {
    margin: 10px;
    cursor: pointer;
  }
}
</style>
