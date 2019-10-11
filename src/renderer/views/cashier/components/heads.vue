<template>
    <el-row :gutter="20" class="heads">
        <el-col class="user" :span="6">
          <el-row> 账号: {{ username }} </el-row> 
          <el-row class="username"> 名称: {{ name }} </el-row> 
        </el-col>
        <el-col class="logo" :span="12">
          <img :src="logo" alt=""> 
          <span>新世纪超市</span>
        </el-col>
        <el-col class="stauts" :span="6">
            <el-row> 
              <svg-icon v-bind:class="{ active: stauts.router }" icon-class="router" />  
              <svg-icon v-bind:class="{ active: stauts.server }" icon-class="server" />
              <svg-icon v-bind:class="{ active: stauts.internet }" icon-class="internet" />  
            </el-row>
            <el-row>
            {{ date | parseTime('{y}-{m}-{d} {h}:{i}:{s} 星期{a}') }}
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { onLine, isInternet, isServer } from '@/utils/navigator'
export default {
  name: 'heads',
  data() {
    return {
      logo: '/static/img/logo.png',
      date: new Date(),
      stauts: {
        router: false,
        internet: false,
        server: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'name'
    ])
  },
  created() {
  },
  mounted() {
    this.timer = setInterval(() => {
      this.interval()
    }, 1000)
  },
  methods: {
    // 实时状态
    interval() {
      this.date = new Date() // 修改数据date
      // 网络状态
      this.stauts.router = onLine()
      isServer().then(res => {
        this.stauts.server = res.data.valid
      }).catch(error => {
        this.stauts.server = false
        console.log(error.data)
      })
      isInternet().then(res => {
        this.stauts.internet = res.alive
      }).catch(error => {
        this.stauts.internet = false
        console.log(error.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../css/atom/syntax-variables.less";
.heads{
  height: 8vh;
}
.user{
  height: 8vh;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction:column;
  justify-content: flex-end;
}
.logo{
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    margin-left: 2vh;
    font-size: 5vh;
  }
  img{
    height: 7vh;
  }
}
.stauts{
  height: 8vh;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction:column;
  justify-content: flex-end;
  .el-row{
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  svg{
    font-size: 3vw;
  }
  .active{
    color: @el-success
  }
}
</style>
