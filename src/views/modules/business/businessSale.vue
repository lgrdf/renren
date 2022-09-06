<template>
  <div class="container">
    <!-- 日期选择器 -->
    <div class="block" style="display:inline-block;">
    <el-date-picker
      v-model="saleTable.date"
      type="daterange"
      range-separator="——"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="getCurrentTime"
      style="width:280px">
    </el-date-picker>
    <el-button type="primary" class="btn" @click="getData">获取数据</el-button>
    </div>
    <!-- 图表 -->
    <div class="chart" ref="sale_ref"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'businessSale',
  data() {
    return {
      chartSale: null,
      saleData:null,
      saleTable: {
        businessId: this.$store.state.merchantId,
        startDate: '',
        endDate: '',
        date:''
      },
    }
  },
  mounted() {
    this.initchartSale()
    this.getData()
    window.addEventListener('resize',()=>{
      this.chartSale.resize()
    })
    
  },
  activated(){
    if (this.chartSale) {
      this.chartSale.resize()
    }
  },
  created(){
    let arr = this.getDefaultDate()
    this.saleTable.startDate = arr[1]
    this.saleTable.endDate = arr[0]
    this.saleTable.date = [arr[1],arr[0]]
  },
  methods:{
    //获取当前时间
    getCurrentTime(picker) {
      this.saleTable.startDate = picker[0]
      this.saleTable.endDate = picker[1]
    },
    //获取默认时间:当前日期和前一周日期
    getDefaultDate(){
      let today = new Date()
      let lastday  = new Date(today.getTime() - 1000*60*60*24*6)
      return [this.formatDate(today),this.formatDate(lastday)]
    },
    //格式化时间
    formatDate(date) {
      let seperator = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if(month >=1 && month <=9) month = '0' + month
      if(strDate >=0 && strDate <=9) strDate = '0' +strDate
      let current = year + seperator + month + seperator + strDate
      return current
    },
    // 初始化图表
    initchartSale() {
      this.chartSale = echarts.init(this.$refs.sale_ref)
      const option = {
        title: {
          text: '| 店铺销售额统计图',
          left:20,
          top:20
        },
        // tooltip: {
        //   trigger: 'axis',   
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true
        },
        xAxis: 
          {
            type: 'category',
            // axisTick: {
            //   alignWithLabel: true
            // }
          }
        ,
        yAxis: 
         {
            type: 'value'
          }
        ,
        series: [
          {
            type: 'line',
          }
        ]
       
      };
      this.chartSale.setOption(option)
    },
    // 获取数据
    getData() {
    console.log(this.saleTable.startDate,this.saleTable.endDate,'111')
    var _this = this
    //获取服务器数据后更新数据
     axios({
      url: 'http://localhost:80/api/bash/businesssale/data',
      method: 'get',
      params: {
        'businessId': _this.saleTable.businessId,
        'startDate': _this.saleTable.startDate,
        'endDate': _this.saleTable.endDate
      }
     }).then(function(res){
      if(res.data && res.data.code === 0) {
        _this.saleData = res.data.saleData
      }
     }).catch(function(err){
      console.log(err)
     })
    // _this.saleData = [
    // {
    //         "businessId": 10,
    //         "sale": 60.19,
    //         "dayTime": "2022-08-31T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 83.47,
    //         "dayTime": "2022-09-01T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 53.26,
    //         "dayTime": "2022-09-02T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 3.9,
    //         "dayTime": "2022-09-03T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 35.53,
    //         "dayTime": "2022-09-04T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 99.37,
    //         "dayTime": "2022-09-05T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 65.4,
    //         "dayTime": "2022-09-06T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 59.87,
    //         "dayTime": "2022-09-07T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 93.25,
    //         "dayTime": "2022-09-08T16:00:00.000+0000",
    //         "isDeleted": 0
    //     },
    //     {
    //         "businessId": 10,
    //         "sale": 24.45,
    //         "dayTime": "2022-09-09T16:00:00.000+0000",
    //         "isDeleted": 0
    //     }
    // ]
    this.update()
    },
    // 处理图表数据
    update() {
      //获得当天时间数组
      //this.formatDate(new Date(item.dayTime))
      const timeArr = this.saleData.map(item => {
        return this.formatDate(new Date(item.dayTime))
      })
      console.log(timeArr)
      //获得当天销售额数组
      const saleArr = this.saleData.map(item => {
        return item.sale
      })
      console.log(saleArr)
      const dataOption = {
        xAxis:
          {
            data:timeArr
          }
        ,
        series:[
          {
            data:saleArr,
          }
        ]       
      }
      this.chartSale.setOption(dataOption)
    },
  }
}
</script>

<style scoped>
  .container {
    width: 500px;
    height: 500px;
  }
  .chart {
    width:400px;
    height: 400px;
  }
</style>
  
  
  



