<template>
  <div class="container">
    <div class="form">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <!-- 订单类型 -->
        <el-form-item label="订单类型" required>
          <el-select v-model="searchForm.kind" placeholder="请选择" style="width:100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item label="订单号" required>
          <el-input v-model="searchForm.orderNum" placeholder="请输入订单号" style="width:200px"></el-input>
        </el-form-item>
        <!-- 下单时间 -->
        <el-form-item label="下单时间" required>
          <el-date-picker
            v-model="searchForm.time"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始范围"
            end-placeholder="结束范围"
            @change="dateFormat">
          </el-date-picker>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格显示 -->
    <div class="table">
      <el-table
        :data="takewayData"
        border
        height=500px
        style="width: 95%"
        class="tb">
        <el-table-column
          prop="orderNumber"
          label="订单号"
          width="220"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderDateTime"
          label="下单时间"
          width="220"
          header-align="center"
          align="center">
          <template slot-scope="scope">{{scope.row.orderDateTime.replace('T',' ')}}</template>
        </el-table-column>
        <el-table-column
          prop="payDateTime"
          label="支付时间"
          width="220"
          header-align="center"
          align="center">
          <template slot-scope="scope">{{scope.row.payDateTime.replace('T',' ')}}</template>
        </el-table-column>
        <el-table-column
          prop="userPayment"
          label="用户支付金额"
          width="220"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="businessAmount"
          label="商家实收金额"
          width="220"
          header-align="center"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
  </div>
    

  </div>
</template>

<script>
export default {
  data() {
    return {
      businessId: this.$store.state.merchantId,
      searchForm:{
        kind: '',
        orderNum:'',
        startTime:'',
        endTime:'',
        time:''
      },
      options: [{
          value: '1',
          label: '外卖'
        }, {
          value: '0',
          label: '堂食'
      }],
      takewayData:[],

      currPage: 1, // 当前页码
      totalCount: 0, // 总条数
      totalPage: 1,  //总页数
      pageSize: 10, // 每页的数据条数
    }
  },
  created(){
    this.requestData()
  },
  methods:{
    dateFormat(picker) {
      this.searchForm.startTime = picker[0]
      this.searchForm.endTime = picker[1]
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currPage = 1
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currPage = val
      this.search()    
    },
    // 查询
    search() {
      console.log(this.searchForm)
      var _this = this
      this.$axios({
        url:'/order/data/orderData',
        method:'get',
        params:{
          'page':_this.currPage,
          'limit':_this.pageSize,
          'businessId':_this.businessId,
          'kind':_this.searchForm.kind,
          'orderNumber':_this.searchForm.orderNum,
          'startTime':_this.searchForm.startTime,
          'endTime': _this.searchForm.endTime
        }
      }).then(function(res){
        if(res.data && res.data.code === 0){
          let obj  = res.data.takewayData
          _this.takewayData = obj.list
          _this.totalCount = obj.totalCount// 总条数
          _this.currPage = obj.currPage// 当前页码
          _this.totalPage = obj.totalPage//总页数
          _this.pageSize = obj.pageSize// 每页的数据条数
        }
      }).catch(function(err){
        console.log(err)
      })
    },
    // 进入时获取数据
    requestData(){
      var _this = this
      this.$axios({
        url:'/order/data/orderData',
        method:'get',
        params:{
          'page': 1,
          'limit': 10,
          'businessId': _this.businessId,
          'kind': 1,
          'orderNumber': '',
          'startTime': _this.getDefaultDate()[1],
          'endTime': _this.getDefaultDate()[0]
        }
      }).then(function(res){
        if(res.data && res.data.code === 0){
          let obj  = res.data.takewayData
          _this.takewayData = obj.list
          _this.totalCount = obj.totalCount// 总条数
          _this.currPage = obj.currPage// 当前页码
          _this.totalPage = obj.totalPage//总页数
          _this.pageSize = obj.pageSize// 每页的数据条数
        }
      })
    
    },
    //获取默认时间
    getDefaultDate(){
      const today = new Date()
      const zeroToday  = new Date(new Date().setHours(0,0,0,0))
      return [this.formatDate(today),this.formatDate(zeroToday)]
    },
    //格式化时间
    formatDate(date) {
      let seperator = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      let hour = date.getHours()
      let min = date.getMinutes()
      let sec = date.getSeconds()
      if(month >=1 && month <=9) month = '0' + month
      if(strDate >=0 && strDate <=9) strDate = '0' +strDate
      if(hour >=0 && hour <=9) hour = '0' + hour
      if(min >=0 && min <=9) min = '0' + min
      if(sec >=0 && sec <=9) sec = '0' + sec
      let current = year + seperator + month + seperator + strDate + ' ' + hour + ':' + min + ':' + sec
      return current
    },
  }

}
</script>

<style scoped>
  .form,.table {
    margin-right: 5%;
  }
  .tb {
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .block {
    float: right;
  }

</style>