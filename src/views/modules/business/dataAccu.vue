<template>
  <div>
    <el-alert
      title="提示:默认时间段为当前一周的数据!可根据需求修改相应时间段。"
      type="warning">
    </el-alert>
    <div class="container">
      <!-- 柱状图:菜品销售额统计图 -->
      <div class="bar">
        <dishSale></dishSale>
      </div>
      <!-- 折线图:店铺销售额统计图 -->
      <div class="business">
        <businessSale></businessSale>
      </div>
      <!-- 饼图：各分类销售额统计图 -->
      <div class="sor">
        <sortSale></sortSale>
      </div>
      <!-- 折线图：店铺访问量统计对比图 -->
      <div class="visit">
        <visit></visit>
      </div>
    </div>
    
  </div>
  
</template>

<script>
import dishSale from './dishSale.vue'
import businessSale from './businessSale.vue'
import sortSale from './sortSale.vue'
import visit from './businessVisit.vue'

export default {
  data() {
    return {
      
    }
  },
  methods:{},
  components: {
    dishSale,
    businessSale,
    sortSale,
    visit
  },

}
</script>

<style scoped>
  .container {
    display: flex;
    padding-top: 20px;
    padding-left: 10px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .container .bar {
    width: 50%;
    height: 50%;
  }
  .container .business {
    width: 50%;
    height: 50%;
  }
  .container .sor {
    width: 50%;
    height: 50%;
  }
  .container .visit {
    width: 50%;
    height: 50%;
  }

</style>