<template>
  <div class="house-resource">
    <div class="search-box">
      <el-input placeholder="请输入内容" v-model="searchword" class="input-with-select" @input="handleInput">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option v-for="(item,index) in optionList" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>
    <div class="table-box">
      <el-table
        :data="houseList"
        height="640"
        style="width: 100%;"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="center" inline class="demo-table-expand">
              <el-form-item label="房子名称">
                <span>{{ props.row.title }}</span>
              </el-form-item>
              <el-form-item label="城市">
                <span>{{ props.row.city }}</span>
              </el-form-item>
              <el-form-item label="房屋类型">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="出租类型">
                <span>{{ props.row.rtype }}</span>
              </el-form-item>
              <el-form-item label="出租起始日" v-if="props.row.rtype === '短租'">
                <span>{{ props.row.start_date }}</span>
              </el-form-item>
              <el-form-item label="出租终止日" v-if="props.row.rtype === '短租'">
                <span>{{ props.row.end_date }}</span>
              </el-form-item>
              <el-form-item label="业主">
                <span>{{ props.row.crealname }}</span>
              </el-form-item>
              <el-form-item label="业主电话">
                <span>{{ props.row.tel }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="管理员">
                <span>{{ props.row.general_admin }}</span>
              </el-form-item>
              <el-form-item label="租客">
                <span
                  v-for="(item,index) in orderList"
                  :key="index"
                >{{item.person_name + item.tel_number + '&nbsp;&nbsp;&nbsp;' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="房子 ID" prop="id" width="300"></el-table-column>
        <el-table-column label="房子名称" prop="title"></el-table-column>
        <el-table-column label="业主姓名" prop="crealname"></el-table-column>
        <el-table-column label="管理员" prop="general_admin"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
            <el-button
              v-if="uauthority == '2'"
              @click="handleEdit(scope.row)"
              type="text"
              size="small"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="房源可修改信息" :visible.sync="dialogFormVisible">
        <el-form
          :model="houseForm"
          status-icon
          :rules="rules"
          ref="houseForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="房子名称" prop="title">
            <el-input v-model="houseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="房屋类型" prop="type">
            <el-input v-model="houseForm.type"></el-input>
          </el-form-item>
          <el-form-item label="出租类型" prop="rtype">
            <el-input v-model="houseForm.rtype"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="houseForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmForm('houseForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
export default {
  inject: ["reload"],
  data() {
    var validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("房子名字不能为空"));
      } else {
        if (value !== "" && value.length > 30) {
          callback(new Error("房子名字长度不能超过30"));
        } else {
          callback();
        }
      }
    };
    var validateType = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房屋类型"));
      } else {
        if (value !== "" && value !== "三室两厅" && value !== "一室一厅") {
          callback(new Error("房子类型只能是三室两厅或者一室一厅"));
        } else {
          callback();
        }
      }
    };
    var validateRType = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房屋租住类型"));
      } else {
        if (value !== "" && value !== "短租" && value !== "日租") {
          callback(new Error("房子租住类型只能是短租或者日租"));
        } else {
          callback();
        }
      }
    };
    var checkTel = (rule, value, callback) => {
      let telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/g;
      if (value === "") {
        callback(new Error("请输入联系方式"));
      } else {
        let telFlag = value.match(telReg);
        if (value !== "" && !telFlag) {
          callback(new Error("联系方式格式错误"));
        } else {
          callback();
        }
      }
    };
    return {
      optionList: [
        "城市",
        "房屋类型",
        "出租类型",
        "业主",
        "业主电话",
        "管理员"
      ],
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      searchword: "",
      select: "",
      houseList: [],
      orderList: [],
      dialogFormVisible: false,
      houseForm: {
        title: "",
        type: "",
        rtype: "",
        tel: "",
        id: ""
      },
      formLabelWidth: "120px",
      rules: {
        title: [{ validator: validateTitle, trigger: "blur" }],
        type: [{ validator: validateType, trigger: "blur" }],
        rtype: [{ validator: validateRType, trigger: "blur" }],
        tel: [{ validator: checkTel, trigger: "blur" }]
      },
      uauthority: "",
      uid: "",
      uname: ""
    };
  },
  created() {
    this.getCookie();
    if (this.uauthority == 2) {
      api.getHouseByCid(this.uid).then(res => {
        this.optionList = ["城市", "房屋类型", "出租类型", "管理员"];
        this.houseList = res.data.data;
      });
    } else if (this.uauthority == -1) {
      // 普通管理员
      this.optionList = ["城市", "房屋类型", "出租类型", "业主", "业主电话"];
      api.getHouseInfoByGAdmin(this.uname).then(res => {
        this.houseList = res.data.data;
      });
    } else {
      this.getHouseData();
    }
  },
  methods: {
    getHouseData() {
      api.getHouse().then(res => {
        // console.log(res);
        this.houseList = res.data.data;
      });
    },
    handleSearch() {
      let select = this.select;
      let searchword = this.searchword;
      let uauthority = this.uauthority;
      let uid = this.uid;
      let uname = this.uname;
      if (uauthority == 2) {
        // 登录角色是业主
        if (select === "") {
          alert("请先选择要搜索的类型");
        } else if (select === 0 && searchword !== "") {
          // 按城市搜索
          api.getHouseByCityCid(searchword, uid).then(res => {
            this.houseList = res.data.data;
            // console.log(this.houseList);
          });
        } else if (select === 1 && searchword !== "") {
          // 按房子类型搜索
          api.getHouseByTypeCid(searchword, uid).then(res => {
            this.houseList = res.data.data;
            // console.log(res);
          });
        } else if (select === 2 && searchword !== "") {
          // 按房子出租类型搜索
          api.getHouseByRTypeCid(searchword, uid).then(res => {
            this.houseList = res.data.data;
          });
        } else if (select === 3 && searchword !== "") {
          // 按房子管理员搜索
          api.getHouseByGAdminCid(searchword, uid).then(res => {
            // console.log(res);
            this.houseList = res.data.data;
          });
        }
      } else if (this.uauthority == -1) {
        // 登录角色是普通管理员
        if (select === "") {
          alert("请先选择要搜索的类型");
        } else if (select === 0 && searchword !== "") {
          // 按城市搜索
          api.getHouseByCityGA(searchword, uname).then(res => {
            this.houseList = res.data.data;
            // console.log(this.houseList);
          });
        } else if (select === 1 && searchword !== "") {
          // 按房子类型搜索
          api.getHouseByTypeGA(searchword, uname).then(res => {
            this.houseList = res.data.data;
            // console.log(res);
          });
        } else if (select === 2 && searchword !== "") {
          // 按房子出租类型搜索
          api.getHouseByRTypeGA(searchword, uname).then(res => {
            this.houseList = res.data.data;
          });
        } else if (select === 3 && searchword !== "") {
          // 按房子业主搜索
          api.getHouseByCrealnameGA(searchword, uname).then(res => {
            // console.log(res);
            this.houseList = res.data.data;
          });
        } else if (select === 4 && searchword !== "") {
          // 按房子业主搜索
          api.getHouseByTelGA(searchword, uname).then(res => {
            // console.log(res);
            this.houseList = res.data.data;
          });
        }
      } else {
        if (select === "") {
          alert("请先选择要搜索的类型");
        } else if (select === 0 && searchword !== "") {
          // 按城市搜索
          api.getHouseByCity(searchword).then(res => {
            this.houseList = res.data.data;
            // console.log(this.houseList);
          });
        } else if (select === 1 && searchword !== "") {
          // 按房子类型搜索
          api.getHouseByType(searchword).then(res => {
            this.houseList = res.data.data;
            // console.log(res);
          });
        } else if (select === 2 && searchword !== "") {
          // 按房子出租类型搜索
          api.getHouseByRType(searchword).then(res => {
            this.houseList = res.data.data;
          });
        } else if (select === 3 && searchword !== "") {
          // 按房子业主搜索
          api.getHouseByCrealname(searchword).then(res => {
            this.houseList = res.data.data;
          });
        } else if (select === 4 && searchword !== "") {
          // 按房子业主电话搜索
          api.getHouseByCTel(searchword).then(res => {
            this.houseList = res.data.data;
          });
        } else if (select === 5 && searchword !== "") {
          // 按房子管理员搜索
          api.getHouseByGAdmin(searchword).then(res => {
            // console.log(res);
            this.houseList = res.data.data;
          });
        }
      }
    },
    // 监听展开行事件
    expandChange(row, expandedRows) {
      // 只展开一行
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id);
        }
      } else {
        this.expands = [];
      }
      // console.log(row);
      let houseName = row.title;
      // console.log(houseName);
      // 获取对应的租客信息
      api.getOrderByhouseName(houseName).then(res => {
        console.log(res, 132);
        this.orderList = res.data.data;
      });
      // 获取对应的看房记录
    },
    // 监听删除事件
    handleDel(row) {
      // console.log(row.id,row.title);
      let houseId = row.id;
      let houseName = row.title;
      // console.log(houseId,houseName);
      this.$confirm("此操作将永久删除该行信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(_ => {
          // 调用删除接口  -> 根据id和房子名字删除
          api
            .delHouseByIdAndName(houseId, {
              title: houseName
            })
            .then(res => {
              console.log(res);
              // window.location.reload();
              this.reload();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(_ => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 监听编辑事件 只有业主可以编辑
    handleEdit(row) {
      this.dialogFormVisible = true;
      let houseForm = this.houseForm;
      houseForm.title = row.title;
      houseForm.type = row.type;
      houseForm.rtype = row.rtype;
      houseForm.tel = row.tel;
      houseForm.id = row.id;
    },
    confirmForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          let houseForm = this.houseForm;
          let id = houseForm.id;
          let title = houseForm.title;
          let type = houseForm.type;
          let rtype = houseForm.rtype;
          let tel = houseForm.tel;
          alert("提交成功!");
          // 更新数据库
          api
            .updatetHouseSomeField(id, {
              title,
              type,
              rtype,
              tel
            })
            .then(res => {
              // console.log(res);
              // window.location.reload();
              this.reload();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
        } else if (prop.indexOf("uid") !== -1) {
          this.uid = obj[prop];
          //  console.log(this.uid);
        } else if (prop.indexOf("uname") !== -1) {
          this.uname = obj[prop];
          //  console.log(this.uid);
        }
      }
    },
    // 监听输入框input事件
    handleInput(value){
      console.log(value);
      let uauthority = this.uauthority;
      if(uauthority == 2 && value == ''){
        // 业主 输入框内容为空时 重新请求数据
        api.getHouseByCid(this.uid).then(res => {
        this.houseList = res.data.data;
      });
      }else if(uauthority == -1 && value == ''){
        // 普通管理员 输入框内容为空时 重新请求数据
        api.getHouseInfoByGAdmin(this.uname).then(res => {
          // console.log(res)
        this.houseList = res.data.data;
      });
      }else if(uauthority == -2 && value == ''){
        api.getHouse().then(res=>{
          this.houseList = res.data.data
        })
      }
    }

  }
};
</script>

<style>
.input-with-select {
  width: 450px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/* 数据展示的表格 */
.table-box {
  margin-top: 15px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>