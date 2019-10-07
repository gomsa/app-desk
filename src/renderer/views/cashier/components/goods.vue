<template>
      <el-table
        :data="goods"
        height="80vh"
        highlight-current-row
        class="goods"
      >
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
          prop="code"
          label="编码"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="subtotal"
          label="小计"
          width="200"
        >
        </el-table-column>
      </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      goods: [{
        code: '0123456789111',
        name: '可乐果粒橙',
        number: 99991.00,
        price: 9.90,
        subtotal: 9.90
      }, {
        code: '83079',
        name: '小中排',
        number: 2.95,
        price: 32,
        subtotal: 94.5
      }, {
        code: '17321',
        name: '14特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '13特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '12特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '11特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '10特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '9特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '8特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '7特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '6特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '5特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '4特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '3特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '2特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }, {
        code: '17321',
        name: '1特价菜',
        number: 0.50,
        price: 4,
        subtotal: 2
      }]
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
  }
}
</script>

<style lang="less" scoped>
@import "../../../css/atom/syntax-variables.less";
.goods{
  width:100vw;
}
.el-table::before{
  height:0px;
}
.el-table /deep/ th{
    color: @syntax-color-class;
    font-size:x-large;
    background-color: @syntax-background-color;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-table /deep/ tr{
    font-size:x-large;
    color: @syntax-color-snippet;
    background-color: @syntax-background-color;
}
.el-table {
    font-size:x-large;
    background-color: @syntax-background-color;
}
.el-table /deep/ .el-table__body tr.current-row>td, .el-table /deep/ .el-table__body tr.hover-row>td{
    background-color: @syntax-wrap-guide-color;
}


</style>
