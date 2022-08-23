<template>
<div>
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
      <h3 class="regist_header">欢迎入驻xxx外卖平台</h3>
      <div class="regist_box" style="width: 550px">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
          <el-form-item label="用户名" prop="userName">
                <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
          </el-form-item>
        </el-form>
        <span class="regist_footer">
          <el-button @click="backLogin">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
      </div>
  </div>   
</div>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        // visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      // 表单提交
      dataFormSubmit () {

        this.$bus.$emit('autoLogin',this.dataForm.userName,this.dataForm.password)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/save'),
              method: 'post',
              data: this.$http.adornData({
                // 'userId': null,
                'roleIdList': this.dataForm.roleIdList,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': 1
              })
            }).then(({data}) => {
              console.log("data = ", data)
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    sessionStorage.setItem("ewuhrfuewtgfuyieguiewfghwqhifq", this.dataForm.userName);
                    sessionStorage.setItem("wefbuwegfweuygfyewutfuweuiweiufguewui", this.dataForm.password)
                    this.$router.push({
                        name:'login'
                    })
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })

          }
        })
      },

      // 返回到login
      backLogin(){
        this.$router.push({name:'login'})
      }
    }
  }
</script>

<style scoped>
  .regist_box {
    width: 450px;
    height: 450px;
    background-color: #fff;
    border: 1px solid black;
    border-radius: 18px;
    padding: 30px 50px 30px 30px;
  }

  .regist_footer {
    float: right;
  }
  .regist_header{
    color: orange;
    text-align: center;
  }

</style>