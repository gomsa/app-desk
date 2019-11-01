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
            <span class="id"> {{ order.order_no }} </span>
          </el-row> 
          <el-row> 
            <el-input 
              ref="input"
              v-model="input" 
              @keyup.enter.native="handerInput"
              @input="hanerOnInput"
              placeholder="条码/编码/付款码/数量"
            />
          </el-row>
          <el-row v-if="cacheAmount" class="cacheAmount"> 
            <span class="id"> 待扫码/刷卡金额: </span>
            <span>{{ (cacheAmount/100).toFixed(2) }} </span>
          </el-row> 
        </el-col>
        <el-col :span="10">
          <div v-if="order.pays.length>0">
            <div v-for="(pay,index) in order.pays" :key="index" class="pay-list">
              <div class="name"><span class="warning">{{pay.type | payName}} </span></div>
              <div class="pay">付款: <span class="success">{{(pay.amount/100).toFixed(2) }} </span></div>
              <div class="change">实收: <span class="brand"> {{((pay.getCash?pay.getCash:pay.amount)/100).toFixed(2) }} </span></div>
              <!-- <div>找零: <span>{{((pay.getCash - pay.amount)/100).toFixed(2) }} </span></div> -->
              <div class="status"><span v-bind:class="[ pay.status ? 'success' : 'danger']">{{pay.status ?'已收款':'待收款' }} </span></div>
            </div>
          </div>
          <el-row v-else-if="Object.keys(goods).length>0">
            <el-col :span="12" class="good">
              <span>名称: {{ goods.name }}</span>
              <span>单价: {{ goods.price?(goods.price/100).toFixed(2):'' }}</span>
              <span>小计: {{ goods.price?(goods.total/100).toFixed(2):'' }}</span>
              <span>部门: {{ goods.dep }}</span>
            </el-col>
            <el-col :span="12" class="good">
              <span>序号: {{ goods.id }}</span>
              <span>数量: {{ goods.number }}</span>
              <span>编码: {{ goods.code }}</span>
              <span>条码: {{ goods.barcode }}</span>
            </el-col>
          </el-row>
          <div v-else>
            <span>最后商品更新: {{ info.syncGoodsTime }}</span>
          </div>
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
    cacheAmount: {
      type: Number,
      default: 0.00
    },
    goods: {
      type: Object,
      default: {
      }
    },
    info: {
      type: Object,
      default: {
      }
    },
    order: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      input: '',
      number: 0,
      total: 0.00
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    sales() {
      return this.status ? '销货' : '退货'
    }
  },
  filters: {
    payName(value) {
      switch (value) {
        case 'vipCard':
          return '储值卡'
        case 'alipay':
          return '支付宝'
        case 'wechat':
          return '微信'
        case 'cash':
          return '现金'
        default:
          break
      }
    }
  },
  watch: {
    order: {
      handler: function(val, oldVal) {
        let number = 0
        let total = 0
        this.order.goods.forEach(good => {
          number = number + good.number
          total = total + good.total
        })
        this.order.pays.forEach(pay => {
          total = total - pay.amount
        })
        this.number = number
        this.total = total
      },
      deep: true
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
    },
    hanerOnInput(value) {
      this.input = value.replace(/[^0-9.;]/g, '')
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
  height:6vh;
  line-height:6vh;
  font-size:2.3vh;
}
.order{
  margin-top: 1vh;
  font-size: 2.1vh;
  .id{
    color: @el-warning;
  }
}
.stauts{
  font-size: 2.1vh;
}
.cacheAmount{
  font-size: 2.1vh;
  margin-top: 1vh;
  span{
    color: @el-danger;
  }
}
.good{
  
  display: flex;
  flex-direction: column;
  span{
    margin-bottom: 1vh;
    font-size: 2.1vh;
  }
}
.brand{
  color: @el-brand;
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
.pay-list{
  display: flex;
  justify-content: space-between;
  font-size: (100vh/100vw)*2vw;
  .name{
    width: 15%;
  }
  .pay{
    width: 35%;
  }
  .change{
    width: 35%;
  }
  .status{
    width: 15%;
    text-align:right;
  }
}
.payable{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30vw;
  height: 15vh;
  border-radius:4px;
  padding: (100vh/100vw)*1vw;
  color: #ffffff;
  font-weight: 900;
  .total{
    display: flex;
    justify-content: space-between;
    font-size: (100vh/100vw)*3vw;
    padding-left: 1vw;
  }
  .totals {
    font-size: (100vh/100vw)*7vw;
  }
}
</style>
