<template>
  <div class="tag-view">
    <my-scroll ref="myScroll">
      <el-tag
        v-for="(tag, index) in visitedViews"
        ref="tag"
        :route="tag"
        :key="index"
        :closable="!tag.meta.affix && visitedViews.length > 1"
        :type="isActive(tag) ? 'success' : ''"
        @click="handleClick(tag.path)"
        @close="handleDelete(tag)"
      >{{ tag.title || 'no-title' }}</el-tag>
    </my-scroll>
  </div>
</template>
<script>
import MyScroll from './MyScroll.vue'
import path from 'path'
import { mapGetters } from 'vuex'
export default {
  name: 'TagView',
  components: {
    MyScroll
  },
  data() {
    return {
      // 初始且不可被删除的tag
      affixTags: []
    }
  },
  computed: {
    ...mapGetters(['visitedViews']),
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    $route(newRoute) {
      this.addVisitedView()
      this.moveToCurrentTag()
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
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.$attrs.route.path === this.$route.path) {
            this.$refs.myScroll.moveToTarget(tag)
            // when query is different then update
            if (tag.$attrs.route.fullPath !== this.$route.fullPath) {
              this.$store.commit('tagView/updateView', this.$route)
            }
            break
          }
        }
      })
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        const tagPath = path.resolve(basePath, route.path)
        if (route.meta && route.meta.affix) {
          tags.push({
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, tagPath)
          tags = [...tags, ...tempTags]
        }
      })
      return tags
    },
    initTag() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        this.$store.commit('tagView/addVisitedView', tag)
      }
    },
    addVisitedView() {
      this.$store.commit('tagView/addVisitedView', this.$route)
    },
    handleClick(path) {
      this.$router.push(path)
    },
    handleDelete(tag) {
      this.$store.commit('tagView/deleteView', tag)
      // 如果删除的tag是当前tag,则跳转到最后一个tag对应的view
      if (this.isActive(tag)) {
        const latestView = this.visitedViews.slice(-1)[0]
        this.$router.push(latestView)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tag-view {
  box-sizing: border-box;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  /deep/ .el-tag {
    margin: 10px 2px;
    cursor: pointer;
  }
}
</style>
