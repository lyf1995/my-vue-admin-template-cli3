<template>
  <ul class="lu-tree">
    <li v-for="(item, index) in data" :key="index">
      <i class="el-icon-caret-right" v-show="item.children && item.children.length > 0"></i>
      {{ item.label }}
      <lu-tree :data="item.children"></lu-tree>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'LuTree',
  inject: ['for'],
  props: {
    data: {
      type: Array,
      require: true
    }
  },
  data() {
    return {}
  },
  created() {
    console.log('this.for', this.for)
  },
  methods: {}
}
</script>
<style scoped>
  ul {
    list-style-type: none;
  }
</style>
