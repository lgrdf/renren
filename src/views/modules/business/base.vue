<template>
  <el-form :model="baseForm" :rules="rules" ref="baseForm" label-width="110px" class="demo-ruleForm">
  <!-- 店铺LOGO -->
    <el-form-item label="店铺LOGO" required >
     <el-upload
        action="#"
        ref="upload"
        list-type="picture-card"      
        :limit="1"
        :on-exceed="exceed"
        :on-change="onChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete"  @click="handleRemove(file)">
          <i class="el-icon-delete"></i>
          </span>
          </span>
        </div>
      </el-upload>
    </el-form-item>

    <!-- 营业时间 -->
    <el-form-item label="营业时间" required>
      <el-time-picker
        is-range
        v-model="baseForm.date"
        type="datetimerange"
        value-format="HH:mm:ss"
        range-separator="————"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        @change="dateFormat">
      </el-time-picker>
    </el-form-item>

    <!-- 店铺描述 -->
    <el-form-item label="店铺描述" prop="description">
      <el-input 
      type="textarea" 
      v-model="baseForm.description"
      placeholder="请输入内容"
      :autosize="{minRows:2,maxRows:4}"
      style="width:400px"></el-input>
    </el-form-item>
    <!-- 店铺起送价 -->
    <el-form-item label="店铺起送价" prop="startPrice" >
      <el-input v-model="baseForm.startPrice" style="width:200px" type="number"></el-input>
    </el-form-item>
    <!-- 店铺起送价 -->
    <el-form-item label="店铺配送价" prop="shoppingPrice" >
      <el-input v-model="baseForm.shoppingPrice" style="width:200px" type="number"></el-input>
    </el-form-item>
    <!-- 确定和取消 -->
    <el-form-item>
      <el-button @click="resetForm('baseForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('baseForm')">确定</el-button>
    </el-form-item>
</el-form>

</template>

<script>
import axios from "axios";


export default {
  data() {
      return {  
        fileList:[],
        baseForm: {
          id:this.$store.state.merchantId,
          startTime:'',
          endTime:'',
          date:'',
          description:'',
          startPrice:'',
          shoppingPrice:'',
        },
        rules: {
          startPrice: [
            { required: true, message: '请输入起送价格', trigger: 'blur' },
          ],
          shoppingPrice: [
            { required: true, message: '请输入配送价格', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请填写店铺描述', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      //弹出消息提示框
       open() {
        this.$alert('信息修改成功', '信息修改消息提示', {
          confirmButtonText: '确定',
          callback: action => {
            console.log(`action: ${ action }`)
          }
        });
      },
      // 图片移除
      handleRemove(file) {
          this.fileList.splice(this.fileList.indexOf(file), 1);
      },

      // 图片状态改变
      onChange(file, fileList) {
          this.fileList = fileList;
          if(fileList.length === 0)
            this.submitArticleData.articleImgs = [];
      },
      // 超过图片限制数
      exceed(){
          this.$message.warning("最多上传1张照片!");
      },
      // 获取时间
      dateFormat(picker) {
        this.baseForm.startTime = picker[0]
        this.baseForm.endTime = picker[1]
      },
      // 预览图片
      handlePreview(file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },   

      // 限制要求函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!(isJPG || isPNG)) {
            this.$message.error('上传头像图片只能是JPG/PNG格式!');
        }
        if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return true;
      },
      // 提交表单数据
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            var _this = this
            const formData = new FormData();
            this.fileList.forEach(file=>{
              formData.append('logoImages',file.raw)
            })
            formData.append('id',this.baseForm.id)
            formData.append('startTime',this.baseForm.startTime)
            formData.append('endTime',this.baseForm.endTime)
            formData.append('description',this.baseForm.description)
            formData.append('startPrice',this.baseForm.startPrice)
            formData.append('shippingPrice',this.baseForm.shoppingPrice)
            axios({
                method: "post",
                url:"/bash/business/edit",
                headers:{'Content-Type':'application/json'}, //设置请求头格式为json
                data: formData
            }).then(function (resp){
              if(resp.data && resp.data.code ===0){
                console.log("resp = ", resp)
                _this.open()
                // _this.resetForm('baseForm')    
              }       
            }).catch(function(error){
              console.log(error)
            })
        }
        })
      },
     
      // 提交后重置数据
      resetForm(formName) {
        this.$refs.upload.clearFiles()
        this.$refs[formName].resetFields();
        this.fileList = []
        this.baseForm.date = []
        this.baseForm.startTime = ''
        this.baseForm.endTime = ''
      },
      // 获取信息
      getData(){
        var _this = this
        axios({
          url:`http://localhost:80/api/bash/business/info/${_this.baseForm.id}`,
          method:'get',
        }).then(function(res){
           var obj = res.data
           if(obj.business.startTime && obj.business.endTime && obj.business.description 
            && obj.business.startPrice && obj.business.shippingPrice){ 
               _this.baseForm.startTime = obj.business.startTime
               _this.baseForm.endTime = obj.business.endTime
               _this.baseForm.date = [obj.business.startTime,obj.business.endTime]
               _this.baseForm.description = obj.business.description 
               _this.baseForm.startPrice = obj.business.startPrice
               _this.baseForm.shoppingPrice = obj.business.shippingPrice
          }
         })
        }
    },
    created(){
     this.getData()
    }
  }
</script>

<style scoped>
  
</style>