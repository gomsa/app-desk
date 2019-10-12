<template>
      <el-table
        ref="table"
        :data="goods"
        height="72vh"
        size="mini"
        highlight-current-row
        class="goods"
      >
        <template slot="empty">暂无商品录入</template>
        <el-table-column
          label="#"
          prop="id"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="编码"
          width="220"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.number.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          width="130"
        >
          <template slot-scope="scope">
            {{ (scope.row.price/100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="subtotal"
          label="小计"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.subtotal/100).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'goods',
  props: {
    goods: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentRow: 0,
      good: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 1 or -1 上下选择行
    handerCurrentRow(value) {
      if (value > 0 && this.goods.length - 1 > this.currentRow) {
        this.currentRow = this.currentRow + value
      }
      if (value < 0 && this.currentRow > 0) {
        this.currentRow = this.currentRow + value
      }
      this.setCurrentRow(this.currentRow)
      this.scrollTop(this.currentRow)
    },
    // 重置选择行
    resetCurrentRow(value = 0) {
      this.currentRow = value
      this.setCurrentRow(this.currentRow)
      this.scrollTop(this.currentRow)
    },
    // 设置选择航
    setCurrentRow(value) {
      this.$refs.table.setCurrentRow(this.goods[value])
      if (this.goods[value]) {
        this.good = this.goods[value]
        this.$emit('good', this.good)
      }
    },
    // 滚动窗口到指定行
    scrollTop(value) {
      this.$refs.table.bodyWrapper.scrollTop = value * 36
    },
    // 设置选择行数量
    setNumber(number) {
      if (number && this.goods.length > 0) {
        // 防止输入 1.256.6655.6这类数
        number = parseFloat(number).toFixed(2)
        this.goods[this.currentRow].number = number
        this.goods[this.currentRow].subtotal = number * this.goods[this.currentRow].price
        this.$emit('good', this.goods[this.currentRow])
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../css/atom/syntax-variables.less";
.goods{
  width:100vw;
}
.el-table /deep/ th{
    color: @el-warning;
    font-size:2.5vh;
    background-color: @syntax-background-color;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-table /deep/ tr{
    font-size:2.5vh;
    color: @el-success;
    background-color: @syntax-background-color;
}
.el-table {
    font-size:2.5vh;
    background-color: @syntax-background-color;
}
.el-table /deep/ .el-table__body tr.current-row>td{
  color: @el-danger;
  font-size:3vh;
}
// 取消背景色
.el-table /deep/ .el-table__body tr.current-row>td,.el-table /deep/ .el-table__body tr.hover-row>td{
  background-color: @syntax-background-color;
}

</style>
