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
          min-width="35"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="编码"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="180"
        >
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.number.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ (scope.row.price/100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="小计"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ (scope.row.total/100).toFixed(2) }}
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
  watch: {
    goods: {
      handler: function(val, oldVal) {
        let id = val.length
        val.forEach(goods => {
        // 重新计算id
          goods.id = id
          id--
          // 计算总价或者数量
          if (!goods.total) {
            goods.total = goods.number * goods.price
          } else {
            goods.number = Math.round(goods.total / goods.price * 100) / 100
          }
        })
      },
      deep: true
    }
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
        this.$emit('currentGoods', this.good)
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
        this.goods[this.currentRow].total = number * this.goods[this.currentRow].price
        this.$emit('currentGoods', this.goods[this.currentRow])
      }
    },
    // 删除选择商品
    deleteGoods() {
      if (this.goods.length > 0) {
        this.goods.splice(this.currentRow, 1)
        const currentRow = this.currentRow > 0 ? this.currentRow - 1 : 0
        this.resetCurrentRow(currentRow)
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
