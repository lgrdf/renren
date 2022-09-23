<template>
  <el-dialog
    :title="`回复${userName}`"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="200">
    <el-form :model="replyForm" :rules="dataRule" ref="replyForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!-- 回复内容 -->
      <el-form-item  label="回复内容" prop="comment">
       <el-input 
        type="textarea" 
        v-model="replyForm.comment"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="最多输入200字"
        style="width:400px;"></el-input>
      </el-form-item>
      <!-- 添加图片 -->
      <el-form-item label="添加图片" >
        <multiUpload ref="multi" @inputvalue="handleImage"></multiUpload>
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
  </el-dialog>
  
</template>

<script>

import multiUpload  from '../../../components/upload/multiUpload.vue'

export default {
  name: 'replyUpdate',
  data() {
    return {
      userName:'',
      visible:false,
      testList: [],
      replyForm:{
        id:0, //1为评论回复，0为查看修改      businessId:this.$store.state.merchantId,
        comment:'',
        images:[],
        parentId:0,

      },
      dataRule:{
        comment: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 1, max: 200, message: '最多输入200字', trigger: 'blur' }
        ]
      },

    }
  },
  components:{
    multiUpload
  },
  methods:{
    initForm(id,pid,userName,comment,images){
      this.replyForm.parentId = pid
      this.replyForm.id = id || 0 //判断回复or修改
      this.visible = true
      if(!this.replyForm.id){
        this.$refs['replyForm'].resetFields()
        this.replyForm.images = ''
      }else {
        this.userName = userName
        this.replyForm.comment = comment    
        this.replyForm.images = images
      }
      console.log(this.replyForm.parentId, this.userName, this.replyForm.comment,this.replyForm.images)
      this.$refs.multi.init(this.replyForm.images)
    },
    // 修改回复评论
    dataFormSubmit() {
      console.log("testList = ", this.testList)
      var _this = this
      this.$refs['replyForm'].validate((valid) => {
        if(valid){
          this.$axios({
            url:'/comment/update',
            method:'post',
            data:{
              'id':_this.replyForm.parentId,
              'isReply':0,
              'comment':_this.replyForm.comment,
              'imgPath':_this.replyForm.images
            }
          }).then(function(res){
            if(res.data && res.data.code===0){
              console.log('修改成功')
              _this.$message({
                message:'发表评论成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  _this.visible = false
                  _this.$emit('refresh')
                  _this.replyForm.images = ''
                }
              })      
            }
          }).catch(function(err){
            console.log(err)
          })


        }
      })
      
    },
    // 将图片数组转换为字符串
    handleImage(urlArr){
      console.log('+++')
      console.log(urlArr)
      this.images = urlArr.join(' ')
    }

  },
}
</script>

<style>

</style>