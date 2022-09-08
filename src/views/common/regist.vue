<template>
<div>
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
      <h3 class="regist_header">欢迎入驻筷先锋外卖平台</h3>

      <div class="regist_box" style="width: 550px">
        <!-- 返回标 -->
        <div class="img" @click="backLogin">
          <img src="../../assets/img/back.png" alt="" style="width:30px;height:30px">
        </div>
        <!-- 步骤条 -->
        <div class="progress-container">
          <div class="progress" id="progress"></div>
          <div class="circle active">1</div>
          <div class="circle">2</div>
          <div class="circle">3</div>
        </div> 
        <!-- 第一页  -->
        <el-form v-if="currentActive===1"  :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
          <el-form-item label="用户名" prop="userName">
                <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-form>
        <!-- 第二页 -->
        <el-form v-if="currentActive===2"  :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <!-- 邮箱验证码 -->
          <el-form-item prop="emailVercode" label="邮箱验证码">
            <el-input v-model="dataForm.emailVercode" style="width: 220px" placeholder="请输入邮箱验证码" ></el-input>
            <el-button :disabled="edisabled" @click="getEmailVercode(dataForm.email)">{{emainbtn}}</el-button>
          </el-form-item>
        </el-form>
        <!-- 第三页 -->
        <el-form v-if="currentActive===3"  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <!-- 手机验证码 -->
          <el-form-item prop="telVercode" label="手机验证码">
            <el-input v-model="dataForm.telVercode" style="width: 220px" placeholder="请输入手机验证码" ></el-input>
            <el-button :disabled="tdisabled" @click="getTelVercode(dataForm.mobile)">{{valiBtn}}</el-button>
          </el-form-item>
        </el-form>

        <span class="regist_footer">
          <el-button @click="preClick" class="btn" id="prev" :disabled="prevdisabled">上一步</el-button>
          <el-button @click="nextClick" class="btn" id="next" :disabled="nextdisabled" v-if="!visible">下一步</el-button>
          <el-button @click="dataFormSubmit()" class="btn"  v-if="visible">  确定  </el-button>
        </span>

      </div>
  </div>   
</div>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
 
  export default {
    data () {
      // 定义邮箱验证码规则
     var validateemailVercode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      } else {
        if (this.dataForm.emailVercode.length !== 6) {
          callback(new Error('请输入6位验证码'));
        }else if(this.dataForm.emailVercode !== this.accuEmailcode){
          callback(new Error('验证码输入错误'));
        }
        callback();
      }
      };
      // 定义手机验证码规则
     var validateVercode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      } else {
        if (this.dataForm.telVercode.length !== 6) {
          callback(new Error('请输入6位验证码'));
        }else if(this.dataForm.telVercode !== this.accTelcode){
          callback(new Error('验证码输入错误'));
        }
        callback();
      }
      };
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
        visible: false,
        roleList: [],
        emainbtn:'获取验证码',
        valiBtn:'获取验证码',
        edisabled:false,
        tdisabled:false,
        currentActive: 1, //判断进度条
        prevdisabled:true,
        nextdisabled:false,
        accuEmailcode:'',
        accTelcode:'',
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          emailVercode:'',
          mobile: '',
          telVercode:'',
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
          ],
          emailVercode: [
          { validator: validateemailVercode, trigger: "blur" },
          ],
          telVercode: [
          { validator: validateVercode, trigger: "blur" },
          ]

        }
      }
    },

    methods: {
      //验证码倒数60秒
      tackBtn(){       
        let time = 60;
        let timer = setInterval(() => {
            if(time == 0){
                clearInterval(timer);
                this.valiBtn = '获取验证码';
                this.tdisabled = false;
            }else{
                this.tdisabled = true;
                this.valiBtn = time + '秒后重试';
                time--;
            }
        }, 1000);
      },
      //验证码倒数120秒
      tackBtn2(){       
        let time = 120;
        let timer = setInterval(() => {
            if(time == 0){
                clearInterval(timer);
                this.emainbtn = '获取验证码';
                this.edisabled = false;
            }else{
                this.edisabled = true;
                this.emainbtn = time + '秒后重试';
                time--;
            }
        }, 1000);
      },
      //获取邮箱验证码
      getEmailVercode(email) {
        var _this = this
        this.$axios({
          url: `/bash/business/sendEmail/${email}`,
          method: 'get',
        }).then(function(res){
          if(res.data && res.data.code === 0){
            _this.accuEmailcode = res.data.emailCode
            _this.dataForm.emailCode = rea.data.emailCode
          }else {
            _this.$message({
              message: '发送验证码过于频繁，请稍后再试！',
              type: 'warning'
            });
          }
        }).catch(function(err){
          console.log(err)
        })
        this.tackBtn2();   //验证码倒数120秒  
      },
      //获取手机验证码
      getTelVercode(mobile) {
        var _this = this
        this.$axios({
          url: `/send/${mobile}`,
          method: 'get',
        }).then(function(res){
          if(res.data && res.data.code === 0){
            _this.accTelcode = res.data.vercode
            _this.dataForm.telVercode = rea.data.vercode
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/save'),
              method: 'post',
              data: this.$http.adornData({
                'roleIdList': this.dataForm.roleIdList,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status
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
      },
      //下一步事件触发
      nextClick() {
        this.currentActive++
        if(this.currentActive > 3) {
            this.currentActive = 3
        }
        this.update()
      },
      //上一步事件触发
      preClick() {
        this.currentActive--
        if(this.currentActive < 1) {
            this.currentActive = 1
        }
        this.update()
      },
      //更新进度条
      update() {
        const progress = document.getElementById('progress')
        const circles = document.querySelectorAll('.circle')
        circles.forEach((circle, idx) => {
            if(idx < this.currentActive) {
                circle.classList.add('active')
            } else {
                circle.classList.remove('active')
            }
        })
        const actives = document.querySelectorAll('.active')
        progress.style.width = (actives.length - 1) / (circles.length - 1) * 100 + '%'
        if(this.currentActive === 1) {
            this.prevdisabled = true
            this.visible = false
        } else if(this.currentActive === circles.length) {
            this.nextdisabled = true
            this.visible = true
        } else {
            this.prevdisabled = false
            this.nextdisabled = false
            this.visible = false
        }
      }
    }
  }
</script>

<style scoped>
  .regist_box {
    width: 450px;
    height: 450px;
    background-color: #fff;
    border: 1px solid #3498db;
    border-radius: 18px;
    padding: 30px 50px 30px 30px;
  
  }

  .regist_footer {
    bottom: 100px;
    position: absolute;
    left: 30%;
  }
  .img {
    float: left;
    width: 40px;
    height: 40px;
  }
  .img:hover {
    transform: scale(1.5,1.5);
    cursor: pointer;
  }
  .regist_header{
    color: orange;
    text-align: center;
  }
  .progress-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 30px;
    max-width: 100%;
    width: 350px;
    margin:20px auto;
  }

.progress-container::before {
  content: '';
  background-color: #e0e0e0;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  z-index: 0;
}

.progress {
  background-color: #3498db;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 0%;
  z-index: 0;
  transition: 0.4s ease;
}

.circle {
  background-color: #fff;
  color: #999;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e0e0e0;
  z-index: 1;
  transition: 0.4s ease;
}

.circle.active {
  border-color: #3498db;
}
.btn {
  background-color:#4a9cd7;
  color: #fff;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  padding: 8px 30px;
  margin: 10px;
  font-size: 14px;
}
.btn:active {
  transform: scale(0.98);
}
.btn:focus {
  outline: 0;
}



</style>