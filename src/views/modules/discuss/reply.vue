<template>
  <div class="container">
    <!--获取回复状态表单 -->
    <div class="form">
      <el-form :inline="true" :model="replyForm">
        <!-- 回复状态 -->
        <el-form-item label="回复状态" required>
          <el-select v-model="replyForm.isReply" placeholder="请选择" style="width:100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 评论时间 -->
        <el-form-item label="评论时间" required>
          <el-date-picker
            v-model="replyForm.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker> 
        </el-form-item>
        <!-- 评论分数 -->
        <el-form-item label="评论分数">
          <el-select v-model="replyForm.score" placeholder="请选择" style="width:100px;">
            <el-option
              v-for="item in scoreOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" @click="search" >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 评论收集框 -->
    <div class="collect">
      <!-- 整个评论区 -->
      <div class="comment" v-for="item in commentList" :key="item.id">
        <!-- 评论顶部区 -->
        <div class="info">
          <img src="../../../assets/img/用户头像.png" alt="" >
          <div class="name">&nbsp;{{item.name}}
            <br>
            <el-rate
              v-model="item.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </div>  
          <img src="../../../assets/img/删除.png" alt="" class="dele" @click="deleReply(item.id)">   
          <span class="time">{{item.commentTime}}</span>
      </div>
      <!-- 内容区+图片 -->
      <el-card class="box-card">
        <!-- 内容 -->
        <div style="margin-bottom:20px;margin-top: 10px;">{{item.comment}} </div>
        <!-- 图片 -->
        <div class="flex" v-if="item.imgPath!=null">
          <img v-for="(image,ind) in item.imgPath" :key="ind" :src="image" alt="" class="cardImage">
          <!-- <img  src="../../../assets/img/out.png" alt="" class="cardImage">
          <img  src="../../../assets/img/eat.png" alt="" class="cardImage"> -->
        </div>
        <!-- 按钮 -->
        <!-- item.id,item.id,item.userName,_,_ -->
        <el-button type="warning" round class="btn" v-if="item.children.length==0" @click="clickReply(item.id,item.id,item.name)">点击回复</el-button>
        <el-button type="success" round class="btn" v-else-if="item.children.length>0" @click="clickReply(_,item.children[0].id,item.name,item.children[0].comment,item.children[0].imgPath)">查看回复</el-button>
      </el-card>    
     </div>
     <reply-update v-if="replyVisible" ref="showreply" @refresh="search"></reply-update>
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
import replyUpdate from './reply-update.vue'

export default {
  data() {
    return {
      replyVisible:false,
      replyForm:{
        isReply:1, // 1未回复，0回复
        date:null,
        score:6      
      },
      // images:['../../../assets/img/eat.png','../../../assets/img/out.png'],
      options: [{
          value: 1,
          label: '未回复'
        }, {
          value: 0,
          label: '已回复'
      }],
      scoreOptions:[{
        value:1,
        label:'一星'
      }, {
        value:2,
        label:'二星'
      }, {
        value:3,
        label:'三星'
      }, {
        value:4,
        label:'四星'
      }, {
        value:5,
        label:'五星'
      }, {
        value:6,
        label:'全部'
      }],
      commentList:[], //接收所有数据
      currPage: 1, // 当前页码
      totalCount: 0, // 总条数
      totalPage: 1,  //总页数
      pageSize: 10, // 每页的数据条数
    }
  },
  components:{
    replyUpdate
  },
  created(){
    this.search()
    
    
  },
  methods:{
    // 查询
    search(){
      var _this = this
      const par = {
            'page':_this.currPage,
            'limit':_this.pageSize,
            'businessId':_this.$store.state.merchantId,
            'isReply':_this.replyForm.isReply,
            'commentTime':_this.replyForm.date,
            'score':_this.replyForm.score
          };
        console.log("par = ", par)
      if(this.replyForm.isReply != null && this.replyForm.score){
        this.$axios({
          url:'/comment/isreply',
          method:'get',
          params:{
            'page':_this.currPage,
            'limit':_this.pageSize,
            'businessId':_this.$store.state.merchantId,
            'isReply':_this.replyForm.isReply,
            'commentTime':_this.replyForm.date,
            'score':_this.replyForm.score
          }
        }).then(function(res){
          if(res.data && res.data.code === 0){   
            const tp = res.data.data
            console.log('tp',tp)
            _this.totalCount = tp.totalCount
            _this.pageSize = tp.pageSize
            _this.totalPage = tp.totalPage
            _this.currPage = tp.currPage
            _this.commentList = tp.list    
            // console.log(_this.commentList)
          }
        }).catch(function(err){
          console.log(err)
        })
        console.log(this.replyForm.isReply,this.replyForm.date,this.replyForm.score)
      }    
    },

    // 点击回复事件：弹出弹窗 
    clickReply(id,pid,userName,comment,images) {
      this.replyVisible = true
      this.$nextTick(()=>{
        this.$refs.showreply.initForm(id,pid,userName,comment,images)
      })
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currPage = 1
      this.search()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currPage = val
      this.search()    
    },
    // 过滤数组
    filterArr(arr) {
      return arr.map(item=>{
        // 将评论图片url转换成数组
        if(item.parentId==0 && item.imgPath!=null){
          console.log(item.imgPath)
          item.imgPath = item.imgPath.split(" ")
        }
        return item
      })
    },
    // 删除评论
    deleReply(id){
      var _this = this
      this.$axios({
        url:`/comment/delete/${id}`,
        method:'post'
      }).then(function(res){
        if(res.data && rea.data.code === 0){
          console.log('删除评论成功')
          _this.search()
        }
      }).catch(function(err){
        console.log(err)
      })
    }
  }


}
</script>

<style scoped>
  .collect {
    display: flex;
    flex-wrap: wrap;
    height: 500px;
    width: 100%;
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 5px;
  }
  .comment {
    padding-left: 20px;
    width: 900px;
    /* border: 1px solid blue; */
  }
  .info {
    position: relative;
    width: 800px;
    height: 70px;
    margin-top: 10px;
    border-bottom: 1px solid #bfbfbf;
   
  }
  .info img {
    position: absolute;
    width: 50px;
    height: 50px;
    top:10px;
    overflow: hidden;
    margin-right: 5px;
    left: 5px;
  }
  .info .name {
    position: absolute;
    display: inline-block;
    font-size: 14px;
    height: 40px;
    vertical-align: center;
    top:20px;
    left: 60px;
  }
  .info .dele {
    width: 30px;
    height: 30px;
    margin-left: 400px;
    margin-top: 0;
  }
  .info .dele:hover {
    cursor: pointer;
  }
  .time {
    position: relative;
    float: right;
    top:20px;
    right: 30px;
    color: #8a8a8a;
  }
  .box-card {
    width: 800px;
    border-bottom:  1px solid #bfbfbf;
  }
  .box-card .cardImage {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .box-card .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .btn {
    float: right;
    margin-bottom: 10px;
  }

  
  .block {
    float: right;
  }



</style>