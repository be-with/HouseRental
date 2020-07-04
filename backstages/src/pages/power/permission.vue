<template>
  <div class="permission-box">
    <div v-if="uauthority == -2">
      <div class="search-box">
        <el-input
          placeholder="请输入要查询的姓名"
          v-model="searchword"
          class="input-with-select"
          @input="handleInput"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button slot="append" icon="el-icon-plus" @click="handleAdd">添加管理员</el-button>
      </div>
      <div class="admin-table">
        <el-table :data="adminData" stripe style="width: 100%">
          <el-table-column prop="u_name" label="姓名" width="420"></el-table-column>
          <el-table-column prop="u_tel" label="联系方式" width="500"></el-table-column>
          <el-table-column prop="password" label="密码" width="500"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="tel">
            <el-input v-model="form.tel" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证" :label-width="formLabelWidth" prop="ID">
            <el-input v-model="form.ID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
            <el-input type="password" v-model="form.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="checkpwd">
            <el-input type="password" v-model="form.checkpwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="error-page" v-else>
      <div class="error-desc">你没有权限访问该页面~</div>
      <div class="error-handle">
        <a href="/home" class="router-link-active">
          <button type="button" class="el-button el-button--primary el-button--large">
            <span>返回首页</span>
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
import { judgeID } from "../../../util/validateId";
import { mapMutations } from "vuex";
export default {
  inject: ["reload"],
  data() {
    var checkName = (rule, value, callback) => {
      var nameReg = /^([\u4e00-\u9fa5·s]{2,20}|[a-zA-Z.s]{2,20})$/g;
      if (!value) {
        callback(new Error("姓名不能为空"));
      } else if (!nameReg.test(value)) {
        callback(new Error("姓名格式不正确"));
      } else {
        callback();
      }
    };
    var checkTel = (rule, value, callback) => {
      var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/g;
      if (!value) {
        callback(new Error("联系方式不能为空"));
      } else if (!telReg.test(value)) {
        callback(new Error("联系方式格式不正确"));
      } else {
        callback();
      }
    };
    var checkID = (rule, value, callback) => {
      var msg = judgeID(value);
      if (!value) {
        callback(new Error("身份证号不能为空"));
      } else if (value !== "" && msg !== "") {
        callback(new Error(msg));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.pwd !== "") {
          this.$refs.form.validateField("checkpwd");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      uauthority: "",
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        tel: [{ validator: checkTel, trigger: "blur" }],
        ID: [{ validator: checkID, trigger: "blur" }],
        pwd: [{ validator: validatePass, trigger: "blur" }],
        checkpwd: [{ validator: validatePass2, trigger: "blur" }]
      },
      adminData: [],
      searchword: "",
      dialogFormVisible: false,
      form: {
        name: "",
        tel: "",
        ID: "",
        pwd: "",
        checkpwd: ""
      },
      formLabelWidth: "120px",
      houseNameArr: [], //普通管理员名字房子名称数组
      AdminName: "" //普通管理u_name
    };
  },
  created() {
    this.getCookie();
    this.getGeneralAdmin();
  },
  methods: {
    // 获取cookie
    getCookie: function() {
      let cookies = document.cookie.split(";");
      var obj = {};
      cookies.forEach((item, index) => {
        let temp = item.split("=");
        let prop = temp[0].trim();
        obj[prop] = temp[1];
      });
      for (let prop in obj) {
        //  console.log(prop.indexOf('uauthority'));
        if (prop.indexOf("uauthority") !== -1) {
          //  console.log(obj[prop]);
          this.uauthority = obj[prop];
          //  console.log(this.uauthority);
        }
      }
    },
    // 获取管理员
    getGeneralAdmin() {
      api.getGeneralAdminByauth().then(res => {
        // console.log(res);
        this.adminData = res.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          let u_name = this.form.name;
          let tel = this.form.tel;
          let u_ID = this.form.ID;
          let pwd = this.form.pwd;
          api
            .insertAdmin({
              u_name,
              tel,
              u_ID,
              pwd
            })
            .then(res => {
              // console.log(res)
              this.dialogFormVisible = false;
              this.reload();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSearch() {
      let searchword = this.searchword;
      if (searchword !== "") {
        api.getGAlikeGAname(searchword).then(res => {
          console.log(res);
          this.adminData = res.data.data;
        });
      } else {
        alert("搜索词不能为空");
      }
    },
    // 添加管理员
    handleAdd() {
      this.dialogFormVisible = true;
    },
    // 监听输入框input事件
    handleInput(value) {
      // console.log(value);
      let searchword = this.searchword;
      if (searchword == "") {
        // 输入框内容为空时 重新请求数据
        this.getGeneralAdmin();
      }
    },
    // 删除管理员
    handleDel(row) {
      // console.log(row);
      let u_name = row.u_name;
      this.AdminName = u_name;
      this.getHousenameByUname(u_name);
      setTimeout(() => {
        console.log(this.houseNameArr);
        if (this.houseNameArr.length == 0) {
          // 没有房子 直接删除
          this.$confirm("此操作将永久删除该行信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(_ => {
              // 调用删除接口  -> 根据id和房子名字删除
              api
                .delGAdmin({
                  u_name
                })
                .then(res => {
                  console.log(res);
                  // window.location.reload();
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.reload();
                });
            })
            .catch(_ => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          this.$confirm("该管理员名下有房源，请先进行业务调整?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(_ => {
              console.log("有房子");
              // 管理员名下有房源
              // 1.u_name存到store  2.route->业务调整 3. 业务调整 searchword -> store里的u_name
              this.$router.push({name:'adjust'});
              this.setAdminName(u_name);
              this.setCookie(u_name,7);
              // window.location.reload();
            })
            .catch(_ => {
              // console.log(1);
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      }, 500);
      // console.log(houseNameArr)
    },
    //查询普通管理员名下有没有房源
    getHousenameByUname(u_name) {
      api.getHousenameByUname(u_name).then(res => {
        // console.log(res);
        this.houseNameArr = res.data.data;
      });
    },
    ...mapMutations(["setAdminName"]),
    // 设置cookie
    setCookie(adminName,existDay) {
      var date = new Date();
      date.setTime(date.getTime() + existDay * 24 * 60 * 60 * 1000);
      var expires = "expires=" + date.toUTCString();
      //console.info(cname + "=" + cvalue + "; " + expires);
      document.cookie = "adminName=" + adminName + "; " + expires;
      console.info(document.cookie);
    },
  }
};
</script>

<style lang="scss" scoped>
.permission-box {
  .search-box {
    .input-with-select {
      width: 450px;
    }
    .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
  .admin-table {
    margin-top: 20px;
  }
  .error-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin-top: 30px;
    .error-desc {
      font-size: 30px;
      color: #777;
      text-align: center;
      margin-top: 10px;
    }
    .error-handle {
      margin: 15px auto;
      width: 6%;
    }
  }
}
</style>