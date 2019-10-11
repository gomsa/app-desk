<template>
    <div class="floor">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-row class="stauts"> 
            <span>状态:</span>
            <span v-bind:class="[ status ? 'success' : 'danger']"> {{ sales }} </span>
          </el-row>
          <el-row class="order"> 
            <span>订单号:</span>
            <span class="id"> {{ orderID }} </span>
          </el-row> 
          <el-row> 
            <el-input 
              ref="input"
              v-model="input" 
              @keyup.enter.native="handerInput"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              placeholder="条码/编码/付款码/数量"
            />
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-row>
            <el-col :span="12" class="good">
              <span>名称: {{ good.name }}</span>
              <span>单价: {{ good.price }}</span>
              <span>小计: {{ good.subtotal }}</span>
              <span>部门: {{ good.dep }}</span>
            </el-col>
            <el-col :span="12" class="good">
              <span>序号: {{ good.id }}</span>
              <span>数量: {{ good.number }}</span>
              <span>编码: {{ good.code }}</span>
              <span>条码: {{ good.barcode }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <div class="payable background-danger">
            <el-row class="total"> 
              <span>收 款</span>
              <span></span>
              <span>数 量: {{ number.toFixed(2) }}</span>
            </el-row>
            <el-row class="totals">￥{{ (total/100).toFixed(2) }}</el-row>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'foots',
  props: {
    status: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0.00
    },
    number: {
      type: Number,
      default: 0
    },
    good: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    orderID() {
      return '00101910060289'
    },
    sales() {
      return this.status ? '销货' : '退货'
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    handerInput() {
      this.$emit('input', this.input)
    }
  },
  destroyed() {
  }
}
</script>

<style lang="less" scoped>
@import "../../../css/atom/syntax-variables.less";
// 定义相关样式

// 内容样式
.floor{
  width: 100%;
  margin-top: 2vh;
}

//*****//
// 修改输入框样式
.el-input /deep/ .el-input__inner{
  margin-top: 1vh;
  background-color: #606266;
  color:#FFF;
}
.order{
  margin-top: 1vh;
  font-size: 1.9vw;
  .id{
    color: @el-warning;
  }
}
.stauts{
  font-size: 1.9vw;
}
.good{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  span{
    margin-bottom: 1vh;
    font-size: 1.9vw;
  }
}
.success{
  color: @el-success;
}
.warning{
  color: @el-warning;
}
.danger{
  color: @el-danger;
}

.background-success{
  background-color: @el-success;
}
.background-warning{
  background-color: @el-warning;
}
.background-danger{
  background-color: @el-danger;
}

.payable{
  width: 30vw;
  height: 15vh;
  border-radius:4px;
  padding: 15px;
  color: #ffffff;
  font-weight: 900;
  .total{
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: space-between;
    font-size: 1.9vw;
    padding-left: 1vw;
  }
  .totals{
    font-size: 5vw;
  }
}
</style>
