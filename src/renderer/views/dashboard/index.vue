<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }} {{ hello }}</div>
    <el-button @click="onPrinter">打印</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Parallel } from '@/rpc/render'
export default {
  name: 'Dashboard',
  data() {
    return {
      hello: '123'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
  },
  methods: {
    onPrinter() {
      const params = {
        devfile: 'LPT3',
        text: '测试打印'
      }
      console.log(params)
      Parallel(params).then(response => {
        this.hello = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
