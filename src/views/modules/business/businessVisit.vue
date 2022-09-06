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
  name: 'visit',
  data() {
    return {
      chartVisit: null,
      visitData:null,
      saleTable: {
        businessId: this.$store.state.merchantId,
        startDate: '',
        endDate: '',
        date:''
      },
    }
  },
  mounted() {
    this.initchartVisit()
    this.getData()
    window.addEventListener('resize',()=>{
      this.chartVisit.resize()
    })
    
  },
  activated(){
    if (this.chartVisit) {
      this.chartVisit.resize()
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
    initchartVisit() {
      this.chartVisit = echarts.init(this.$refs.sale_ref)
      const option = {
        title: {
          text: '| 店铺访问量统计对比图',
          left:20,
          top:20
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true
        },
        xAxis: {
            type: 'category',
            
        }
        ,
        yAxis: {
            type: 'value'
        }
        ,
        series: [
          {
            type: 'line',
          }
        ]
       
      };
      this.chartVisit.setOption(option)
    },
    // 获取数据
    getData() {
    console.log(this.saleTable.startDate,this.saleTable.endDate)
    var _this = this
    //获取服务器数据后更新数据
    //  axios({
    //   url: 'http://localhost:80/api/bash/businessvisit/data',
    //   method: 'get',
    //   params: {
    //     'businessId': _this.saleTable.businessId,
    //     'startDate': _this.saleTable.startDate,
    //     'endDate': _this.saleTable.endDate
    //   }
    //  }).then(function(res){
    //   if(res.data && res.data.code === 0) {
    //     _this.visitData = res.data.visitData
    //   }
    //  }).catch(function(err){
    //   console.log(err)
    //  })
    _this.visitData = [
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-01",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-02",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-03",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-04",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-05",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-06",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-07",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-08",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 1,
            "dayTime": "2022-09-09",
            "isDeleted": 0
        },
        {
            "businessId": 10,
            "visit": 2,
            "dayTime": "2022-09-10",
            "isDeleted": 0
        }
    ]
    this.update()
    },
    // 处理图表数据
    update() {
      //获得时间数组
      const timeArr = this.visitData.map(item => {
        return item.dayTime
      })
      //获得访问量数组
      const visitArr = this.visitData.map(item => {
        return item.visit
      })
      const dataOption = {
        legend:{
          data:timeArr
        },
        xAxis:{
            data:timeArr
        }
        ,
        series:[
          {
            data:visitArr,
          }
        ]       
      }
      this.chartVisit.setOption(dataOption)
    }
  }
}
</script>

<style scoped>
  .container {
    width: 500px;
    height: 600px;
  }
  .chart {
    width:400px;
    height: 500px;
  }
</style>
  
  
  



