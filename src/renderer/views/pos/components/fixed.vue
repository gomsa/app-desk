<template>
    <el-alert
      class="order-end"
      type="success"
      :closable="false"
    >
      <div>应收:<span>{{(amount/100).toFixed(2)}}</span></div>
      <div>实收:<span>{{(getCash/100).toFixed(2)}}</span></div>
      <div class="change">找零:<span>{{((getCash-amount)/100).toFixed(2)}}</span></div>
    </el-alert>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'fixed',
  props: {
    pays: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      amount: 0.00,
      getCash: 0.00
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    pays: {
      handler: function(val, oldVal) {
        let getCash = 0
        let amount = 0
        this.pays.forEach(pay => {
          getCash = getCash + (pay.getCash ? pay.getCash : pay.amount)
          amount = amount + pay.amount
        })
        this.getCash = getCash
        this.amount = amount
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "../../../css/atom/syntax-variables.less";
.order-end{
    position:fixed;
    margin:auto;
    left:0;
    right:0;
    top:0;
    bottom:0;
    width: 80vw;
    height: 30vh;
}
.el-alert /deep/ .el-alert__description{
  font-size: (100vh/100vw)*7vw;
  font-weight: 900;
}
.change{
  color: @el-danger;
}
</style>
