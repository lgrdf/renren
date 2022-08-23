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
import { getUUID } from "@/utils";
import axios from "axios";
import { isPhone,isMobile } from '@/utils/validate'
import city from '@/assets/city_data.json'

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
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
        idCardImageList:[], //存储法人身份证正反面照片
        licenseImage:[], //店铺营业执照    
        certifyForm: {
          id:'', //商家对应id
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
      // 获取所在区县地址
      handleChange(value) {
        this.certifyForm.address = value.join(' ')
        // console.log(this.certifyForm.address)
      },
      // 获取id
      getId() {
        this.certifyForm.id = getUUID()
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
            this.getId()
            const fd = new FormData()
            this.idCardImageList.forEach(file=> {
              fd.append('idCardImage',file.raw)
            })
            this.licenseImage.forEach(file=>{
              fd.append('licenseImage',file.raw)
            })
            fd.append('id',this.certifyForm.id)
            fd.append('name',this.certifyForm.name)
            fd.append('tel',this.certifyForm.tel)
            fd.append('address',this.certifyForm.address)
            fd.append('detailAdress',this.certifyForm.detailAddress)
            axios({
              url:'/api/bash/business/auth',
              method:'post',
              headers:{'Content-Type':'application/json'}, //设置请求头格式为json
              data:fd 
            }).then(function(res){
              if(res.data && res.data.code === 0){
                console.log('提交成功')
                this.resetForm('certifyForm')
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
        this.certifyForm.id = ''
        this.value = []
        this.certifyForm.address = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .address {
    display: flex;
    justify-content: flex-start;
    justify-items: center; 
    .item {
      margin-left: 5px;
    }  
  }

</style>
  
  
 
