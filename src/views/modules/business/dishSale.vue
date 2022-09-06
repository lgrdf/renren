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
  name: 'dishSale',
  data() {
    return {
      chartBar: null,
      dishData:null,
      saleTable: {
        businessId: this.$store.state.merchantId,
        startDate: '',
        endDate: '',
        date:''
      },
    }
  },
  mounted() {
    this.initChartBar()
    this.getData()
    window.addEventListener('resize',()=>{
      this.chartBar.resize()
    })
    
  },
  activated(){
    if (this.chartBar) {
      this.chartBar.resize()
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
    initChartBar() {
      this.chartBar = echarts.init(this.$refs.sale_ref)
      const option = {
        title: {
          text: '| 菜品销售额统计图',
          left:20,
          top:20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }      
        },
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
            axisTick: {
              alignWithLabel: true
            }
          }
        ,
        yAxis: 
         {
            type: 'value'
          }
        ,
        series: [
          {
            name: '销售量',
            type: 'bar',
            barWidth: '60%',
          }
        ]
       
      };
      this.chartBar.setOption(option)
    },
    // 获取数据
    getData() {
    console.log(this.saleTable.startDate,this.saleTable.endDate)
    var _this = this
    //获取服务器数据后更新数据
     axios({
      url: 'http://localhost:80/api/dish/dishsale/data',
      method: 'get',
      params: {
        'businessId': _this.saleTable.businessId,
        'startDate': _this.saleTable.startDate,
        'endDate': _this.saleTable.endDate
      }
     }).then(function(res){
      if(res.data && res.data.code === 0) {
        _this.dishData = res.data.dishData
      }
     }).catch(function(err){
      console.log(err)
     })
    // _this.dishData = [
    //     {
    //         "dishName": "23",
    //         "dishId": 23,
    //         "sale": 570,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "17",
    //         "dishId": 17,
    //         "sale": 496,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "21",
    //         "dishId": 21,
    //         "sale": 491,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "11",
    //         "dishId": 11,
    //         "sale": 473,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "18",
    //         "dishId": 18,
    //         "sale": 463,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "12",
    //         "dishId": 12,
    //         "sale": 441,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "16",
    //         "dishId": 16,
    //         "sale": 438,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "20",
    //         "dishId": 20,
    //         "sale": 437,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "13",
    //         "dishId": 13,
    //         "sale": 428,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     },
    //     {
    //         "dishName": "24",
    //         "dishId": 24,
    //         "sale": 367,
    //         "dayTime": null,
    //         "isDeleted": 0
    //     }
    // ]
    //销售量按降序排序
    this.dishData.sort((a,b)=>{
      return b.sale - a.sale
    })
    this.update()
    },
    // 处理图表数据
    update() {
      //获得菜品名称数组
      const dishArr = this.dishData.map(item => {
        return item.dishName
      })
      //获得销售量数组
      const saleArr = this.dishData.map(item => {
        return item.sale
      })
      const dataOption = {
        xAxis:[
          {
            data:dishArr
          }
        ],
        series:[
          {
            data:saleArr,
          }
        ]       
      }
      this.chartBar.setOption(dataOption)
    },
    // 自适应
    // screenAdapter() {
    //   const adapterOption = {}
    //   this.chartBar.setOption(adapterOption)
    //   this.chartBar.resize()
    // }
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
  
  
  



