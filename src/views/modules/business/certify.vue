<template>
  <el-form :model="certifyForm" :rules="rules" ref="certifyForm" label-width="180px" class="demo-ruleForm">
    <!-- 店铺名称 -->
    <el-form-item label="店铺名称" prop="name" >
      <el-input v-model="certifyForm.name" style="width: 300px;"></el-input>
    </el-form-item>
    <!-- 所在地址 -->
    <el-form-item label="所在地址" required >
      <div class="block">
        <el-cascader
          v-model="value"
          :options="options"
          expandTrigger="hover"
          @change="handleChange"></el-cascader>
      </div>
    </el-form-item>
     
    <!-- 详细地址 -->
    <el-form-item label="具体门牌号" prop="detailAddress">
      <el-input v-model="certifyForm.detailAddress" style="width:400px" placeholder="请输入具体门牌号"></el-input>
    </el-form-item>
    <!-- 联系电话 -->
    <el-form-item label="具体联系电话" prop="tel">
      <el-input v-model="certifyForm.tel" style="width:200px"></el-input>
    </el-form-item>
    <!-- 身份证照片 -->
    <el-form-item label="法人身份证正反照片" required>
      <el-upload
        action="#"
        ref="upload"
        list-type="picture-card"   
        multiple   
        :limit="2"
        :on-exceed="exceedCard"
        :on-change="onChangeCard"
        :on-remove="handleRemoveCard"
        :file-list="idCardImageList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete"  @click="handleRemoveCard(file)">
          <i class="el-icon-delete"></i>
          </span>
          </span>
        </div>
      </el-upload>
    </el-form-item>

    <!-- 店铺营业执照 -->
     <el-form-item label="店铺营业执照" required>
      <el-upload
        action="#"
        ref="upload"
        list-type="picture-card"      
        :limit="1"
        :on-exceed="exceed"
        :on-change="onChange"
        :on-remove="handleRemove"
        :file-list="licenseImage"
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

    <!-- 确定和取消 -->
    <el-form-item>
      <el-button @click="resetForm('certifyForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('certifyForm')">确定</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import axios from "axios";
import { isPhone,isMobile } from '@/utils/validate'
import {region} from '@/assets/region'

export default {
  data() {
      // 定义电话号码规则
      var validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('电话号码不能为空'));
        } else {
          if (!(isPhone(value) || isMobile(value))) {
              callback(new Error('电话号码格式错误'))
          } else {
            callback()
          }
        }
      };   
      return {
        value: [],
        options:region,
        idCardImageList:[], //存储法人身份证正反面照片
        licenseImage:[], //店铺营业执照    
        certifyForm: {
          id:this.$store.state.merchantId, //商家对应id
          name: '', //店铺名称
          tel: '', //店铺联系电话
          address: '', //所在地址
          detailAddress: '', //详细地址
        },
        rules: {
          name: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          tel: [
          { required: true,validator: validateTel, trigger: "blur" },
          ],
          detailAddress:[
           {required: true, message: '请输入详细地址名称', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      //弹出消息提示框
       open() {
        this.$alert('信息提交成功,将在1-2个工作日返回结果', '信息提交消息提示', {
          confirmButtonText: '确定',
          callback: action => {
            console.log(`action: ${ action }`)
          }
        });
      },
      //调取腾讯地图api
      getList() {
        console.log("start")
        let address = "北京"
        axios({
          // async: false,
          // url:'https://apis.map.qq.com/ws/district/v1/search?output=jsonp&keyword='+address+'&key=LBKBZ-KERKF-E52JP-NWRGM-ENNMF-RXB25',
          url:"http://localhost:8005/api1/book/test111?id=1",
          method:'get'
          // dataType:'jsonp',
          // jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
          // jsonpCallback:"?"
        }).then(function(res){
          console.log("ok")
          console.log(res)
        }).catch(function(err){
          console.log("err")
          console.log(err)
        })
        console.log("final")
      },

      // 获取所在区县地址
      handleChange(value) {
        this.certifyForm.address = value.join(' ')
        // console.log(this.certifyForm.address)
        // this.getList()
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
       // 身份证图片移除
      handleRemoveCard(file) {
          this.idCardImageList.splice(this.idCardImageList.indexOf(file), 1);
      },

      // 身份证状态改变
      onChangeCard(file, fileList) {
          this.idCardImageList = fileList;
          if(fileList.length === 0)
          this.submitArticleData.articleImgs = [];
      },
      // 超过2张图片限制数
      exceedCard(){
          this.$message.warning("最多上传2张照片!");
      },
       // 营业执照图片移除
      handleRemove(file) {
          this.licenseImage.splice(this.licenseImage.indexOf(file), 1);
      },

      // 营业执照状态改变
      onChange(file, fileList) {
          this.licenseImage = fileList;
          if(fileList.length === 0)
            this.submitArticleData.articleImgs = [];
      },
      // 超过1图片限制数
      exceed(){
          this.$message.warning("最多上传1张照片!");
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this=this
            const fd = new FormData()
            this.idCardImageList.forEach(file=> {
              fd.append('idCardImages',file.raw)
            })
            this.licenseImage.forEach(file=>{
              fd.append('licenseImages',file.raw)
            })
            fd.append('id',this.certifyForm.id)
            fd.append('name',this.certifyForm.name)
            fd.append('tel',this.certifyForm.tel)
            fd.append('address',this.certifyForm.address)
            fd.append('detailAddress',this.certifyForm.detailAddress)
            axios({
              url:'http://localhost:80/api/bash/business/auth',
              method:'post',
              headers:{'Content-Type':'application/json'}, //设置请求头格式为json
              data:fd 
            }).then(function(res){
              if(res.data && res.data.code === 0){
                console.log('提交成功')
                _this.open()
                // _this.resetForm('certifyForm')
              }
            }).catch(function(err){
              console.log('提交失败'+err)
            })
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs.upload.clearFiles()
        this.$refs[formName].resetFields();
        this.idCardImageList = []
        this.licenseImage = []
        this.value = []
        this.certifyForm.address = ''
      },
      // 获取信息
      getData(){
        var _this = this
        axios({
          url:`http://localhost:80/api/bash/business/info/${_this.certifyForm.id}`,
          method:'get',
        }).then(function(res){
           var obj = res.data
           if(obj.business.name && obj.business.address && obj.business.detailAddress 
            && obj.business.tel){ 
               _this.certifyForm.name = obj.business.name
               _this.certifyForm.address = obj.business.address
               _this.value = obj.business.address.split(' ')
               _this.certifyForm.detailAddress = obj.business.detailAddress
               _this.certifyForm.tel = obj.business.tel
          }
         })
        }
    },
    created(){
      this.getData()
    }
  }
</script>

<style lang="scss" scoped>


</style>
  
  
 
