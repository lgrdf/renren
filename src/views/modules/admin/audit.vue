<template>
  <div class="mod-menu">
      <el-form :inline="true" :model="searchInline" class="demo-form-inline">
        <el-form-item label="店铺名称">
            <el-input v-model="searchInline.name" ></el-input>
        </el-form-item>
        <el-form-item label="店铺地址">
            <el-input v-model="searchInline.address" ></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
            <el-checkbox
            v-model="searchInline.audit"
            :true-label="0"
            :false-label="1"
            @change="changeStatus()"
            :border="true">{{statusName}}</el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        height=500px
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="店铺id"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="店铺名称"
          width="100">
        </el-table-column>
        <el-table-column align="center" label="店铺地址" prop="detailAddress" width="250">
          <template slot-scope="scope">
            {{scope.row.address+scope.row.detailAddress}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="tel"
          label="联系电话"
          width="150">
        </el-table-column>
        <el-table-column
          prop="IdCardFront"
          label="法人身份证正面照"
          width="180"
          align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.idCardFront!=null"  class="el-upload-list__item-thumbnail" :src="scope.row.idCardFront" alt="" width="150px" height="150px">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="IdCardBack"
          label="法人身份证反面照"
          width="180">
          <template slot-scope="scope">
            <img v-if="scope.row.idCardBack!=null"  class="el-upload-list__item-thumbnail" :src="scope.row.idCardBack" alt="" width="150px" height="150px">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="licenseImage"
          label="营业执照"
          width="180">
          <template slot-scope="scope">
            <img v-if="scope.row.licenseImage!=null"  class="el-upload-list__item-thumbnail" :src="scope.row.licenseImage" alt="" width="150px" height="150px">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="audit"
          label="状态"
          width="100"
          >
         <template slot-scope="scope">
             <span v-if="scope.row.audit== 1">
                 <div class="status-icon icon1"></div>不通过
             </span>
             <span v-if="scope.row.audit== 0">
                 <div class="status-icon icon0"></div>通过
             </span>
          </template>
        </el-table-column>
        <el-table-column 
          align="center"
          label="操作">         
          <template slot-scope="scope">
            <!-- 不通过 -->
            <el-button
              v-if="scope.row.audit === 1"
              size="mini"
              style="width:70px;"
              type='danger'
              @click="onchangePass(scope.row.id,0)">未通过
            </el-button>
            <el-button
              v-else-if="scope.row.audit === 0"
              size="mini"
              style="width:70px;"
              type='success'
              @click="onchangePass(scope.row.id,1)">通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
        :current-page="currPage" 
        :page-sizes="[1,3,6,10]" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="totalCount">
      </el-pagination>
  </div>
</template>

<script>

export default {
  data() {
    return {
      statusType:'danger',
      statusName:'未通过',

      currPage: 1, // 当前页码
      totalCount: 0, // 总条数
      totalPage: 1,  //总页数
      pageSize: 10, // 每页的数据条数

      searchInline: {
        name: '',
        address: '',
        audit:1
      },
      list:[],
     }
  },
  mounted(){
    this.onSearch();
  },
  methods: {
    //改变状态时函数
    changeStatus() {
      this.searchInline.audit === 0 ?this.statusName = '已通过' : this.statusName='未通过'
    },
    auditStatus(audit) {
      if (row.audit === 0) {
        return '通过'
      } else  {
        return '未通过'
      } 
    },
    //提交查询内容，查询的数据交互
    onSearch() {
      console.log(this.searchInline);
      var _this = this
      this.$axios({
        url:'/bash/business/failPass',
        method:'get',
        params:{
          'page':_this.currPage,
          'limit':_this.pageSize,
          'audit':_this.searchInline.audit,
          'name':_this.searchInline.name,
          'address':_this.searchInline.address
        }
      }).then(function(res){
        console.log(res.data.page.list)
        if(res.data && res.data.code === 0){
          _this.list = res.data.page.list
          _this.totalCount = res.data.page.totalCount// 总条数
          _this.currPage = res.data.page.currPage// 当前页码
          _this.totalPage = res.data.page.totalPage//总页数
          _this.pageSize = res.data.page.pageSize// 每页的数据条数
        }
        console.log(res)
      }).catch(function(err){
        console.log(err)
      })
    },
    onchangePass(id,audit) {
      var _this = this
      this.$axios({
        url:'/bash/business/manualAuth',
        method:'post',
        data:{
          'id':id,
          'audit':audit
        }
      }).then(function(res){
        if(res.data && res.data.code === 0){
          _this.onSearch()
        }
      }).catch(function(err){
        console.log(err)
      })      
    },

    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currPage = val;
        this.onSearch();
    },
  }
}
</script>
