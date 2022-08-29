<template>
  <div class="mod-menu">
    <!-- 新增菜品分类按钮 -->
    <el-form :inline="true" :model="dishForm">
      <el-form-item>
        <el-button type="primary" @click="addorUpdateMenu()">新增菜品分类</el-button>
      </el-form-item>
    </el-form>
    <!--菜单列表  -->
    <el-table
      :data="dataList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}">
    <el-table-column
        prop="name"
        header-align="center"
        min-width="80"
        label="名称" >
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        width="160"
        label="描述">
      </el-table-column>

      <el-table-column
        prop="image"
        header-align="center"
        align="center"
        label="菜品图片">
        <template slot-scope="scope">
           <img class="el-upload-list__item-thumbnail" :src="scope.row.image" alt="">
        </template>
      </el-table-column>

      <el-table-column
        prop="createDateTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateDateTime"
        header-align="center"
        align="center"
        width="150"
        label="最后时间">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        width="150"
        label="售价">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1" size="mini" type="success" @click="refreshStatus(scope.row.id,scope.row.status)">上架</el-button>
          <el-button v-else-if="scope.row.status === 0" size="mini" type="danger" @click="refreshStatus(scope.row.id,scope.row.status)">下架</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- 修改菜品种类 -->
          <el-button  v-if="!scope.row.categoryId"  type="text" size="small" @click="addorUpdateMenu(scope.row.id,scope.row.name,scope.row.description)">修改</el-button>
          <!-- 修改菜品 -->
          <el-button  v-if="scope.row.categoryId"  type="text" size="small" 
          @click="addOrUpdateDish(scope.row.id,scope.row.categoryId,scope.row.name,scope.row.description,scope.row.price,scope.row.image)">
          修改</el-button>
          <!-- 新增菜品 -->
          <el-button v-if="!scope.row.categoryId" type="text" size="small" 
                    @click="addOrUpdateDish(_,scope.row.id)">新增</el-button>
          <!-- 删除菜单分类 -->
          <el-button v-if="!scope.row.categoryId" type="text" size="small" @click="deleteMenu(scope.row.id)">删除</el-button>
          <!-- 删除菜品 -->
          <el-button v-if="scope.row.categoryId" type="text" size="small" @click="deleteDish(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  </el-table>

     <!-- 弹窗, 新增,修改菜品分类 -->
    <addOrUpdateMenu v-if="addMenuVisible" ref="addMenu" @refreshDataList="getDataList"></addOrUpdateMenu>
    <!-- 弹窗，新增/修改菜品 -->
    <addOrUpdateDish v-if="addDishVisible" ref="addDish" @refreshList="getDataList"></addOrUpdateDish>

  </div>
</template>

<script>

import addOrUpdateMenu from './menu-add-update'
import addOrUpdateDish from './dish-add-update'
import axios from 'axios'


