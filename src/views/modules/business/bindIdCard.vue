<template>
 <el-form :model="cardForm" :rules="rules" ref="cardForm" label-width="80px" class="demo-ruleForm">
    <!-- 开户银行 -->
    <el-form-item label="开户银行" prop="bank" >
      <el-col :span="12">
      <el-autocomplete
        class="inline-input"
        v-model="cardForm.bank"
        :fetch-suggestions="querySearch"
        placeholder="请输入开户银行"
        :trigger-on-focus="false"
      ></el-autocomplete>
      </el-col>
    </el-form-item>
    <!-- 银行卡号 -->
    <el-form-item label="银行卡号" prop="idNumber" >
      <el-input v-model="cardForm.idNumber" style="width: 300px" type="number" placeholder="请输入银行卡号"></el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="vercode" label="验证码">
      <el-input v-model="cardForm.vercode" style="width: 300px" placeholder="请输入验证码" ></el-input>
      <el-button :disabled="disabled" @click="getVercode(phone)">{{valiBtn}}</el-button>
    </el-form-item>
    <!-- 确定和取消 -->
    <el-form-item>
      <el-button @click="resetForm('cardForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('cardForm')">确定</el-button>
    </el-form-item>
</el-form>
</template>

<script>

import axios from 'axios'
import newObj from '@/assets/bank.js'

export default {

  data() {
     // 定义验证码规则
     var validateVercode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      } else {
        if (this.cardForm.vercode.length !== 6) {
          callback(new Error('请输入6位验证码'));
        }
        callback();
      }
    };
    return {
      reset:false, //判断是否取消
      businessId: this.$store.state.merchantId,
      valiBtn:'获取验证码',
      accVercode: '',
      phone:'',
      disabled:false,
      cardForm: {
        bank: '',
        idNumber: '',
        vercode: ''
      },
      bankOptions:newObj,
      rules: {
        bank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" },
        ],
        idNumber: [
          { required: true, message: "银行卡号不能为空", trigger: "blur" },
        ],
        vercode: [
          { validator: validateVercode, trigger: "blur" },
        ]
      },
    }
  },
  
  methods:{
    querySearch(queryString, cb) {
        var banks = this.bankOptions;
        var results = queryString ? banks.filter(this.createFilter(queryString)) : banks;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
    createFilter(queryString) {
      return (bank) => {
        return (bank.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    //验证码倒数60秒
    tackBtn(){       
      let time = 60;
      let timer = setInterval(() => {
          if(time == 0 || this.reset){
              clearInterval(timer);
              this.valiBtn = '获取验证码';
              this.disabled = false;
          }else{
              this.disabled = true;
              this.valiBtn = time + '秒后重试';
              time--;
          }
      }, 1000);
    },
    //获取手机验证码
    getVercode(phone) {
      var _this = this
      this.reset = false
      axios({
        url: `http://localhost:80/api/send/${phone}`,
        method: 'get',
      }).then(function(res){
        if(res.data && res.data.code === 0){
          _this.accVercode = res.data.vercode
          _this.cardForm.vercode = rea.data.vercode
        }else {
          _this.$message({
            message: '发送验证码过于频繁，请稍后再试！',
            type: 'warning'
          });
        }
      }).catch(function(err){
        console.log(err)
      })
      this.tackBtn();   //验证码倒数60秒      
    },
    //取消重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.reset = true
      this.accVercode = ''
      this.disabled = false
    },
    //提交表单
    submitForm(formName) {
      if(this.cardForm.vercode !== this.accVercode){
        this.$message({
          message: '输入验证码错误',
          type: 'warning'
        })
      }else {
        var _this = this
        // console.log(this.cardForm.bank,this.cardForm.idNumber)
        axios({
          url: 'http://localhost:80/api/account/businessaccount/save',
          method: 'post',
          data:{
            'businessId': _this.businessId,
            'bank': _this.cardForm.bank,
            'cardNumber': _this.cardForm.idNumber
          }
        }).then(function(res){
          if(res.data && res.data.code === 0){
            _this.$message({
              message: '绑定银行卡成功',
              type: 'success',
              onClose:()=>{
                this.resetForm(formName)
              }
            })
          }
        }).catch(function(err){
          console.log(err)
        })
      }
    }
  },
  activated() {
    var _this = this
    //一进入页面获取手机号
    axios({
      url: `http://localhost:80/api/bash/business/info/${_this.businessId}`,
      method: 'get'
    }).then(function(res) {
      _this.phone = res.data.business.userTel
    }).catch(function(err){
      console.log(err)
    })
  },
}
</script>

<style>

</style>