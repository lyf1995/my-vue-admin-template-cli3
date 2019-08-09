<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .clearfix:after {
    content: ' ';
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }
</style>