export default {
  data() {
    return {
      dishForm: {},
      dataList: [],
    //   data: [
    //     {
    //         "dishList": [
    //             {
    //                 "id": 1,
    //                 "businessId": 31,
    //                 "categoryId": 1,
    //                 "name": "重庆小面",
    //                 "description": "香辣",
    //                 "createDateTime": "2022-08-20T01:37:14.000+0000",
    //                 "updateDateTime": "2022-08-20T01:37:16.000+0000",
    //                 "price": 20,
    //                 "image": null,
    //                 "status": 1,
    //                 "isDeleted": 0
    //             }
    //         ],
    //         "category": {
    //             "id": 12,
    //             "businessId": 31,
    //             "name": "1",
    //             "updateDateTime": "2022-08-19T10:49:07.000+0000",
    //             "description": "1",
    //             "createDateTime": "2022-08-19T10:49:10.000+0000",
    //             "isDeleted": 0
    //         }
    //     },
    //     {
    //         "dishList": [
    //             {
    //                 "id": 22,
    //                 "businessId": 31,
    //                 "categoryId": 2,
    //                 "name": "酸辣土豆",
    //                 "description": "香辣",
    //                 "createDateTime": "2022-08-17T05:31:50.000+0000",
    //                 "updateDateTime": "2022-08-25T05:31:52.000+0000",
    //                 "price": 10,
    //                 "image": null,
    //                 "status": 0,
    //                 "isDeleted": 0
    //             },
    //             {
    //                 "id": 23,
    //                 "businessId": 31,
    //                 "categoryId": 2,
    //                 "name": "麻辣土豆",
    //                 "description": "香辣",
    //                 "createDateTime": "2022-08-17T05:31:50.000+0000",
    //                 "updateDateTime": "2022-08-25T05:31:52.000+0000",
    //                 "price": 10,
    //                 "image": null,
    //                 "status": 1,
    //                 "isDeleted": 0
    //             }
    //         ],
    //         "category": {
    //             "id": 2,
    //             "businessId": 31,
    //             "name": "1",
    //             "updateDateTime": "2022-08-22T05:32:30.000+0000",
    //             "description": "1",
    //             "createDateTime": "2022-08-22T05:32:33.000+0000",
    //             "isDeleted": 0
    //         }
    //     }
    // ],
      addMenuVisible: false, //是否显示菜品分类弹窗,
      addDishVisible:false, //是否显示菜品弹窗
      
    }
  },
  components:{
    addOrUpdateMenu, //菜单分类新增or修改
    addOrUpdateDish //菜品新增or修改
  },

  //一进入页面触发
  activated () {
   this.getDataList()
   console.log(this.dataList)
  },
  methods:{
    //将接收的数据转换为标准格式
    myTrans(data){
      let treeData = [];
      for(let i = 0; i < data.length; ++i){
        let temp = data[i]['category'];
        temp['children'] = data[i]['dishList'];
        treeData.push(temp);
      }
      return treeData;
    },
    //新增 、修改菜品种类
    addorUpdateMenu(id,name,description) {
      this.addMenuVisible = true
      this.$nextTick(()=>{
        this.$refs.addMenu.init(id,name,description)
      })
    },
    //删除菜品种类
    deleteMenu (id) {
        this.$confirm('删除此分类将同时删除该分类下的所有商品，是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this
          axios({
            url:'http://localhost:80/api/dish/category/delete',
            method:'post',
            data:{id}
          }).then(function(res){
            if(res.data && res.data.code === 0){
             _this.$message({
               message:'删除成功',
               type:'success',
               duration:1500,
               onClose:()=>{
                 _this.getDataList()
               }
              })
            }else {
             _this.$message.error(res.data.msg)
           }
         }).catch(function(err){
           console.log(err)
          })
        })
    },
    //新增、修改菜品
    addOrUpdateDish(id,pid,name,description,price,image){
      this.addDishVisible = true
      this.$nextTick(()=>{
        this.$refs.addDish.init(id,pid,name,description,price,image)
      })
    },
    // 删除菜品
    deleteDish(id){
       this.$confirm('你确定要删除此菜品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this
          axios({
            url:'http://localhost:80/api/dish/dish/delete',
            method:'post',
            data:{id}
          }).then(function(res){
            if(res.data && res.data.code === 0){
             _this.$message({
               message:'删除成功',
               type:'success',
               duration:1500,
               onClose:()=>{
                 _this.getDataList()
               }
              })
            }else {
             _this.$message.error(res.data.msg)
           }
         }).catch(function(err){
           console.log(err)
          })
        })
    },
    //修改菜品状态
    refreshStatus(dishId,status){
      var _this = this
      axios({
        url:'http://localhost:80/api/dish/dish/update',
        method:'post',
        data:{
          'id':dishId,
          'status':status
          }
      }).then(function(res){
        if(res.data && res.data.code === 0){
          _this.getDataList()
        }
      }).catch(function(err){
        console.log(err)
      })
    },

    //获取数据列表
    getDataList() {
      
      // this.dataList = this.myTrans(this.data)
      var _this = this
      axios({
        url:'http://localhost:80/api/dish/category/list',
        method:'get',
        data:{'id':_this.$store.state.merchantId}
      }).then(function(res){
        _this.dataList = _this.myTrans(res.data.data);
      }).catch(function(err){
        console.log(err)
      })
    },

  }
}
</script>

<style>

</style>