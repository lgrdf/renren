<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
          <div class="login_box" style="width: 550px">
            <p class="login_title">
              <span
                :class="isActiveIndex === 0 ? 'isActiveTitle' : ''"
                @click="accountLogin"
                >账号登录</span
              ><!-- 利用三元运算符判定点击了哪个登录,从而绑定样式 -->
              <span
                :class="isActiveIndex === 1 ? 'isActiveTitle' : ''"
                @click="smsLogin"
                >短信登录
              </span>
            </p>
            <el-form v-if="isActive" :model="dataForm" ref="dataForm" label-width="80px" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"  status-icon>
              <el-form-item prop="userName" label="账号：">
                <el-input v-model="dataForm.userName" placeholder="请输入账号" ></el-input>
                <!-- dataForm.userName -->
              </el-form-item>
              <el-form-item prop="password" label="密码：">
                <el-input v-model="dataForm['password']" placeholder="请输入密码" type="password" ></el-input>
              </el-form-item>
              <el-form-item  prop="captcha" label="验证码：">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha" style="width: 160px">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
              <el-button class="login_btn" type="primary" @click="dataFormSubmit()">立 即 登 录</el-button>
              <p style="text-align: right; margin-top: 10px;cursor: pointer"> <a>忘记密码？</a> </p>
              <p style="text-align: center; margin-top: 40px"> 
              第三方登录或
              <router-link style="cursor;" :to="{
                name:'regist'
              }">立即注册</router-link> 
              </p>
            </el-form>
            <el-form v-else ref="loginForm" :model="loginForm" label-width="80px" :rules="dataRule">
              <el-form-item prop="phone" label="手机号：">
                <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item prop="vercode" label="验证码：">
                <el-input v-model="loginForm.vercode" style="width: 60%" placeholder="请输入验证码" ></el-input>
                <el-button :disabled="disabled" @click="getVercode(loginForm.phone)">{{valiBtn}}</el-button>
              </el-form-item>
              <el-button class="login_btn" type="primary" @click="smsFormSubmit()">立 即 登 录</el-button>
              <p style="text-align: right; margin-top: 10px;cursor: pointer;"> <a>忘记密码？</a> </p>
              <p style="text-align: center; margin-top: 40px"> 
              第三方登录或
              <router-link style="cursor;" :to="{
                name:'regist'
              }">立即注册</router-link> 
              </p>
            </el-form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import { isMobile } from '@/utils/validate'
export default {
  data() {
    // 定义手机号规则
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    };
    // 定义验证码规则
    var validateVercode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      } else {
        if (this.loginForm.vercode.length !== 6) {
          callback(new Error('请输入6位验证码'));
        }
        callback();
      }
    };
    return {
      isActive: true, // 用于实现切换登录，作为判断
      isActiveIndex: 0,
      disabled : false,
      tempVercode:"123456",// 默认短信验证码
      valiBtn:'获取验证码',
      loginForm:{
        phone:"",
        vercode:"",
        uuid: "",
      },


      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: "",
      },


      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
        phone: [
          { validator: validatePhone, trigger: "blur" },
        ],
        vercode: [
          { validator: validateVercode, trigger: "blur" },
        ]
      },
      captchaPath: "",
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    tackBtn(){       //验证码倒数60秒
          let time = 60;
          let timer = setInterval(() => {
              if(time == 0){
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
    // 手机验证码登录
    smsFormSubmit() {
        if (this.tempVercode===this.loginForm.vercode) {
          this.$http({
            url: this.$http.adornUrl("/sys/login"),
            method: "post",
            data: this.$http.adornData({
              username: this.loginForm.phone,
              uuid: this.loginForm.uuid,
              choice: 2
            }),
          }).then(({ data }) => {
            console.log(data);
            if (data && data.code === 0) {
              this.$store.commit('saveId',data.id)
              this.$cookie.set("token", data.token);
              this.$router.replace({ name: "home" });
            } else {
              this.$message.error(data.msg);
            }
          });
        }else {
          this.$message({
               message: '手机号或验证码错误！',
                type: 'warning'
               });
        };
    },
    // 获取手机验证码
    getVercode(phone){
      this.loginForm.uuid = getUUID();
      // this.$http({
      //       url: this.$http.adornUrl(`/send/${phone}`),
      //       method: "get",
      //     }).then(({ data }) => {
      //       console.log(data);
      //       if (data && data.code === 0 && data.msg==='success' && this.tempVercode!=data.vercode) {
      //         this.tempVercode=data.vercode;
      //       } else {
      //         this.$message({
      //          message: '发送验证码过于频繁，请稍后再试！',
      //           type: 'warning'
      //          });
      //       }
      //     });
      this.tackBtn();   //验证码倒数60秒
    },
    accountLogin() {
      // 账号登录
      this.getCaptcha();
      this.isActive = true;
      this.isActiveIndex = 0;
    },
    smsLogin() {
      // 短信登录
      this.isActive = false;
      this.isActiveIndex = 1;
    },
    // 提交表单(账号密码登录)
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/login"),
            method: "post",
            data: this.$http.adornData({
              username: this.dataForm.userName,
              password: this.dataForm.password,
              uuid: this.dataForm.uuid,
              captcha: this.dataForm.captcha,
              choice: 1
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$store.commit('saveId',data.id)
              this.$cookie.set("token", data.token);
              this.$router.replace({ name: "home" });
              sessionStorage.setItem("ewuhrfuewtgfuyieguiewfghwqhifq",this.dataForm.userName);
              sessionStorage.setItem("wefbuwegfweuygfyewutfuweuiweiufguewui",this.dataForm.password)
            } else {
              this.getCaptcha();
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      );
    },
  },

  mounted(){
    let name = sessionStorage.getItem("ewuhrfuewtgfuyieguiewfghwqhifq");
    let psw = sessionStorage.getItem("wefbuwegfweuygfyewutfuweuiweiufguewui")
    if(name && psw){
      this.dataForm.userName = name;
      this.dataForm.password = psw;
      // sessionStorage.clear();
    } 
  },
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 16px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
}
.login_box {
  width: 450px;
  height: 490px;
  background-color: #fff;
  border-radius: 18px;
  padding: 30px 50px 30px 30px;
}
.login_title {
  text-align: center;
  margin: 30px 30px 40px 30px;
  font-size: 24px;
  color: #666;
}
.login_title span {
  margin: 0 20px 0 20px;
  cursor: pointer;
}
.login_title span:hover {
  color: #333;
  font-weight: bolder;
}
.isActiveTitle {
  color: #333;
  font-weight: bolder;
}
.login_agree {
  margin-left: 30px;
}
.login_btn {
  width: 100%;
  height: 50px;
  margin: 0 0 0 10px;
  background-color: #0cb95f;
  color: #fff;
}
</style>
