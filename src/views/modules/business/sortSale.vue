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
  name: 'sortSale',
  data() {
    return {
      chartSort: null,
      categoryData:null,
      saleTable: {
        businessId: this.$store.state.merchantId,
        startDate: '',
        endDate: '',
        date:''
      },
    }
  },
  mounted() {
    this.initchartSort()
    this.getData()
    window.addEventListener('resize',()=>{
      this.chartSort.resize()
    })
    
  },
  activated(){
    if (this.chartSort) {
      this.chartSort.resize()
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
    initchartSort() {
      this.chartSort = echarts.init(this.$refs.sale_ref)
      const option = {
        title: {
          text: '| 各分类销售额统计图',
          left:20,
          top:20
        },
        tooltip: {
          trigger: 'item'
        },
        grid:{
          left: '3%',
          right: '4%',
          top: '80%',
          containLabel: true
        },
        legend:{
          top:'10%'
        },
        series: [
        {
          name: '分类销售额',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          
        }
      ]
       
      };
      this.chartSort.setOption(option)
    },
    // 获取数据
    getData() {
    console.log(this.saleTable.startDate,this.saleTable.endDate)
    var _this = this
    //获取服务器数据后更新数据
     axios({
      url: 'http://localhost:80/api/dish/category/data',
      method: 'get',
      params: {
        'businessId': _this.saleTable.businessId,
        'startDate': _this.saleTable.startDate,
        'endDate': _this.saleTable.endDate
      }
     }).then(function(res){
      if(res.data && res.data.code === 0) {
        _this.categoryData = res.data.categoryData
      }
     }).catch(function(err){
      console.log(err)
     })
    // _this.categoryData = [
    //     {
    //         "id": 8,
    //         "businessId": 8,
    //         "name": "奶茶",
    //         "updateDateTime": "2022-09-01T03:52:29.000+0000",
    //         "description": "奶茶分类1",
    //         "createDateTime": "2022-08-28T23:08:54.000+0000",
    //         "categoryMoney": 1450.2,
    //         "isDeleted": 0
    //     },
    //     {
    //         "id": 9,
    //         "businessId": 8,
    //         "name": "堂食",
    //         "updateDateTime": "2022-08-28T23:10:28.000+0000",
    //         "description": "堂食总类1",
    //         "createDateTime": "2022-08-28T23:10:28.000+0000",
    //         "categoryMoney": 133869.4,
    //         "isDeleted": 0
    //     }
    // ]
    this.update()
    },
    // 处理图表数据
    update() {
      //获得分类销售额数组
      const sortArr = this.categoryData.map(item => {
        return {'name':item.name,'value':item.categoryMoney}
      })
      const nameArr =this.categoryData.map((item)=>{
        return item.name
      })
      const dataOption = {
        legend:{
          data:nameArr
        },
        series:[
          {
            data:sortArr,
          }
        ]       
      }
      this.chartSort.setOption(dataOption)
    },
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
  
  
  



