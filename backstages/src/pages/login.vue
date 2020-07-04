<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input
          name="password"
          v-model="loginForm.password"
          :type="pwdType"
          autocomplete="on"
          placeholder="密码"
        ></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          :loading="loading"
          @click="submitForm('loginForm')"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import api from "@/api/index.js";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 5) {
          callback(new Error("密码不能小于5位"));
        } else {
          callback();
        }
      }
    };
    var validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        password: [{ validator: validatePassword, trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }]
      },
      pwdType: "password",
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api
            .login({
              loginForm: this.loginForm
            })
            .then(res => {
              // console.log(res);
              if (res) {
                let msg = res.data.msg;
              if (msg == "success") {
                alert("登录成功");
                let id = res.data.data.id;
                let uname = res.data.data.u_name;
                let uauthority = res.data.data.u_authority;
                let urealname = res.data.data.u_realname;
                // state
                this.setUserName(uname);

                // set cookie
                this.setCookie(uname, uauthority, id, urealname, 7);
                // 跳转
                this.$router.push({ name: "index" });
              } else {
                alert(msg);
              }
              }else{
                alert("该用户不存在");
              }
              
            });
        } else {
          alert(msg);
          console.log("error submit!!");
          return false;
        }
      });
      // console.log(this.loginForm);
    },
    // 设置cookie
    setCookie(uname, authority, id, urealname, existDay) {
      var date = new Date();
      date.setTime(date.getTime() + existDay * 24 * 60 * 60 * 1000);
      var expires = "expires=" + date.toUTCString();
      //console.info(cname + "=" + cvalue + "; " + expires);
      document.cookie = "uname=" + uname + "; " + expires;
      document.cookie = "uauthority=" + authority + "; " + expires;
      document.cookie = "uid=" + id + "; " + expires;
      document.cookie = "urealname=" + urealname + "; " + expires;
      // console.info(document.cookie);
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    ...mapMutations(["setUserName"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 87%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .fontcontainer {
    color: #889aa4;
    padding-left: 10px;
  }
}
</style>